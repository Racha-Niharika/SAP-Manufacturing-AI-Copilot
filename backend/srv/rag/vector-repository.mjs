import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || "admin",
    password: process.env.PGPASSWORD || "localpassword",
    database: process.env.PGDATABASE || "manufacturing_ai"
});

let initialized = false;

export async function ensureVectorStore() {
    if (initialized) return;
    await pool.query("CREATE EXTENSION IF NOT EXISTS vector;");
    await pool.query(`
        CREATE TABLE IF NOT EXISTS rag_chunks (
            id SERIAL PRIMARY KEY,
            document_name VARCHAR(255) NOT NULL,
            chunk_index INTEGER NOT NULL,
            content TEXT NOT NULL,
            embedding vector(768),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT unique_doc_chunk UNIQUE (document_name, chunk_index)
        );
    `);
    initialized = true;
}

export async function saveChunk(
    documentName,
    chunkIndex,
    content,
    embedding
) {
    await ensureVectorStore();
    const vector = `[${embedding.join(",")}]`;
    const query = `
        INSERT INTO rag_chunks (document_name, chunk_index, content, embedding)
        VALUES ($1, $2, $3, $4::vector)
        ON CONFLICT (document_name, chunk_index)
        DO UPDATE SET
            content = EXCLUDED.content,
            embedding = EXCLUDED.embedding,
            created_at = CURRENT_TIMESTAMP
    `;
    await pool.query(query, [
        documentName,
        chunkIndex,
        content,
        vector
    ]);
}

export async function deleteDocumentChunks(documentName) {
    await ensureVectorStore();
    await pool.query(
        "DELETE FROM rag_chunks WHERE document_name = $1",
        [documentName]
    );
}

export async function searchSimilarChunks(
    embedding,
    limit = 5
) {
    await ensureVectorStore();
    const vector = `[${embedding.join(",")}]`;
    const query = `
        SELECT
            id,
            document_name,
            chunk_index,
            content,
            1 - (embedding <=> $1::vector) AS similarity
        FROM rag_chunks
        ORDER BY embedding <=> $1::vector
        LIMIT $2
    `;
    const result = await pool.query(query, [
        vector,
        limit
    ]);
    return result.rows;
}
