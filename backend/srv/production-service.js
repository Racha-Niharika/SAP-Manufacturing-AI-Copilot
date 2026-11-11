const cds = require('@sap/cds');
const crypto = require('node:crypto');

/** Build a deterministic UUID from the SAP order number so repeated upserts update instead of duplicating rows. */
function orderToUuid(orderNumber) {
    const hash = crypto.createHash('sha256').update(String(orderNumber)).digest('hex');
    return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

/** Fetch production orders from SAP S/4HANA Cloud and map them to the local ProductionOrders shape. */
async function fetchOrdersFromS4(top = 100) {
    // Unescape Docker Compose $$ -> $ before CAP initializes the Basic Auth header
    const creds = cds.env.requires.API_PRODUCTION_ORDER_2_SRV_0001?.credentials;
    if (creds?.password) {
        creds.password = creds.password.replace(/\$\$/g, '$');
    }

    const s4 = await cds.connect.to('API_PRODUCTION_ORDER_2_SRV_0001');
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
        status: item.OrderIsDelivered ? 'Delivered' :
                item.OrderIsConfirmed ? 'Completed' :
                item.OrderIsReleased ? 'Released' : 'In Progress',
        plant: item.ProductionPlant || item.Plant || ''
    }));
}

module.exports = class ProductionService extends cds.ApplicationService {
    async init() {
        const { ProductionOrders } = this.entities;
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

        await super.init();
    }
};
