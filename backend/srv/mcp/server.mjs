import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import {
    getProductionOrders,
    getProductionOrderDetails,
    getDelayedProductionOrders,
    releaseProductionOrder,
    tecoProductionOrder,
    createMaintenanceNotification
} from "./sap-tools.mjs";

async function runWriteTool(fn) {
    try {
        const result = await fn();
        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
    } catch (err) {
        return {
            isError: true,
            content: [{ type: "text", text: JSON.stringify({ status: "ERROR", message: err.message }) }]
        };
    }
}

const server = new McpServer({
    name: "sap-manufacturing-mcp",
    version: "1.0.0"
});

// TOOL 1: Get production orders
server.registerTool(
    "get_production_orders",
    {
        description: "Retrieve production orders from SAP S/4HANA through CAP",
        inputSchema: z.object({
            limit: z.number().int().min(1).max(100).default(20)
        })
    },
    async ({ limit }) => {
        try {
            const result = await getProductionOrders(limit);
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
            return { isError: true, content: [{ type: "text", text: error.message }] };
        }
    }
);

// TOOL 2: Get specific production order
server.registerTool(
    "get_production_order_details",
    {
        description: "Retrieve details of a specific SAP production order",
        inputSchema: z.object({
            orderNumber: z.string().min(1).max(20)
        })
    },
    async ({ orderNumber }) => {
        try {
            const result = await getProductionOrderDetails(orderNumber);
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
            return { isError: true, content: [{ type: "text", text: error.message }] };
        }
    }
);

// TOOL 3: Get delayed production orders
server.registerTool(
    "get_delayed_production_orders",
    {
        description: "Retrieve delayed or in-progress production orders from SAP through CAP",
        inputSchema: z.object({})
    },
    async () => {
        try {
            const result = await getDelayedProductionOrders();
            return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
        } catch (error) {
            return { isError: true, content: [{ type: "text", text: error.message }] };
        }
    }
);

server.registerTool(
    "release_production_order",
    {
        description: "Release a production order in SAP S/4HANA",
        inputSchema: z.object({
            orderNumber: z.string().min(1).max(20).describe("SAP production order number, e.g. 1000001")
        })
    },
    async ({ orderNumber }) => runWriteTool(() => releaseProductionOrder(orderNumber))
);

server.registerTool(
    "teco_production_order",
    {
        description: "Set a production order to TECO (Technically Complete) in SAP S/4HANA",
        inputSchema: z.object({
            orderNumber: z.string().min(1).max(20).describe("SAP production order number, e.g. 1000001")
        })
    },
    async ({ orderNumber }) => runWriteTool(() => tecoProductionOrder(orderNumber))
);

server.registerTool(
    "create_maintenance_notification",
    {
        description: "Create a maintenance notification for an equipment issue or production order anomaly",
        inputSchema: z.object({
            orderNumber: z.string().max(20).optional().describe("Optional related production order number"),
            equipment: z.string().max(40).optional().describe("Optional equipment or work center ID"),
            title: z.string().min(1).max(100).describe("Short maintenance notification title"),
            description: z.string().min(1).max(1000).describe("Detailed maintenance issue description"),
            priority: z.enum(["Low", "Medium", "High", "Critical"]).default("Medium").describe("Notification priority")
        })
    },
    async (args) => runWriteTool(() => createMaintenanceNotification(args))
);

await serveStdio(() => server);
