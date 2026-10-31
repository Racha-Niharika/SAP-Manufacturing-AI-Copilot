import { generateEmbedding } from "./embedding-service.mjs";
import { searchSimilarChunks } from "./vector-repository.mjs";

export async function retrieveKnowledge(question) {
    if (!question || !question.trim()) {
        throw new Error("Question is required");
    }

    // Step 1: Convert user question to embedding
    const queryEmbedding = await generateEmbedding(question);

    // Step 2: Search PostgreSQL
    const results = await searchSimilarChunks(queryEmbedding, 5);

    // Step 3: Return relevant document chunks
    return results;
}
