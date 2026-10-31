export function splitIntoChunks(
    text,
    chunkSize = 1000,
    overlap = 150
) {
    const cleanText = text
        .replace(/\r/g, "")
        .replace(/[ \t]+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    const chunks = [];
    let start = 0;

    while (start < cleanText.length) {
        let end = Math.min(start + chunkSize, cleanText.length);

        // Prefer ending at a word boundary
        if (end < cleanText.length) {
            const boundary = cleanText.lastIndexOf(" ", end);
            if (boundary > start) {
                end = boundary;
            }
        }

        const chunk = cleanText.slice(start, end).trim();
        if (chunk.length > 0) {
            chunks.push(chunk);
        }

        if (end >= cleanText.length) {
            break;
        }

        start = end - overlap;
    }

    return chunks;
}
