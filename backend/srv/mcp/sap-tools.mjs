const BASE_URL = process.env.CAP_API_URL || "http://localhost:4004";
const CAP_URL = BASE_URL.includes("/production") ? BASE_URL : `${BASE_URL.replace(/\/+$/, "")}/production`;

function validateOrderNumber(orderNumber, required = true) {
    const clean = String(orderNumber || "").trim();
    if (!clean) {
        if (required) throw new Error("Production order number is required");
        return "";
    }
    if (!/^[A-Za-z0-9_-]{1,20}$/.test(clean)) {
        throw new Error("Invalid production order number");
    }
    return clean;
}

async function callCapAction(actionName, payload = {}) {
    const url = `${CAP_URL}/${actionName}`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`CAP action ${actionName} failed (${response.status}): ${body}`);
    }

    const raw = await response.json();
    const parsed = typeof raw?.value === "string" ? JSON.parse(raw.value) : raw;
    if (parsed?.status === "ERROR") {
        throw new Error(parsed.message || `SAP/CAP action ${actionName} failed`);
    }
    return parsed;
}

export async function releaseProductionOrder(orderNumber) {
    const cleanOrder = validateOrderNumber(orderNumber, true);
    return callCapAction("releaseOrder", { orderNumber: cleanOrder });
}

export async function tecoProductionOrder(orderNumber) {
    const cleanOrder = validateOrderNumber(orderNumber, true);
    return callCapAction("tecoOrder", { orderNumber: cleanOrder });
}

export async function createMaintenanceNotification({
    orderNumber = "",
    equipment = "",
    title,
    description,
    priority = "Medium"
}) {
    const cleanOrder = validateOrderNumber(orderNumber, false);
    const cleanTitle = String(title || "").trim();
    const cleanDescription = String(description || "").trim();
    if (!cleanTitle || !cleanDescription) {
        throw new Error("Both title and description are required to create a maintenance notification");
    }
    return callCapAction("createMaintenanceNotification", {
        orderNumber: cleanOrder,
        equipment: String(equipment || "").trim(),
        title: cleanTitle,
        description: cleanDescription,
        priority: String(priority || "Medium").trim()
    });
}

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
