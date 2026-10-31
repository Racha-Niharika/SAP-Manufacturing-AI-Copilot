import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import {
    getProductionOrders,
    getProductionOrderDetails,
    getDelayedProductionOrders
} from "./sap-tools.mjs";

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

await serveStdio(() => server);
