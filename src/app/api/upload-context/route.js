import { extractText } from "unpdf";
import mammoth from "mammoth";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = file.name || "";
    const type = file.type || "";
    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);
    const buffer = Buffer.from(bytes);

    let extractedText = "";

    if (filename.toLowerCase().endsWith(".pdf") || type === "application/pdf") {
      const { text } = await extractText(uint8Array);
      extractedText = Array.isArray(text) ? text.join("\n\n") : (text || "");
    } else if (
      filename.toLowerCase().endsWith(".docx") ||
      type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || "";
    } else if (filename.toLowerCase().endsWith(".txt") || type.startsWith("text/")) {
      extractedText = buffer.toString("utf-8");
    } else {
      return Response.json(
        { error: "Unsupported file type. Please upload a .pdf, .docx, or .txt file." },
        { status: 400 }
      );
    }

    extractedText = extractedText.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

    return Response.json({ text: extractedText });
  } catch (err) {
    console.error("Error in upload-context API:", err);
    return Response.json(
      { error: "Failed to parse file: " + err.message },
      { status: 500 }
    );
  }
}
