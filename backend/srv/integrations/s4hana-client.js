const cds = require('@sap/cds');

/**
 * Reusable client for S/4HANA Cloud Production Order API (API_PRODUCTION_ORDER_2_SRV_0001)
 * Connects via CAP standard cds.connect.to.
 */
async function getProductionOrders(top = 100) {
    // Unescape Docker Compose $$ -> $ if present in local .env password
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

    console.log(`✅ Fetched ${raw?.length || 0} production orders from S/4HANA Cloud`);

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

module.exports = { getProductionOrders };
