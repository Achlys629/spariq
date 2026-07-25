export async function POST(request) {
  try {
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return Response.json(
        { error: "Groq API key not configured on server" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const language = formData.get("language") || "en";

    if (!file) {
      return Response.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert to a File/Blob that Groq API can consume
    const bytes = await file.arrayBuffer();
    const blob = new Blob([bytes], { type: file.type || "audio/webm" });
    const fileToSend = new File([blob], file.name || "recording.webm", {
      type: file.type || "audio/webm",
    });

    const groqFormData = new FormData();
    groqFormData.append("file", fileToSend);
    groqFormData.append("model", "whisper-large-v3");
    groqFormData.append("language", language);

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqKey}`,
      },
      body: groqFormData,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Groq Whisper API error:", data);
      return Response.json(
        { error: data.error?.message || "Failed to transcribe audio from Groq API" },
        { status: res.status }
      );
    }

    return Response.json({ transcript: data.text || "" });
  } catch (err) {
    console.error("Error in transcribe API:", err);
    return Response.json(
      { error: "Failed to transcribe audio: " + err.message },
      { status: 500 }
    );
  }
}
