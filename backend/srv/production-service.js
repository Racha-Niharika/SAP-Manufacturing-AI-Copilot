const cds = require('@sap/cds');
const { getProductionOrders } = require('./integrations/s4hana-client');

module.exports = class ProductionService extends cds.ApplicationService {
    async init() {
        const { ProductionOrders } = this.entities;

        // Auto-sync from S/4HANA on first load if table is empty
        this.before('READ', 'ProductionOrders', async () => {
            const [{ count }] = await SELECT.from(ProductionOrders).columns('count(*) as count');
            if (count === 0) await this.send('fetchFromS4');
        });

        // Action: Fetch production orders from S/4HANA Cloud and upsert to database
        this.on('fetchFromS4', async () => {
            try {
                const orders = await getProductionOrders();
                if (orders?.length && cds.db) {
                    await UPSERT.into(ProductionOrders).entries(
                        orders.map(o => ({ ID: cds.utils.uuid(), ...o }))
                    );
                }
                return JSON.stringify({ status: 'SUCCESS', count: orders.length, orders });
            } catch (err) {
                console.error('❌ S/4HANA Sync Error:', err.message);
                return JSON.stringify({ status: 'ERROR', message: err.message });
            }
        });

        await super.init();
    }
};
