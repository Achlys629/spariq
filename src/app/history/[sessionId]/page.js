"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Sparkles,
    BriefcaseBusiness,
    GraduationCap,
    Handshake,
    Rocket,
    Clock,
    Zap,
    CheckCircle2,
    AlertCircle,
    Loader2,
    RotateCcw,
} from "lucide-react";

// ─── Static metadata ──────────────────────────────────────────────────────────
const SCENARIO_META = {
    interview: { label: "Corporate Interview", Icon: BriefcaseBusiness, color: "text-blue-400" },
    viva: { label: "Academic Defense", Icon: GraduationCap, color: "text-violet-400" },
    negotiation: { label: "Executive Dealmaking", Icon: Handshake, color: "text-emerald-400" },
    difficult: { label: "Difficult Conversation", Icon: Rocket, color: "text-amber-400" },
};

// Pre-computed stable background particles (no random during render)
const PARTICLES = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    duration: 2.5 + Math.random() * 3,
    delay: Math.random() * 2,
    width: 1.5 + Math.random() * 2.5,
    height: 1.5 + Math.random() * 2.5,
    left: Math.random() * 100,
    top: Math.random() * 100,
}));

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ value }) {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const filled = (value / 10) * circumference;
    const color = value >= 8 ? "#34d399" : value >= 5 ? "#a855f7" : "#f87171";
    return (
        <svg width="72" height="72" className="shrink-0">
            <circle cx="36" cy="36" r={radius} fill="none" stroke="#1e1b4b" strokeWidth="6" />
            <circle
                cx="36" cy="36" r={radius}
                fill="none" stroke={color} strokeWidth="6"
                strokeDasharray={`${filled} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dasharray 0.8s ease" }}
            />
            <text x="36" y="36" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="14" fontWeight="bold">
                {value}
            </text>
        </svg>
    );
}

// ─── Shared Background ────────────────────────────────────────────────────────
function PageBackground() {
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            {/* Top Right Sphere */}
            <div
                className="absolute -top-[12vw] -right-[8vw] w-[52vw] h-[52vw] min-w-[480px] min-h-[480px] rounded-full"
                style={{
                    background: "radial-gradient(circle at 35% 25%, #4a148c 0%, #1a0033 60%, #080010 100%)",
                    boxShadow: `inset -20px -20px 60px rgba(0,0,0,0.9), inset 15px 15px 40px rgba(236,72,153,0.9),
                        0 0 30px rgba(232,121,249,1), 0 0 80px rgba(168,85,247,0.8), 0 0 140px rgba(168,85,247,0.5)`,
                    border: "2px solid #f472b6",
                    filter: "drop-shadow(0 0 15px #e879f9)",
                }}
            />
            {/* Mid Left Sphere */}
            <div
                className="absolute top-[25vh] -left-[18vw] w-[58vw] h-[58vw] min-w-[520px] min-h-[520px] rounded-full"
                style={{
                    background: "radial-gradient(circle at 65% 30%, #3b0764 0%, #120024 65%, #05000a 100%)",
                    boxShadow: `inset 20px -25px 70px rgba(0,0,0,0.95), inset -12px 15px 45px rgba(192,132,252,0.9),
                        0 0 25px rgba(192,132,252,1), 0 0 70px rgba(147,51,234,0.8), 0 0 120px rgba(147,51,234,0.4)`,
                    border: "2px solid #c084fc",
                    filter: "drop-shadow(0 0 15px #c084fc)",
                }}
            />
            {/* Bottom Right Sphere */}
            <div
                className="absolute -bottom-[18vw] right-[8vw] w-[46vw] h-[46vw] min-w-[420px] min-h-[420px] rounded-full"
                style={{
                    background: "radial-gradient(circle at 40% 30%, #581c87 0%, #1e0038 70%, #05000a 100%)",
                    boxShadow: `inset -15px 15px 50px rgba(240,171,252,0.9),
                        0 0 35px rgba(240,171,252,1), 0 0 90px rgba(216,180,254,0.8), 0 0 150px rgba(192,132,252,0.5)`,
                    border: "2.5px solid #f0abfc",
                    filter: "drop-shadow(0 0 18px #f0abfc)",
                }}
            />
            <div className="absolute inset-0 bg-[#05000a]/30 backdrop-blur-[1px]" />

            {/* Floating sparkle particles */}
            {PARTICLES.map((p) => (
                <motion.div
                    key={p.id}
                    animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.8, 1.4, 0.8] }}
                    transition={{ repeat: Infinity, duration: p.duration, delay: p.delay }}
                    className="absolute rounded-full bg-purple-300"
                    style={{
                        width: `${p.width}px`,
                        height: `${p.height}px`,
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        boxShadow: "0 0 8px rgba(192,132,252,0.6)",
                    }}
                />
            ))}
        </div>
    );
}

// ─── Main detail page ─────────────────────────────────────────────────────────
export default function SessionDetailPage() {
    const router = useRouter();
    const params = useParams();
    const sessionId = params.sessionId;

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("transcript"); // "transcript" | "debrief"

    useEffect(() => {
        if (!sessionId) return;
        fetch(`/api/sessions/${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) setError(data.error);
                else setSession(data.session);
            })
            .catch(() => setError("Failed to load session."))
            .finally(() => setLoading(false));
    }, [sessionId]);

    const meta = session
        ? SCENARIO_META[session.scenario_type] || { label: session.scenario_type, Icon: Sparkles, color: "text-purple-400" }
        : null;

    const date = session
        ? new Date(session.created_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
        : "";

    const debrief = session?.debrief;
    const transcript = session?.transcript || [];

    const scoreRows = [
        { key: "confidence", label: "Confidence" },
        { key: "communication", label: "Communication" },
        { key: "criticalThinking", label: "Critical Thinking" },
    ];

    return (
        <div className="relative min-h-screen bg-[#05000a] text-purple-50 font-sans antialiased overflow-hidden selection:bg-purple-500/30 selection:text-purple-200">
            <PageBackground />

            {/* Nav */}
            <nav className="sticky top-0 z-40 w-full border-b border-white/20 bg-white/[0.03] backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-pink-400 flex items-center justify-center shadow-[0_0_25px_rgba(216,180,254,0.6)] border border-white/40">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-black tracking-tight text-white">SparIQ</span>
                    </div>
                    <button
                        onClick={() => router.push("/history")}
                        className="flex items-center gap-2 text-sm font-medium text-purple-100/80 hover:text-white transition-colors px-4 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:border-purple-300/60"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to History
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 py-10">

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
                        <p className="text-purple-200/70 text-sm">Loading session…</p>
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="flex items-center gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 backdrop-blur-xl px-5 py-4 text-sm text-rose-300">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        {error}
                    </div>
                )}

                {/* Session loaded */}
                {session && !loading && !error && (
                    <>
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mb-8 border-b border-white/15 pb-8"
                        >
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-300/40 bg-white/10 text-purple-200 text-xs font-mono uppercase tracking-widest mb-4 backdrop-blur-xl shadow-inner">
                                <Zap className="h-3.5 w-3.5 text-purple-300" />
                                Session Complete
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-indigo-400 bg-clip-text text-transparent mb-2">
                                {meta?.label}
                            </h1>
                            <div className="flex items-center gap-2 text-purple-300/60 text-sm">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{date} · {transcript.length} message{transcript.length !== 1 ? "s" : ""}</span>
                            </div>
                        </motion.div>

                        {/* Tab Switcher */}
                        <div className="flex gap-1 p-1 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl mb-8 w-fit">
                            {["transcript", "debrief"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                                        activeTab === tab
                                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]"
                                            : "text-purple-300/60 hover:text-white hover:bg-white/10"
                                    }`}
                                >
                                    {tab === "transcript" ? "Conversation" : "Debrief"}
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">

                            {/* ── TRANSCRIPT TAB ── */}
                            {activeTab === "transcript" && (
                                <motion.div
                                    key="transcript"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-xl shadow-2xl shadow-indigo-950/50 p-4 md:p-6 space-y-4"
                                >
                                    {transcript.length === 0 ? (
                                        <p className="text-center text-purple-300/50 text-sm py-12">No messages recorded for this session.</p>
                                    ) : (
                                        transcript.map((msg, i) => {
                                            const isUser = msg.role === "user";
                                            return (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2, delay: i * 0.03 }}
                                                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                                                >
                                                    <div
                                                        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed shadow-lg ${
                                                            isUser
                                                                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-purple-900/30"
                                                                : "bg-[#18162e]/90 text-slate-200 border border-purple-500/20 rounded-bl-none shadow-indigo-950/50 backdrop-blur-md"
                                                        }`}
                                                    >
                                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                </motion.div>
                            )}

                            {/* ── DEBRIEF TAB ── */}
                            {activeTab === "debrief" && (
                                <motion.div
                                    key="debrief"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.25 }}
                                    className="space-y-6"
                                >
                                    {!debrief ? (
                                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-10 text-center text-purple-300/50 text-sm">
                                            No debrief available for this session.
                                        </div>
                                    ) : (
                                        <>
                                            {/* Score Cards */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.4 }}
                                                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                                            >
                                                {scoreRows.map(({ key, label }, i) => {
                                                    const s = debrief.scores?.[key];
                                                    if (!s) return null;
                                                    return (
                                                        <motion.div
                                                            key={key}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3, delay: i * 0.08 }}
                                                            className="rounded-2xl border border-white/10 bg-indigo-950/20 backdrop-blur-md p-5 flex items-center gap-4 shadow-xl shadow-indigo-950/50 hover:border-purple-500/30 hover:shadow-purple-500/10 transition-all hover:scale-[1.02]"
                                                        >
                                                            <ScoreRing value={s.value} />
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-mono uppercase tracking-widest text-purple-400 mb-1">{label}</p>
                                                                <p className="text-xs text-slate-400 leading-relaxed">{s.justification}</p>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </motion.div>

                                            {/* Strengths & Weaknesses */}
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {/* Strengths */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: 0.15 }}
                                                    className="rounded-2xl border border-emerald-500/20 bg-emerald-950/10 backdrop-blur-md p-6 shadow-xl hover:border-emerald-500/40 transition-all"
                                                >
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                                                        <h2 className="text-sm font-mono uppercase tracking-widest text-emerald-400">Strengths</h2>
                                                    </div>
                                                    <ul className="space-y-3">
                                                        {(debrief.strengths || []).map((item, i) => (
                                                            <motion.li
                                                                key={i}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.2 + i * 0.05 }}
                                                                className="flex gap-3 text-sm text-slate-300 leading-relaxed"
                                                            >
                                                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                                                {item}
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                </motion.div>

                                                {/* Areas to Improve */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: 0.2 }}
                                                    className="rounded-2xl border border-amber-500/20 bg-amber-950/10 backdrop-blur-md p-6 shadow-xl hover:border-amber-500/40 transition-all"
                                                >
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
                                                        <h2 className="text-sm font-mono uppercase tracking-widest text-amber-400">Areas to Improve</h2>
                                                    </div>
                                                    <ul className="space-y-3">
                                                        {(debrief.weaknesses || []).map((item, i) => (
                                                            <motion.li
                                                                key={i}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: 0.25 + i * 0.05 }}
                                                                className="flex gap-3 text-sm text-slate-300 leading-relaxed"
                                                            >
                                                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                                                                {item}
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            </div>
                                        </>
                                    )}
                                </motion.div>
                            )}

                        </AnimatePresence>

                        {/* Footer CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex justify-center mt-10 gap-3"
                        >
                            <button
                                onClick={() => router.push("/history")}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-all hover:scale-[1.02] active:scale-95 backdrop-blur-md"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                All Sessions
                            </button>
                            <button
                                onClick={() => router.push("/")}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm transition-all shadow-[0_0_25px_rgba(147,51,234,0.35)] hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_35px_rgba(147,51,234,0.5)]"
                            >
                                <RotateCcw className="h-4 w-4" />
                                New Session
                            </button>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}
