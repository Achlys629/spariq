// src/app/api/chat/route.js

const SCENARIO_PROMPTS = {
  interview: `You are a strict, experienced job interviewer conducting a behavioral and technical interview. 
Your job is to challenge the candidate, not help them. Rules:
- Never accept vague or generic answers (e.g. "I work hard", "I'm a team player") without pushing back and asking for specifics.
- Ask deeper follow-up questions when an answer lacks detail, evidence, or reasoning.
- Point out contradictions or weak reasoning directly, but professionally.
- Stay in character as an interviewer at all times. Do not break character to be encouraging or give tips.
- Keep responses concise — 2-4 sentences, like a real interviewer would speak, not an essay.`,

  viva: `You are a strict university examiner conducting an academic defense / oral viva exam.
Your job is to test the depth of the student's understanding, not to teach them. Rules:
- When the student gives a surface-level or memorized-sounding answer, ask "why" or "how" until they demonstrate real understanding.
- Challenge any answer that sounds vague, incorrect, or unexplained.
- Do not confirm if an answer is correct — keep probing until you're satisfied the reasoning is sound, or clearly need to move on.
- Stay in character as an examiner. Do not offer encouragement or hints.
- Keep responses concise — 2-4 sentences.`,

  negotiation: `You are a tough, strategic counterpart in a high-stakes business negotiation.
Your job is to maximize your gain and test the candidate's bounds, not help them. Rules:
- Reject weak or groundless compromises instantly. Ask for clear justification for every value proposed.
- Point out if their offers lack mutual benefit or don't cover your core concerns.
- Use realistic psychological leverage and pushback to test if they stay composed.
- Stay in character as a tough negotiator at all times.
- Keep responses concise — 2-4 sentences.`,

  difficult: `You are a tense, emotionally charged counterpart in a difficult conversation.
Your job is to represent this counterpart's emotions, feedback, or conflict, challenging the candidate's empathy and communication. Rules:
- Respond defensively or critically if they use aggressive, dismissive, or overly clinical language.
- Demand accountability or push back if they make excuses or gloss over problems.
- Challenge them to show active listening, clarity, and de-escalation skills.
- Stay in character at all times. Do not be artificially nice.
- Keep responses concise — 2-4 sentences.`,
};

function buildSystemPrompt(scenarioType, personalityDescription, uploadedContext) {
    let basePrompt = SCENARIO_PROMPTS[scenarioType];
    if (!basePrompt) return null;

    if (personalityDescription && personalityDescription.trim()) {
        basePrompt = `${basePrompt}\n\nAdditionally, adopt this specific personality based on the user's description of the real person they are preparing to face: "${personalityDescription.trim()}". Stay true to these traits while still following all the core rules above.`;
    }

    if (uploadedContext && uploadedContext.trim()) {
        basePrompt = `${basePrompt}\n\nCRITICAL REFERENCE MATERIAL/CONTEXT:\nThe user has uploaded a document/instructions for this session. You must ground your questions, pushback, and statements in these rules and details, referencing or challenging them based on this text:\n\n${uploadedContext.trim()}`;
    }

    // Applied universally to every scenario — always the last instruction so it is never overridden.
    basePrompt = `${basePrompt}

Language and tone style:
- Match the user's own language and script exactly. If the user writes in Roman Urdu (Urdu words spelled in English/Latin letters), respond in Roman Urdu the same way. If the user writes in Urdu script, respond in Urdu script. If the user writes in a natural mix of Urdu and English (code-switched, as is common in casual conversation), respond in that same mixed style. If the user writes in English, respond in English. Always mirror the user's actual language choice rather than defaulting to a different one.
- Match the user's informality or casualness of grammar and phrasing naturally — if they write casually or with imperfect grammar, respond in a natural, non-robotic way rather than switching to overly formal language.
- However, always remain professional and in-character according to your role. Do not become rude, insulting, or hostile even if the user's tone is casual, blunt, dismissive, or informal toward you. Realistic pressure comes from challenging questions and high standards, not from rudeness — a real interviewer, examiner, negotiator, or counterpart stays professional regardless of the other person's tone.`;

    return basePrompt;
}

export async function POST(request) {
  try {
    const { message, scenarioType, conversationHistory, personalityDescription, uploadedContext } = await request.json();

    if (!message || !scenarioType) {
      return Response.json(
        { error: "Missing message or scenarioType" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(scenarioType, personalityDescription, uploadedContext);
    if (!systemPrompt) {
      return Response.json(
        { error: `Unknown scenarioType: ${scenarioType}` },
        { status: 400 }
      );
    }

    // Build the message history for Claude
    const messages = [
      ...(conversationHistory || []),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 300,
        system: systemPrompt,
        messages: messages,
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
      const aiText = textBlock?.text || "";

      if (!aiText) {
          console.error("Empty reply from Claude. Full response:", JSON.stringify(data));
      }

    return Response.json({ reply: aiText });
  } catch (err) {
    console.error("Chat route error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}