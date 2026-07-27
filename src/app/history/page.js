"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getAnonId } from "@/lib/anonId";
import {
    Sparkles,
    Home,
    BriefcaseBusiness,
    GraduationCap,
    Handshake,
    Rocket,
    MessageCircleHeart,
    Swords,
    Clock,
    ChevronRight,
    Loader2,
    AlertCircle,
    History,
    Zap,
    Terminal,
} from "lucide-react";

const SCENARIO_META = {
    interview: { label: "Corporate Interview", Icon: BriefcaseBusiness, color: "text-blue-400" },
    viva: { label: "Academic Defense", Icon: GraduationCap, color: "text-violet-400" },
    negotiation: { label: "Executive Dealmaking", Icon: Handshake, color: "text-emerald-400" },
    difficult: { label: "Difficult Conversation", Icon: MessageCircleHeart, color: "text-amber-400" },
    pitch: { label: "Startup Pitch", Icon: Rocket, color: "text-rose-400" },
    debate: { label: "Debate & Persuasion", Icon: Swords, color: "text-cyan-400" },
};

function ScoreBar({ label, value }) {
    const color =
        value >= 8 ? "bg-emerald-400" : value >= 5 ? "bg-purple-400" : "bg-rose-400";
    return (
        <div className="flex items-center gap-3 min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wide text-purple-300/70 w-[80px] shrink-0">
                {label}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                    className={`h-full rounded-full ${color} transition-all shadow-[0_0_8px_rgba(168,85,247,0.3)]`}
                    style={{ width: `${(value / 10) * 100}%` }}
                />
            </div>
            <span className="text-xs font-bold text-white w-6 text-right shrink-0">
                {value}
            </span>
        </div>
    );
}

function SessionCard({ session, index, onClick }) {
    const meta = SCENARIO_META[session.scenario_type] || {
        label: session.scenario_type,
        Icon: Sparkles,
        color: "text-purple-400",
    };
    const Icon = meta.Icon;
    const scores = session.debrief?.scores;
    const date = new Date(session.created_at);
    const formattedDate = date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            onClick={onClick}
            className="group relative p-5 rounded-2xl border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_35px_rgba(216,180,254,0.45)] hover:border-purple-300/80 transition-all hover:scale-[1.02] overflow-hidden cursor-pointer"
        >
            {/* Glass Card Specular Edge Accent */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 backdrop-blur-xl">
                        <Icon className={`h-5 w-5 ${meta.color}`} />
                    </div>
                    <div>
                        <p className={`text-sm font-bold ${meta.color}`}>{meta.label}</p>
                        <div className="flex items-center gap-1 text-[11px] text-purple-300/50 mt-0.5">
                            <Clock className="h-3 w-3" />
                            <span>{formattedDate} · {formattedTime}</span>
                        </div>
                    </div>
                </div>
                <ChevronRight className="h-4 w-4 text-purple-300/30 shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:text-purple-300/80 transition-all" />
            </div>

            {/* Score bars */}
            {scores ? (
                <div className="space-y-2">
                    <ScoreBar label="Confidence" value={scores.confidence?.value ?? 0} />
                    <ScoreBar label="Comms" value={scores.communication?.value ?? 0} />
                    <ScoreBar label="Thinking" value={scores.criticalThinking?.value ?? 0} />
                </div>
            ) : (
                <p className="text-xs text-purple-300/40 italic">No scores available</p>
            )}

            {/* View detail hint */}
            <div className="mt-4 flex items-center gap-1 text-[10px] text-purple-400/50 group-hover:text-purple-300/80 transition-colors font-mono uppercase tracking-widest">
                <span>View session</span>
                <ChevronRight className="h-3 w-3" />
            </div>
        </motion.div>
    );
}

