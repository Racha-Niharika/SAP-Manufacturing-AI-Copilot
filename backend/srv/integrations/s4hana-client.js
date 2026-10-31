const cds = require('@sap/cds');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');

/**
 * Reusable client for S/4HANA Cloud Production Order API (API_PRODUCTION_ORDER_2_SRV)
 */
async function getProductionOrders(top = 50) {
    const creds = cds.env.requires.API_PRODUCTION_ORDER_2_SRV_0001?.credentials || {};
    
    // Resolve destination (BTP) or direct URL + Basic Auth (Local)
    const destination = creds.destination ? { destinationName: creds.destination } : {
        url: creds.url,
        username: creds.username?.trim(),
        password: creds.password?.replace(/\$\$/g, '$')
    };

    if (!destination.destinationName && (!destination.username || !destination.password)) {
        throw new Error('S/4HANA credentials missing in .env');
    }

    const response = await executeHttpRequest(destination, {
        method: 'get',
        url: `/A_ProductionOrder_2?$top=${top}&$format=json`
    });

    const raw = response.data?.d?.results || response.data?.value || [];
    return raw.map(item => ({
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
