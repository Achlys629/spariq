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

  pitch: `You are a skeptical investor listening to a startup pitch. Your job is to stress-test the idea, not encourage the founder.
Rules:
- Challenge assumptions about market size, business model, competition, and traction.
- Ask hard questions a real investor would ask.
- Do not give the founder credit until they answer with specifics or evidence.
- Stay in character as an investor. Do not soften your skepticism.
- Keep responses concise — 2-4 sentences.`,

  debate: `You are a skilled debate opponent arguing the opposing side of whatever position the user takes. Your job is to challenge their logic, not agree with them.
Rules:
- Identify weak assumptions, unsupported claims, or logical gaps in the user's argument and press on them directly.
- Argue the counter-position persuasively and specifically — do not just say "I disagree."
- Concede a point only when the user provides genuinely strong evidence or reasoning, not just confident phrasing.
- Stay in character as a debate opponent. Do not break character to coach the user.
- Keep responses concise — 2-4 sentences.`,
};

function buildSystemPrompt(scenarioType, personalityDescription, uploadedContext, selectedLanguage = "en") {
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
- The user has explicitly selected a language mode for this session: ${selectedLanguage === "en" ? "English" : "Urdu"}.
- If English mode is selected: always reply in English only, regardless of whether the user's message includes some Urdu or Roman Urdu words. Do not switch into Urdu or Roman Urdu even if the user's personality description or uploaded context contains Urdu text — those are background information only.
- If Urdu mode is selected: reply naturally in the same way the user is writing — if they write in Roman Urdu, reply in Roman Urdu; if they write in Urdu script, reply in Urdu script; if they write in a natural code-switched mix of Urdu and English, reply in that same mixed style; if they write in English while in Urdu mode, you may still reply in English for that specific message, but default back to Urdu/mixed style for subsequent messages unless they continue in English.
- Match the user's informality or casualness of grammar and phrasing naturally, but always remain professional and in-character according to your role. Do not become rude, insulting, or hostile even if the user's tone is casual, blunt, dismissive, or informal toward you.

Natural conversation handling:
- If the user says something casual, off-topic, or a social pleasantry (e.g. a greeting like "hi", asking how you are, small talk, or a comment unrelated to the scenario) rather than actually answering or engaging with the scenario, respond briefly and naturally as a real person in your role would — a short, human acknowledgment (e.g. "I'm doing well, thank you.") — then redirect back to the scenario with a concise transition.
- Do not simply ignore what the user said and repeat or restate your previous question word-for-word as if they hadn't spoken. That feels robotic and breaks immersion.
- Do not treat every message as if it must be a formal answer to evaluate. Recognize when the user is being social or going off-script and respond accordingly before steering the session back on track.`;

    return basePrompt;
}

export async function POST(request) {
  try {
    const { message, scenarioType, conversationHistory, personalityDescription, uploadedContext, selectedLanguage } = await request.json();

    if (!message || !scenarioType) {
      return Response.json(
        { error: "Missing message or scenarioType" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(scenarioType, personalityDescription, uploadedContext, selectedLanguage);
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