const BASE_URL = process.env.CAP_API_URL || "http://localhost:4004";
const CAP_URL = BASE_URL.includes("/production") ? BASE_URL : `${BASE_URL.replace(/\/+$/, "")}/production`;

async function callCAP(path = "") {
    const url = `${CAP_URL}/ProductionOrders${path}`;
    const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
        throw new Error(`CAP API failed: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    // Support CAP OData V4 and OData V2 response formats
    return data.value ?? data.d?.results ?? data;
}

export async function getProductionOrders(limit = 20) {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const data = await callCAP(`?$top=${safeLimit}`);
    return data;
}

export async function getProductionOrderDetails(orderNumber) {
    if (!/^[A-Za-z0-9_-]{1,20}$/.test(orderNumber)) {
        throw new Error("Invalid production order number");
    }
    const filter = encodeURIComponent(`orderNumber eq '${orderNumber}'`);
    const data = await callCAP(`?$filter=${filter}&$top=1`);
    return data;
}

export async function getDelayedProductionOrders() {
    // Check for 'Delayed' orders; if none exist in current tenant data, check 'In Progress'
    let filter = encodeURIComponent("status eq 'Delayed'");
    let data = await callCAP(`?$filter=${filter}&$top=100`);
    if (!data || data.length === 0) {
        filter = encodeURIComponent("status eq 'In Progress'");
        data = await callCAP(`?$filter=${filter}&$top=100`);
    }
    return data;
}
