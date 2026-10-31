import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

export async function generateEmbedding(text) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing");
    }

    const result = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config: { outputDimensionality: 768 }
    });

    const embedding = result.embeddings?.[0]?.values;
    if (!embedding || embedding.length !== 768) {
        throw new Error("Invalid embedding response");
    }

    return embedding;
}
