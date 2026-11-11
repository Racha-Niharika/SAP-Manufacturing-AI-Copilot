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

const CANDIDATE_MODELS = Array.from(new Set([
  process.env.GEMINI_GENERATION_MODEL || "gemini-3.5-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-flash-lite-latest"
]));

let currentModelIndex = 0;

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const serverPath = path.resolve(
  currentDir,
  "../mcp/server.mjs"
);

const READ_MCP_TOOLS = new Set([
  "get_production_orders",
  "get_production_order_details",
  "get_delayed_production_orders"
]);

const WRITE_MCP_TOOLS = new Set([
  "release_production_order",
  "teco_production_order",
  "create_maintenance_notification"
]);

const ALLOWED_MCP_TOOLS = new Set([...READ_MCP_TOOLS, ...WRITE_MCP_TOOLS]);

/** Run an async callback against a connected STDIO MCP client. */
async function withMcpClient(fn) {
  const client = new Client({
    name: "sap-manufacturing-ai-agent",
    version: "1.0.0"
  });

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
    cwd: path.resolve(currentDir, "../.."),
    env: {
      ...process.env,
      CAP_API_URL: process.env.CAP_API_URL || `http://localhost:${process.env.PORT || 4004}`
    }
  });

  try {
    await client.connect(transport);
    return await fn(client);
  } finally {
    await client.close();
  }
}

/** Validate write tool arguments and construct an interactive HITL confirmation payload. */
function buildPendingAction(toolName, args = {}) {
  const orderNumber = String(args.orderNumber || "").trim();
  const id = `hitl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const validateRequiredOrder = () => {
    if (!/^[A-Za-z0-9_-]{1,20}$/.test(orderNumber)) {
      throw new Error(`A valid production order number is required for ${toolName}.`);
    }
  };

  if (toolName === "teco_production_order") {
    validateRequiredOrder();
    return {
      id,
      tool: toolName,
      arguments: { orderNumber },
      title: "Confirm SAP S/4HANA TECO Action",
      message: `Would you like me to set Order ${orderNumber} to TECO in SAP S/4HANA?`,
      targetSystem: "SAP S/4HANA",
      status: "pending"
    };
  }

  if (toolName === "release_production_order") {
    validateRequiredOrder();
    return {
      id,
      tool: toolName,
      arguments: { orderNumber },
      title: "Confirm SAP S/4HANA Release Action",
      message: `Would you like me to release Order ${orderNumber} in SAP S/4HANA?`,
      targetSystem: "SAP S/4HANA",
      status: "pending"
    };
  }

  if (toolName === "create_maintenance_notification") {
    const title = String(args.title || "").trim();
    const description = String(args.description || "").trim();
    if (!title || !description) {
      throw new Error("Both title and description are required to create a maintenance notification.");
    }
    const equipment = String(args.equipment || "").trim();
    const priority = ["Low", "Medium", "High", "Critical"].includes(args.priority)
      ? args.priority
      : "Medium";
    const scope = orderNumber
      ? ` for Order ${orderNumber}`
      : equipment
        ? ` for Equipment ${equipment}`
        : "";
    return {
      id,
      tool: toolName,
      arguments: { orderNumber, equipment, title, description, priority },
      title: "Confirm Maintenance Notification Creation",
      message: `Would you like me to create a ${priority}-priority Maintenance Notification ("${title}"${scope}) in CAP DB?`,
      targetSystem: "CAP Manufacturing DB",
      status: "pending"
    };
  }

  throw new Error(`Unsupported HITL write tool: ${toolName}`);
}

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

// Resilient caller with exponential backoff for transient 503/429 spikes + automatic fallback models
async function callGeminiWithRetry(params, maxRetries = 3) {
  let delay = 1500;

  for (let modelIdx = currentModelIndex; modelIdx < CANDIDATE_MODELS.length; modelIdx++) {
    const activeModel = CANDIDATE_MODELS[modelIdx];
    params.model = activeModel;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await ai.models.generateContent(params);
      } catch (err) {
        const isDailyQuota =
          err.message?.includes("requests per day") ||
          err.message?.includes("GenerateRequestsPerDay");

        if (isDailyQuota) {
          console.warn(`⚠️ Daily quota exhausted for model ${activeModel}. Switching to fallback model...`);
          currentModelIndex = Math.min(modelIdx + 1, CANDIDATE_MODELS.length - 1);
          break; // Try next candidate model
        }

        const isTransient =
          err.status === 503 ||
          err.status === 429 ||
          err.message?.includes("503") ||
          err.message?.includes("high demand") ||
          err.message?.includes("UNAVAILABLE");

        if (isTransient && attempt < maxRetries) {
          console.warn(`⚠️ Gemini API temporary load spike (${err.status || 503}). Retrying attempt ${attempt}/${maxRetries} in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }

        if (attempt === maxRetries && modelIdx < CANDIDATE_MODELS.length - 1) {
          console.warn(`⚠️ Model ${activeModel} unavailable after ${maxRetries} attempts. Trying fallback model...`);
          break;
        }

        throw err;
      }
    }
  }
}

