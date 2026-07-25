// src/app/api/debrief/route.js

const SCENARIO_LABELS = {
    interview: "corporate job interview",
    viva: "academic viva / oral exam",
    negotiation: "high-stakes business negotiation",
    difficult: "difficult personal or professional conversation",
};

function buildDebriefSystemPrompt(scenarioType) {
    const label = SCENARIO_LABELS[scenarioType] || "high-pressure conversation";
    return `You are a strict, expert performance coach evaluating a candidate's performance in a simulated ${label}.

Your job is to give honest, specific, actionable feedback — not generic praise or hollow criticism.

You MUST output ONLY a single valid JSON object. No preamble, no explanation, no markdown formatting, no code fences. Just the raw JSON.

The JSON must follow this exact shape:
{
  "strengths": ["specific strength referencing an actual moment from the transcript", "..."],
  "weaknesses": ["specific weak moment referencing an actual moment from the transcript", "..."],
  "scores": {
    "confidence": { "value": <integer 1-10>, "justification": "one sentence grounded in the transcript" },
    "communication": { "value": <integer 1-10>, "justification": "one sentence grounded in the transcript" },
    "criticalThinking": { "value": <integer 1-10>, "justification": "one sentence grounded in the transcript" }
  }
}

Rules:
- strengths and weaknesses must each contain 2–4 items, each referencing specific moments or quotes from the transcript.
- Score values must be integers between 1 and 10.
- Justifications must be a single sentence that cites observable evidence from the transcript.
- Do NOT output anything outside the JSON object. Any extra text will break the parser.`;
}

export async function POST(request) {
    try {
        const { transcript, scenarioType } = await request.json();

        if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
            return Response.json(
                { error: "Missing or empty transcript" },
                { status: 400 }
            );
        }

        if (!scenarioType) {
            return Response.json(
                { error: "Missing scenarioType" },
                { status: 400 }
            );
        }

        const systemPrompt = buildDebriefSystemPrompt(scenarioType);

        // Format the transcript into a readable block for Claude
        const transcriptText = transcript
            .map((m) => `${m.role === "user" ? "CANDIDATE" : "EVALUATOR"}: ${m.content}`)
            .join("\n\n");

        const userMessage = `Here is the full session transcript to evaluate:\n\n${transcriptText}\n\nProvide your evaluation as a JSON object only.`;

        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: "claude-sonnet-5",
                max_tokens: 1024,
                system: systemPrompt,
                messages: [{ role: "user", content: userMessage }],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Claude API error:", errorText);
            return Response.json(
                { error: "Claude API request failed" },
                { status: 500 }
            );
        }

        const data = await response.json();
        const textBlock = data.content?.find((block) => block.type === "text");
        const rawText = textBlock?.text || "";

        if (!rawText) {
            console.error("Empty reply from Claude. Full response:", JSON.stringify(data));
            return Response.json({ error: "Empty response from Claude" }, { status: 500 });
        }

        // Strip accidental markdown code fences before parsing
        const cleaned = rawText
            .replace(/^```(?:json)?\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        let debrief;
        try {
            debrief = JSON.parse(cleaned);
        } catch (parseErr) {
            console.error("Failed to parse debrief JSON. Raw text was:", rawText);
            return Response.json(
                { error: "Failed to parse debrief response. Claude did not return valid JSON." },
                { status: 500 }
            );
        }

        return Response.json({ debrief });
    } catch (err) {
        console.error("Debrief route error:", err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
