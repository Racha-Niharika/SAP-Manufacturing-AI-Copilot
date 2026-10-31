import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import path from "node:path";

const serverPath = path.resolve("srv/mcp/server.mjs");

const client = new Client({
    name: "sap-manufacturing-agent",
    version: "1.0.0"
});

const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
    cwd: process.cwd()
});

async function main() {
    try {
        console.log("Connecting to SAP Manufacturing MCP Server...");
        await client.connect(transport);
        console.log("MCP connection successful!");

        const result = await client.listTools();
        console.log("\nAvailable MCP tools:");
        for (const tool of result.tools) {
            console.log({
                name: tool.name,
                description: tool.description
            });
        }

        // Test one existing read-only MCP tool
        const toolResult = await client.callTool({
            name: "get_delayed_production_orders",
            arguments: {}
        });

        console.log("\nDelayed Production Orders:");
        console.log(JSON.stringify(toolResult, null, 2));

    } catch (error) {
        console.error("MCP Client Error:", error);
    } finally {
        await client.close();
    }
}

main();
