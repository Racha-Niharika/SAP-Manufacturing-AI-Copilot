import "dotenv/config";

import { GoogleGenAI } from "@google/genai";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

import path from "node:path";
import { fileURLToPath } from "node:url";

import { retrieveKnowledge } from "../rag/rag-service.mjs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const MODEL =
  process.env.GEMINI_GENERATION_MODEL || "gemini-3.5-flash";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const serverPath = path.resolve(
  currentDir,
  "../mcp/server.mjs"
);

// Only allow read-only tools in this first agent version.
const ALLOWED_MCP_TOOLS = new Set([
  "get_production_orders",
  "get_production_order_details",
  "get_delayed_production_orders"
]);

// Convert MCP tool results into JSON that Gemini can understand.
function normalizeToolResult(result) {
  return {
    isError: Boolean(result.isError),
    content: (result.content || []).map(item => {
      if (item.type === "text") {
        try {
          return JSON.parse(item.text);
        } catch {
          return item.text;
        }
      }

      return item;
    })
  };
}

export async function runManufacturingAgent(question) {

  if (!question || !question.trim()) {
    throw new Error("Question is required");
  }

  const client = new Client({
    name: "sap-manufacturing-ai-agent",
    version: "1.0.0"
  });

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
    cwd: path.resolve(currentDir, "../..")
  });

  try {

    // 1. Connect to the existing MCP server.
    await client.connect(transport);

    // 2. Discover tools dynamically.
    const mcpResponse = await client.listTools();

    const mcpTools = mcpResponse.tools.filter(tool =>
      ALLOWED_MCP_TOOLS.has(tool.name)
    );

    // 3. Convert MCP tools into Gemini function declarations.
    const mcpDeclarations = mcpTools.map(tool => ({
      name: tool.name,
      description: tool.description || tool.name,
      parametersJsonSchema: tool.inputSchema || {
        type: "object",
        properties: {}
      }
    }));

    // 4. Add RAG as another function available to Gemini.
    const ragDeclaration = {
      name: "search_manufacturing_sop",
      description:
        "Search manufacturing SOP documents for procedures, " +
        "material shortages, production delays and machine maintenance.",
      parametersJsonSchema: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "Question to search in manufacturing SOP documents"
          }
        },
        required: ["question"]
      }
    };

    const functionDeclarations = [
      ...mcpDeclarations,
      ragDeclaration
    ];

    // 5. Give Gemini the available tools and the user's question.
    const systemInstruction = `
You are an intelligent SAP Manufacturing AI Copilot.

You can use these tools:

1. SAP MCP tools:
   Retrieve live production-order information from SAP S/4HANA.

2. search_manufacturing_sop:
   Retrieve manufacturing procedures from the company's SOP documents.

Instructions:

- Decide which tools are needed to answer the user's question.
- For questions about delayed production orders, use the relevant SAP tool.
- For questions about manufacturing procedures, use the SOP search tool.
- For questions involving both live SAP information and recommended actions,
  use both SAP and SOP tools.
- Do not invent production-order information.
- Do not claim that an order is delayed due to a material shortage unless
  the retrieved data establishes that connection.
- Clearly distinguish SAP facts from SOP recommendations.
- Cite SOP sources using their document names.
- If information is unavailable, say so.
- Do not perform any SAP write operations.
- Never claim to have created or changed anything in SAP.
- Prefer concise, well-structured answers.
- If there are more than 10 production orders, show only the top 10 key orders in the table and summarize the total remaining count.
- Never generate an unnecessarily large table.
- Always complete the answer with an executive summary and actionable SOP recommendations.
- Do not stop in the middle of a table or sentence.
`;

    let contents = [
      {
        role: "user",
        parts: [{ text: question }]
      }
    ];

    let response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: {
        systemInstruction,
        temperature: 0.2,
        maxOutputTokens: 3500,
        tools: [
          {
            functionDeclarations
          }
        ]
      }
    });

    const executionLog = [];

    // 6. Execute tool calls and send their results back to Gemini.
    const MAX_TOOL_ROUNDS = 5;

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {

      const functionCalls = response.functionCalls || [];

      if (functionCalls.length === 0) {
        break;
      }

      // Preserve Gemini's previous response in the conversation.
      const candidateContent = response.candidates?.[0]?.content;

      if (!candidateContent) {
        throw new Error("Gemini returned no candidate content for tool calls");
      }

      contents.push(candidateContent);

      const functionResponseParts = [];

      for (const call of functionCalls) {

        const args = call.args || {};

        let toolResult;

        try {

          // Execute the RAG function locally.
          if (call.name === "search_manufacturing_sop") {

            if (typeof args.question !== "string" || !args.question.trim()) {
              throw new Error("A valid SOP search question is required");
            }

            toolResult = await retrieveKnowledge(args.question);

          }

          // Execute an existing MCP tool.
          else if (ALLOWED_MCP_TOOLS.has(call.name)) {

            const matchingTool = mcpTools.find(
              tool => tool.name === call.name
            );

            if (!matchingTool) {
              throw new Error("MCP tool is not available");
            }

            toolResult = await client.callTool({
              name: call.name,
              arguments: args
            });

            toolResult = normalizeToolResult(toolResult);

          }

          else {
            throw new Error("Tool is not permitted: " + call.name);
          }

          executionLog.push({
            tool: call.name,
            status: "success"
          });

        } catch (error) {

          toolResult = {
            error: true,
            message: error.message
          };

          executionLog.push({
            tool: call.name,
            status: "failed"
          });
        }

        functionResponseParts.push({
          functionResponse: {
            name: call.name,
            response: {
              result: toolResult
            }
          }
        });
      }

      // Send tool results to Gemini for further reasoning.
      contents.push({
        role: "user",
        parts: functionResponseParts
      });

      response = await ai.models.generateContent({
        model: MODEL,
        contents,
        config: {
          systemInstruction,
          temperature: 0.2,
          maxOutputTokens: 3500,
          tools: [
            {
              functionDeclarations
            }
          ]
        }
      });
    }

    const answer = response.text;

    if (!answer) {
      throw new Error(
        "Agent did not generate a final answer. Tool-call limit may have been reached."
      );
    }

    return {
      question,
      answer,
      toolsExecuted: executionLog
    };

  } finally {

    await client.close();

  }
}
