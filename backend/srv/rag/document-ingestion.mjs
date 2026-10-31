import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { splitIntoChunks } from "./chunker.mjs";
import { generateEmbedding } from "./embedding-service.mjs";
import { saveChunk, deleteDocumentChunks } from "./vector-repository.mjs";

const currentDir = path.dirname(
    fileURLToPath(import.meta.url)
);
const documentsDir = path.resolve(
    currentDir,
    "../../documents"
);

export async function ingestDocuments() {
    const files = await fs.readdir(documentsDir);
    const textFiles = files.filter(file =>
        file.toLowerCase().endsWith(".txt")
    );

    let totalChunks = 0;

    for (const file of textFiles) {
        console.log(`Processing: ${file}`);
        const filePath = path.join(documentsDir, file);
        const text = await fs.readFile(
            filePath,
            "utf8"
        );

        const chunks = splitIntoChunks(text);
        await deleteDocumentChunks(file);

        for (let i = 0; i < chunks.length; i++) {
            const embedding = await generateEmbedding(chunks[i]);
            await saveChunk(file, i, chunks[i], embedding);
            totalChunks++;
            console.log(`Saved chunk ${i + 1} of ${file}`);
        }
    }

    return {
        documentsProcessed: textFiles.length,
        chunksStored: totalChunks
    };
}
