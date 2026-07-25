import { createServerSupabase } from "@/lib/supabaseServer";

// ─── POST /api/sessions ───────────────────────────────────────────────────────
// Body: { anonUserId, scenarioType, transcript, debrief }
// Inserts a completed session row into Supabase.
export async function POST(request) {
  try {
    const { anonUserId, scenarioType, transcript, debrief } =
      await request.json();

    if (!anonUserId || !scenarioType || !transcript) {
      return Response.json(
        { error: "Missing required fields: anonUserId, scenarioType, transcript" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        anon_user_id: anonUserId,
        scenario_type: scenarioType,
        transcript: transcript,
        debrief: debrief ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ session: data }, { status: 201 });
  } catch (err) {
    console.error("POST /api/sessions error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ─── GET /api/sessions?anonUserId=... ────────────────────────────────────────
// Returns all sessions for the given anonymous user, newest first.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const anonUserId = searchParams.get("anonUserId");

    if (!anonUserId) {
      return Response.json(
        { error: "Missing query param: anonUserId" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("sessions")
      .select("id, scenario_type, debrief, created_at")
      .eq("anon_user_id", anonUserId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase select error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ sessions: data });
  } catch (err) {
    console.error("GET /api/sessions error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
