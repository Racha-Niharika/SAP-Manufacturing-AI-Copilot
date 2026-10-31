import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { retrieveKnowledge } from "./rag-service.mjs";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export async function askManufacturingAssistant(question) {
    if (!question || !question.trim()) {
        throw new Error("Question is required");
    }

    // Step 1: Retrieve relevant SOP chunks from vector repository
    const chunks = await retrieveKnowledge(question);

    if (!chunks || chunks.length === 0) {
        return {
            question,
            answer: "I could not find relevant information in the company's Standard Operating Procedures (SOPs).",
            sources: [],
            grounded: false
        };
    }

    // Step 2: Build formatted context with source attribution
    const context = chunks
        .map((chunk, idx) => `[S${idx + 1}] Source: ${chunk.document_name} (Chunk ${chunk.chunk_index}):\n${chunk.content}`)
        .join("\n\n---\n\n");

    // Step 3: Construct grounded generation prompt
    const prompt = `You are the SAP Manufacturing AI Copilot assistant. Your role is to answer questions for manufacturing operations strictly based on the company's Standard Operating Procedures (SOPs) provided below.

Context:
${context}

User Question:
${question}

Instructions:
1. Answer the question accurately using ONLY the information provided in the Context above.
2. Cite the source document name(s) and references (e.g. [S1], [S2]) where appropriate.
3. If the provided context does NOT contain information to answer the question (for example, HR policies, employee salaries, or unrelated topics), clearly state: "I could not find relevant information in the company's Standard Operating Procedures (SOPs)." Do NOT extrapolate or guess answers beyond the context.
4. Structure the response clearly with numbered steps or bullet points for actionable procedures.`;

    // Step 4: Call Gemini LLM
    const model = process.env.GEMINI_GENERATION_MODEL || "gemini-3.5-flash";
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            temperature: 0.2,
            maxOutputTokens: 1200
        }
    });

    return {
        question,
        answer: response.text,
        sources: chunks.map(c => ({
            document_name: c.document_name,
            chunk_index: c.chunk_index,
            similarity: c.similarity
        })),
        grounded: true
    };
}
