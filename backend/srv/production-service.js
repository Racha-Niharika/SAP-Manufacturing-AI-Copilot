const cds = require('@sap/cds');
const crypto = require('node:crypto');
const { getProductionOrders } = require('./integrations/s4hana-client');

/** Generate a deterministic UUID from the SAP order number so repeated syncs upsert without duplicates. */
function orderToUuid(orderNumber) {
    const hash = crypto.createHash('sha256').update(String(orderNumber)).digest('hex');
    return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

module.exports = class ProductionService extends cds.ApplicationService {
    async init() {
        const { ProductionOrders } = this.entities;
        let syncingPromise = null;

        const syncFromS4 = async () => {
            if (syncingPromise) return syncingPromise;

            syncingPromise = (async () => {
                const orders = await getProductionOrders(100);
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

        // Auto-sync live S/4HANA data on first read when database table is empty
        this.before('READ', 'ProductionOrders', async () => {
            const [{ count }] = await SELECT.from(ProductionOrders).columns('count(*) as count');
            if (count === 0) {
                await syncFromS4();
            }
        });

        // Action: Refresh production orders from S/4HANA Cloud into database
        this.on('fetchFromS4', async () => {
            try {
                const orders = await syncFromS4();
                return JSON.stringify({ status: 'SUCCESS', count: orders.length, orders });
            } catch (err) {
                console.error('❌ S/4HANA Sync Error:', err.message);
                return JSON.stringify({ status: 'ERROR', message: err.message });
            }
        });

        await super.init();
    }
};