export async function runManufacturingAgent(question, rawHistory = []) {

  if (!question || !question.trim()) {
    throw new Error("Question is required");
  }

  return withMcpClient(async (client) => {

    // 1 & 2. Discover tools dynamically from connected MCP server.
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

    // 5. Give Gemini the available tools, conversation history, and user's question.
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
- Conversational Context & Memory:
  Use previous messages in this conversation to resolve references like "it", "that order", "its status", "the delay", or follow-up questions.
  When the user asks for more details about an order discussed earlier, refer to its order number and fetch or summarize the relevant facts.
- Do not invent production-order information.
- Do not claim that an order is delayed due to a material shortage unless
  the retrieved data establishes that connection.
- Clearly distinguish SAP facts from SOP recommendations.
- Cite SOP sources using their document names.
- If information is unavailable, say so.
- Write actions (release_production_order, teco_production_order, create_maintenance_notification) require explicit Human-in-the-Loop (HITL) approval.
- Whenever the user asks to release an order, set an order to TECO, or create a maintenance notification, invoke the corresponding write tool so the UI displays an interactive [Confirm] / [Cancel] card.
- Never claim to have executed or completed any SAP/CAP write operation during askAgent. When a write tool returns AWAITING_HUMAN_CONFIRMATION, ask the user to click Confirm or Cancel in the confirmation card.
- Prefer concise, well-structured answers.
- If there are more than 10 production orders, show only the top 10 key orders in the table and summarize the total remaining count.
- Never generate an unnecessarily large table.
- Always complete the answer with an executive summary and actionable SOP recommendations.
- Do not stop in the middle of a table or sentence.
`;

    // Parse conversation history if provided
    let conversationHistory = [];
    if (typeof rawHistory === "string" && rawHistory.trim()) {
      try {
        conversationHistory = JSON.parse(rawHistory);
      } catch {
        conversationHistory = [];
      }
    } else if (Array.isArray(rawHistory)) {
      conversationHistory = rawHistory;
    }

    // Sanitize and format history turns
    const sanitizedHistory = [];
    if (Array.isArray(conversationHistory)) {
      // Keep only up to the last 6 turns (3 complete user/model rounds)
      const recentTurns = conversationHistory.slice(-6);

      for (const turn of recentTurns) {
        const role = turn.role === "assistant" || turn.role === "model" ? "model" : (turn.role === "user" ? "user" : null);
        const text = (turn.content || turn.text || "").trim();

        if (role && text) {
          // Truncate overly long model messages in history to save tokens and avoid quota spikes
          const trimmedText = role === "model" && text.length > 800 ? text.slice(0, 800) + "... [truncated]" : text;

          // Avoid consecutive duplicates of the same role
          if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === role) {
            sanitizedHistory[sanitizedHistory.length - 1].parts[0].text += `\n${trimmedText}`;
          } else {
            sanitizedHistory.push({
              role,
              parts: [{ text: trimmedText }]
            });
          }
        }
      }
    }

    // Gemini API requires alternating user -> model turns:
    // 1. History must start with 'user'
    while (sanitizedHistory.length > 0 && sanitizedHistory[0].role !== "user") {
      sanitizedHistory.shift();
    }

    // 2. The turn right before the current question must be 'model'
    // (since the current question is appended as 'user')
    while (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role !== "model") {
      sanitizedHistory.pop();
    }

    let contents = [
      ...sanitizedHistory,
      {
        role: "user",
        parts: [{ text: question }]
      }
    ];

    let response = await callGeminiWithRetry({
      model: CANDIDATE_MODELS[currentModelIndex],
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
    let pendingAction = null;

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
            executionLog.push({
              tool: call.name,
              status: "success"
            });

          }

          // Handle MCP tools (read tools run immediately; write tools pause for HITL confirmation).
          else if (ALLOWED_MCP_TOOLS.has(call.name)) {

            const matchingTool = mcpTools.find(
              tool => tool.name === call.name
            );

            if (!matchingTool) {
              throw new Error("MCP tool is not available");
            }

            if (WRITE_MCP_TOOLS.has(call.name)) {
              const candidateAction = buildPendingAction(call.name, args);
              if (!pendingAction) {
                pendingAction = candidateAction;
              }
              toolResult = {
                status: "AWAITING_HUMAN_CONFIRMATION",
                confirmationRequired: true,
                promptToShowUser: candidateAction.message,
                note: "This write operation has NOT run yet. Tell the user to click Confirm or Cancel on the confirmation card below, and do not claim the change is already applied."
              };
              executionLog.push({
                tool: call.name,
                status: "awaiting_confirmation"
              });
            } else {
              toolResult = await client.callTool({
                name: call.name,
                arguments: args
              });
              toolResult = normalizeToolResult(toolResult);
              executionLog.push({
                tool: call.name,
                status: toolResult.isError ? "failed" : "success"
              });
            }

          }

          else {
            throw new Error("Tool is not permitted: " + call.name);
          }

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

      response = await callGeminiWithRetry({
        model: CANDIDATE_MODELS[currentModelIndex],
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
      toolsExecuted: executionLog,
      pendingAction
    };

  });
}

/** Execute a previously proposed HITL write tool over MCP only after explicit user confirmation. */
export async function executeConfirmedAgentTool(toolName, rawArguments = {}) {
  if (!WRITE_MCP_TOOLS.has(toolName)) {
    throw new Error(`Tool "${toolName}" is not a permitted HITL write action.`);
  }

  let parsedArgs = rawArguments;
  if (typeof rawArguments === "string") {
    try {
      parsedArgs = JSON.parse(rawArguments || "{}");
    } catch {
      throw new Error("Invalid JSON arguments for confirmed action.");
    }
  }

  // Validate tool arguments cleanly before invoking the MCP server.
  const validated = buildPendingAction(toolName, parsedArgs || {});

  return withMcpClient(async (client) => {
    const mcpResponse = await client.listTools();
    const matchingTool = mcpResponse.tools.find(tool => tool.name === toolName);
    if (!matchingTool) {
      throw new Error(`MCP write tool "${toolName}" is not registered.`);
    }

    const rawResult = await client.callTool({
      name: toolName,
      arguments: validated.arguments
    });
    const normalized = normalizeToolResult(rawResult);
    const payload = normalized.content?.[0] ?? null;

    if (normalized.isError || payload?.status === "ERROR") {
      const errMsg =
        payload?.message ||
        (typeof payload === "string" ? payload : `MCP write tool "${toolName}" failed.`);
      throw new Error(errMsg);
    }

    return {
      status: "SUCCESS",
      tool: toolName,
      result: payload
    };
  });
}
