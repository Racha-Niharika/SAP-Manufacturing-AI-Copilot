const cds = require("@sap/cds");

module.exports = class KnowledgeService extends cds.ApplicationService {
  async init() {
    const { ingestDocuments } = await import("./rag/document-ingestion.mjs");
    const { retrieveKnowledge } = await import("./rag/rag-service.mjs");
    const { askManufacturingAssistant } = await import("./rag/answer-service.mjs");

    this.on("ingestDocuments", async () => {
      try {
        const result = await ingestDocuments();
        return JSON.stringify(result);
      } catch (err) {
        console.error("Ingestion error:", err);
        return JSON.stringify({ error: err.message });
      }
    });

    this.on("searchKnowledge", async (req) => {
      try {
        const { question } = req.data;
        const results = await retrieveKnowledge(question);
        return JSON.stringify(results);
      } catch (err) {
        console.error("Knowledge search error:", err);
        return JSON.stringify({ error: err.message });
      }
    });

    this.on("askAssistant", async (req) => {
      try {
        const { question } = req.data;
        const result = await askManufacturingAssistant(question);
        return JSON.stringify(result);
      } catch (err) {
        console.error("Ask assistant error:", err);
        return JSON.stringify({ error: err.message });
      }
    });

    return super.init();
  }
};
