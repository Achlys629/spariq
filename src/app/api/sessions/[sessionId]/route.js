import { createServerSupabase } from "@/lib/supabaseServer";

// GET /api/sessions/[sessionId]
// Returns a single session row including transcript and debrief.
export async function GET(_request, { params }) {
  try {
    const { sessionId } = await params;

    if (!sessionId) {
      return Response.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const supabase = createServerSupabase();

    const { data, error } = await supabase
      .from("sessions")
      .select("id, scenario_type, transcript, debrief, created_at")
      .eq("id", sessionId)
      .single();

    if (error) {
      console.error("Supabase select error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return Response.json({ error: "Session not found" }, { status: 404 });
    }

    return Response.json({ session: data });
  } catch (err) {
    console.error("GET /api/sessions/[sessionId] error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}