const cds = require('@sap/cds');
const crypto = require('node:crypto');

/** Build a deterministic UUID from the SAP order number so repeated upserts update instead of duplicating rows. */
function orderToUuid(orderNumber) {
    const hash = crypto.createHash('sha256').update(String(orderNumber)).digest('hex');
    return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

/** Extract readable SAP Gateway / Axios error text when available. */
function extractErrorMessage(err) {
    return (
        err?.reason?.response?.body?.error?.message?.value ||
        err?.reason?.response?.data?.error?.message?.value ||
        err?.response?.data?.error?.message?.value ||
        err?.message ||
        'Unknown S/4HANA error'
    );
}

/** Validate a production order identifier before building OData paths. */
function sanitizeOrderNumber(orderNumber) {
    const clean = String(orderNumber || '').trim();
    if (!/^[A-Za-z0-9_-]{1,20}$/.test(clean)) {
        throw new Error(`Invalid production order number: "${clean}"`);
    }
    return clean;
}

/** Connect to S/4HANA Production Order API with Docker Compose $$ password unescaping. */
async function connectS4() {
    // Unescape Docker Compose $$ -> $ before CAP initializes the Basic Auth header
    const creds = cds.env.requires.API_PRODUCTION_ORDER_2_SRV_0001?.credentials;
    if (creds?.password) {
        creds.password = creds.password.replace(/\$\$/g, '$');
    }
    return cds.connect.to('API_PRODUCTION_ORDER_2_SRV_0001');
}

/** Fetch production orders from SAP S/4HANA Cloud and map them to the local ProductionOrders shape. */
async function fetchOrdersFromS4(top = 100) {
    const s4 = await connectS4();
    const { A_ProductionOrder_2 } = s4.entities;

    const raw = await s4.run(
        SELECT.from(A_ProductionOrder_2)
            .columns(
                'ManufacturingOrder',
                'Material',
                'OrderLongText',
                'ManufacturingOrderType',
                'TotalQuantity',
                'MfgOrderConfirmedYieldQty',
                'OrderIsTechnicallyCompleted',
                'OrderIsDelivered',
                'OrderIsConfirmed',
                'OrderIsReleased',
                'ProductionPlant'
            )
            .limit(top)
    );

    console.log(`Fetched ${raw?.length || 0} production orders from S/4HANA Cloud`);

    return (raw || []).map(item => ({
        orderNumber: item.ManufacturingOrder || item.ProductionOrder || '',
        material: item.Material || '',
        description: item.OrderLongText || `${item.Material || 'Order'} (${item.ManufacturingOrderType || 'Standard'})`,
        plannedQty: parseInt(item.TotalQuantity || 0, 10),
        completedQty: parseInt(item.MfgOrderConfirmedYieldQty || 0, 10),
        status: item.OrderIsTechnicallyCompleted ? 'TECO' :
                item.OrderIsDelivered ? 'Delivered' :
                item.OrderIsConfirmed ? 'Completed' :
                item.OrderIsReleased ? 'Released' : 'In Progress',
        plant: item.ProductionPlant || item.Plant || ''
    }));
}

/** Execute an S/4HANA OData V2 FunctionImport (ReleaseOrder / TechlyCmpltOrder) and sync local status. */
async function executeS4OrderAction({ functionName, orderNumber, targetStatus, ProductionOrders }) {
    const cleanOrder = sanitizeOrderNumber(orderNumber);
    const s4 = await connectS4();
    const odataKey = cleanOrder.replace(/'/g, "''");

    const existing = await s4.send({
        method: 'GET',
        path: `/A_ProductionOrder_2('${encodeURIComponent(odataKey)}')?$select=ManufacturingOrder,LastChangeDateTime,OrderIsReleased,OrderIsTechnicallyCompleted`,
        headers: { Accept: 'application/json' }
    });
    const etag =
        existing?.__metadata?.etag ||
        existing?.d?.__metadata?.etag ||
        (existing?.LastChangeDateTime ? `W/"'${existing.LastChangeDateTime}'"` : '*');

    const sapResult = await s4.send({
        method: 'POST',
        path: `/${functionName}?ManufacturingOrder='${encodeURIComponent(odataKey)}'`,
        headers: {
            'If-Match': etag,
            Accept: 'application/json'
        },
        data: {}
    });

    if (cds.db && ProductionOrders) {
        await UPDATE(ProductionOrders)
            .set({ status: targetStatus })
            .where({ orderNumber: cleanOrder });
    }

    return {
        status: 'SUCCESS',
        source: 'S4HANA',
        orderNumber: cleanOrder,
        action: functionName,
        newStatus: targetStatus,
        sapResult: sapResult || null
    };
}

module.exports = class ProductionService extends cds.ApplicationService {
    async init() {
        const { ProductionOrders, MaintenanceNotifications } = this.entities;
        const ALLOWED_PRIORITIES = new Set(['Low', 'Medium', 'High', 'Critical']);
        const ORDER_ACTIONS = {
            releaseOrder: { functionName: 'ReleaseOrder', targetStatus: 'Released' },
            tecoOrder: { functionName: 'TechlyCmpltOrder', targetStatus: 'TECO' }
        };
        let syncingPromise = null;

        const syncFromS4 = async () => {
            // Share an in-flight sync so concurrent Fiori startup requests ($count + rows) only hit S/4HANA once
            if (syncingPromise) return syncingPromise;

            syncingPromise = (async () => {
                const orders = await fetchOrdersFromS4(100);
                const uniqueOrders = Array.from(
                    new Map(orders.filter(o => o.orderNumber).map(o => [o.orderNumber, o])).values()
                );

                if (uniqueOrders.length && cds.db) {
                    const batchSize = 50;
                    for (let i = 0; i < uniqueOrders.length; i += batchSize) {
                        const batch = uniqueOrders.slice(i, i + batchSize).map(o => ({
                            ID: orderToUuid(o.orderNumber),
                            ...o
                        }));
                        await UPSERT.into(ProductionOrders).entries(batch);
                    }
                }
                return uniqueOrders;
            })();

            try {
                return await syncingPromise;
            } finally {
                syncingPromise = null;
            }
        };

        // Populate the table automatically on first read when no CSV seed data exists
        this.before('READ', 'ProductionOrders', async () => {
            const [{ count }] = await SELECT.from(ProductionOrders).columns('count(*) as count');
            if (count === 0) {
                await syncFromS4();
            }
        });

        // Expose an explicit OData action to refresh orders from S/4HANA on demand
        this.on('fetchFromS4', async () => {
            try {
                const orders = await syncFromS4();
                return JSON.stringify({ status: 'SUCCESS', count: orders.length, orders });
            } catch (err) {
                console.error('S/4HANA Sync Error:', err.message);
                return JSON.stringify({ status: 'ERROR', message: err.message });
            }
        });

        // Register controlled S/4HANA order lifecycle actions (Release / TECO)
        for (const [actionName, cfg] of Object.entries(ORDER_ACTIONS)) {
            this.on(actionName, async (req) => {
                try {
                    const result = await executeS4OrderAction({
                        ...cfg,
                        orderNumber: req.data?.orderNumber,
                        ProductionOrders
                    });
                    return JSON.stringify(result);
                } catch (err) {
                    const message = extractErrorMessage(err);
                    console.error(`S/4HANA ${cfg.functionName} Error:`, message);
                    return JSON.stringify({
                        status: 'ERROR',
                        action: cfg.functionName,
                        orderNumber: req.data?.orderNumber || '',
                        message
                    });
                }
            });
        }

        // Persist maintenance notifications in CAP DB (no SAP PM OData API is configured in srv/external)
        this.on('createMaintenanceNotification', async (req) => {
            try {
                const {
                    orderNumber = '',
                    equipment = '',
                    title = '',
                    description = '',
                    priority = 'Medium'
                } = req.data || {};

                const cleanTitle = String(title || '').trim();
                const cleanDescription = String(description || '').trim();
                if (!cleanTitle && !cleanDescription) {
                    return JSON.stringify({
                        status: 'ERROR',
                        message: 'Either title or description is required to create a maintenance notification.'
                    });
                }

                const cleanOrder = String(orderNumber || '').trim();
                if (cleanOrder) {
                    sanitizeOrderNumber(cleanOrder);
                }

                const rawPriority = String(priority || '').trim();
                const normalizedPriority = ALLOWED_PRIORITIES.has(rawPriority) ? rawPriority : 'Medium';

                const entry = {
                    ID: crypto.randomUUID(),
                    notificationNumber: `MN-${Date.now().toString().slice(-6)}-${crypto.randomInt(100, 999)}`,
                    orderNumber: cleanOrder,
                    equipment: String(equipment || '').trim().slice(0, 40),
                    title: (cleanTitle || cleanDescription).slice(0, 100),
                    description: cleanDescription || cleanTitle,
                    priority: normalizedPriority,
                    status: 'Open',
                    createdAt: new Date().toISOString()
                };

                await INSERT.into(MaintenanceNotifications).entries(entry);

                return JSON.stringify({
                    status: 'SUCCESS',
                    source: 'CAP_DB',
                    notificationNumber: entry.notificationNumber,
                    orderNumber: entry.orderNumber,
                    equipment: entry.equipment,
                    title: entry.title,
                    priority: entry.priority,
                    notificationStatus: entry.status,
                    createdAt: entry.createdAt
                });
            } catch (err) {
                const message = extractErrorMessage(err);
                console.error('Create Maintenance Notification Error:', message);
                return JSON.stringify({ status: 'ERROR', message });
            }
        });

        await super.init();
    }
};
