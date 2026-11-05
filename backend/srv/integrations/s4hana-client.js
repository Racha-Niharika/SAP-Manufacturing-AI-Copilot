const cds = require('@sap/cds');

/**
 * Reusable client for S/4HANA Cloud Production Order API (API_PRODUCTION_ORDER_2_SRV)
 * Connects directly using CAP standard cds.connect.to
 */
async function getProductionOrders(top = 50) {
    const matdocapi = await cds.connect.to("API_PRODUCTION_ORDER_2_SRV");
    const { A_ProductionOrder_2 } = matdocapi.entities;

    const raw = await matdocapi.run(
        SELECT.from(A_ProductionOrder_2).limit(top)
    );

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