export default function HistoryPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState([]);
    const [anonId] = useState(() => {
        if (typeof window === "undefined") return null;
        return getAnonId();
    });

    const [loading, setLoading] = useState(() => {
        if (typeof window === "undefined") return true;
        const id = localStorage.getItem("sparIQ-anon-id");
        return id ? true : false;
    });
    const [error, setError] = useState(() => {
        if (typeof window === "undefined") return null;
        const existing = localStorage.getItem("sparIQ-anon-id");
        return existing ? null : "No anonymous ID found in this browser.";
    });

    useEffect(() => {
        if (!anonId) {
            return;
        }

        fetch(`/api/sessions?anonUserId=${encodeURIComponent(anonId)}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setSessions(data.sessions || []);
                }
            })
            .catch(() => {
                setError("Failed to load sessions. Please try again.");
            })
            .finally(() => setLoading(false));
    }, [anonId]);

    return (
        <div className="relative min-h-screen bg-[#05000a] text-purple-50 font-sans antialiased overflow-hidden selection:bg-purple-500/30 selection:text-purple-200">

            {/* HIGH-VISIBILITY GLOWING BORDER SPHERES */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                {/* Top Right Massive Sphere with Neon Rim Glow */}
                <div
                    className="absolute -top-[12vw] -right-[8vw] w-[52vw] h-[52vw] min-w-[480px] min-h-[480px] rounded-full"
                    style={{
                        background: "radial-gradient(circle at 35% 25%, #4a148c 0%, #1a0033 60%, #080010 100%)",
                        boxShadow: `
                            inset -20px -20px 60px rgba(0, 0, 0, 0.9),
                            inset 15px 15px 40px rgba(236, 72, 153, 0.9),
                            0 0 30px rgba(232, 121, 249, 1),
                            0 0 80px rgba(168, 85, 247, 0.8),
                            0 0 140px rgba(168, 85, 247, 0.5)
                        `,
                        border: "2px solid #f472b6",
                        filter: "drop-shadow(0 0 15px #e879f9)",
                    }}
                />

                {/* Mid Left Giant Sphere with Neon Rim Glow */}
                <div
                    className="absolute top-[25vh] -left-[18vw] w-[58vw] h-[58vw] min-w-[520px] min-h-[520px] rounded-full"
                    style={{
                        background: "radial-gradient(circle at 65% 30%, #3b0764 0%, #120024 65%, #05000a 100%)",
                        boxShadow: `
                            inset 20px -25px 70px rgba(0, 0, 0, 0.95),
                            inset -12px 15px 45px rgba(192, 132, 252, 0.9),
                            0 0 25px rgba(192, 132, 252, 1),
                            0 0 70px rgba(147, 51, 234, 0.8),
                            0 0 120px rgba(147, 51, 234, 0.4)
                        `,
                        border: "2px solid #c084fc",
                        filter: "drop-shadow(0 0 15px #c084fc)",
                    }}
                />

                {/* Bottom Right Sphere with Intense Neon Rim Glow */}
                <div
                    className="absolute -bottom-[18vw] right-[8vw] w-[46vw] h-[46vw] min-w-[420px] min-h-[420px] rounded-full"
                    style={{
                        background: "radial-gradient(circle at 40% 30%, #581c87 0%, #1e0038 70%, #05000a 100%)",
                        boxShadow: `
                            inset -15px 15px 50px rgba(240, 171, 252, 0.9),
                            0 0 35px rgba(240, 171, 252, 1),
                            0 0 90px rgba(216, 180, 254, 0.8),
                            0 0 150px rgba(192, 132, 252, 0.5)
                        `,
                        border: "2.5px solid #f0abfc",
                        filter: "drop-shadow(0 0 18px #f0abfc)",
                    }}
                />

                {/* Subtle Ambient Dimmer */}
                <div className="absolute inset-0 bg-[#05000a]/30 backdrop-blur-[1px]" />
            </div>

            {/* Nav */}
            <nav className="sticky top-0 z-40 w-full border-b border-white/20 bg-white/[0.03] backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => router.push("/")}
                    >
                        <img
                            src="/logo/logo.png"
                            alt="SparIQ Logo"
                            className="h-8 w-8 object-contain drop-shadow-[0_0_15px_rgba(192,132,252,0.8)] transition-transform hover:scale-105"
                        />
                        <div>
                            <span className="text-base sm:text-lg font-black tracking-tight text-white block leading-none">SparIQ</span>
                            <span className="text-[8px] sm:text-[9px] font-mono uppercase text-purple-300 tracking-widest font-semibold">
                                BUILT TO CHALLENGE YOU
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 text-sm font-medium text-purple-100/80 hover:text-white transition-colors px-4 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:border-purple-300/60"
                    >
                        <Home className="h-4 w-4" />
                        Home
                    </button>
                </div>
            </nav>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-10">

                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8 border-b border-white/15 pb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-300/40 bg-white/10 text-purple-200 text-xs font-mono uppercase tracking-widest mb-4 backdrop-blur-xl shadow-inner">
                        <History className="h-3.5 w-3.5 text-purple-300" />
                        Session History
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-2">
                        Past Sessions
                    </h1>
                    <p className="text-purple-100/80 text-sm drop-shadow">
                        All your previous sparring sessions on this device.
                    </p>

                    {/* Anonymous ID chip */}
                    {anonId && (
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl text-[10px] font-mono text-purple-300/70">
                            <span className="text-purple-300/50">Device ID:</span>
                            <span className="text-purple-200 truncate max-w-[200px]">{anonId}</span>
                        </div>
                    )}
                </motion.div>

                {/* States */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
                        <p className="text-purple-100/70 text-sm">Loading sessions…</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="flex items-center gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 backdrop-blur-xl px-5 py-4 text-sm text-rose-300">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        {error}
                    </div>
                )}

                {!loading && !error && sessions.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-24 text-center gap-4"
                    >
                        <div className="w-16 h-16 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl flex items-center justify-center">
                            <History className="h-7 w-7 text-purple-300/50" />
                        </div>
                        <div>
                            <p className="text-white font-semibold mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">No sessions yet</p>
                            <p className="text-purple-100/60 text-sm">Complete a sparring session to see it here.</p>
                        </div>
                        <button
                            onClick={() => router.push("/")}
                            className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 hover:from-purple-400 hover:to-fuchsia-400 text-white text-sm transition-all shadow-[0_0_30px_rgba(216,180,254,0.6)] hover:scale-[1.02] active:scale-95 border border-white/30"
                        >
                            <Sparkles className="h-4 w-4" />
                            Start a Session
                        </button>
                    </motion.div>
                )}

                {!loading && !error && sessions.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {sessions.map((session, i) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                index={i}
                                onClick={() => router.push(`/history/${session.id}`)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}