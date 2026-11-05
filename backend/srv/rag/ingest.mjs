import { ingestDocuments } from "./document-ingestion.mjs";

console.log("Starting SOP Document Ingestion into PostgreSQL/pgvector...");
ingestDocuments()
    .then((result) => {
        console.log("✅ Ingestion complete:", result);
        process.exit(0);
    })
    .catch((err) => {
        console.error("❌ Ingestion failed:", err);
        process.exit(1);
    });
