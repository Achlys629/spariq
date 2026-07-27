// src/app/api/debrief/route.js

const SCENARIO_LABELS = {
    interview: "corporate job interview",
    viva: "academic viva / oral exam",
    negotiation: "high-stakes business negotiation",
    difficult: "difficult personal or professional conversation",
    pitch: "startup investor pitch",
    debate: "structured debate",
};

function buildDebriefSystemPrompt(scenarioType) {
    const label = SCENARIO_LABELS[scenarioType] || "high-pressure conversation";
    return `You are a strict, expert performance coach evaluating a candidate's performance in a simulated ${label}.

Your job is to give honest, specific, actionable feedback — not generic praise or hollow criticism.

Respond with ONLY the JSON object. Do not include any preamble, explanation, markdown code fences, or text before or after the JSON. Your entire response must be valid, parseable JSON and nothing else.

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

/**
 * Strips markdown code fences and extracts the first {...} JSON block
 * from a raw AI response, so parsing succeeds even if Claude adds
 * minor surrounding text despite instructions.
 */
function extractJSON(rawText) {
    let cleaned = rawText.trim();
    // Remove markdown code fences (```json ... ``` or ``` ... ```)
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
    // Extract the first complete {...} block in case there's a preamble or trailing text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
        cleaned = match[0];
    }
    return cleaned;
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

        // Clean and extract JSON — handles code fences, preamble, and trailing text
        const cleanedText = extractJSON(rawText);

        let debrief;
        try {
            debrief = JSON.parse(cleanedText);
        } catch (parseErr) {
            // Log the raw unparsed response so we can see exactly what Claude returned
            console.error("Debrief JSON parse failed.");
            console.error("Cleaned text attempted:", cleanedText);
            console.error("Raw AI response was:", rawText);
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
