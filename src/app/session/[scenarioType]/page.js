"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getAnonId } from "@/lib/anonId";
import { useParams as useNextParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowUpRight,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    Loader2,
    Zap,
    Home,
    Sliders,
    UploadCloud,
    X,
    Mic,
    MicOff,
    ChevronLeft,
    ChevronRight,
    Settings,
    Sparkles,
    Terminal,
    History,
    Rocket,
    MessageCircleHeart,
    Swords,
} from "lucide-react";

const SCENARIO_META = {
    interview: {
        label: "Corporate Interview",
        bg: "/images/bg-interview.png",
    },
    viva: {
        label: "Academic Defense",
        bg: "/images/bg-viva.png",
    },
    negotiation: {
        label: "Executive Dealmaking",
        bg: "/images/bg-negotiation.png",
    },
    difficult: {
        label: "Difficult Conversation",
        bg: "/images/bg-difficult.png",
    },
    pitch: {
        label: "Startup Pitch",
        bg: "/images/bg-pitch.png",
    },
    debate: {
        label: "Debate & Persuasion",
        bg: "/images/bg-debate.png",
    },
};




// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ value }) {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const filled = (value / 10) * circumference;
    const color =
        value >= 8 ? "#34d399" : value >= 5 ? "#a855f7" : "#f87171";

    return (
        <svg width="72" height="72" className="shrink-0">
            <circle
                cx="36" cy="36" r={radius}
                fill="none" stroke="#1e1b4b" strokeWidth="6"
            />
            <circle
                cx="36" cy="36" r={radius}
                fill="none" stroke={color} strokeWidth="6"
                strokeDasharray={`${filled} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 36 36)"
                style={{ transition: "stroke-dasharray 0.8s ease" }}
            />
            <text
                x="36" y="36"
                textAnchor="middle" dominantBaseline="central"
                fill="white" fontSize="14" fontWeight="bold"
            >
                {value}
            </text>
        </svg>
    );
}

// ─── Debrief Screen ───────────────────────────────────────────────────────────
function DebriefScreen({ debrief, scenarioLabel, onPracticeAgain, onHome }) {
    const scores = [
        { key: "confidence", label: "Confidence" },
        { key: "communication", label: "Communication" },
        { key: "criticalThinking", label: "Critical Thinking" },
    ];

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

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-6"
                >
                    <div>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-purple-300/40 bg-white/10 text-purple-200 text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-xl shadow-inner">
                            <Sparkles className="h-3.5 w-3.5 text-purple-300" />
                            Session Complete
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                            Performance Debrief
                        </h1>
                        <p className="mt-1 text-purple-100/80 text-sm drop-shadow">{scenarioLabel}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onHome}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-purple-100 text-sm font-medium transition-all hover:scale-[1.02] active:scale-95 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:border-purple-300/60"
                        >
                            <Home className="h-4 w-4" />
                            Home
                        </button>
                        <button
                            onClick={onPracticeAgain}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 hover:from-purple-400 hover:to-fuchsia-400 text-white text-sm transition-all shadow-[0_0_30px_rgba(216,180,254,0.6)] hover:scale-[1.02] active:scale-95 border border-white/30"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Practice Again
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </div>
                </motion.div>

                {/* Score Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                    {scores.map(({ key, label }, i) => {
                        const s = debrief.scores?.[key];
                        if (!s) return null;
                        return (
                            <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
                                className="group relative p-5 rounded-2xl border border-white/20 bg-gradient-to-b from-white/[0.1] to-white/[0.02] backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_35px_rgba(216,180,254,0.45)] transition-all hover:scale-[1.02] overflow-hidden flex items-center gap-4"
                            >
                                {/* Glass Card Specular Edge Accent */}
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <ScoreRing value={s.value} />
                                <div className="min-w-0">
                                    <p className="text-xs font-mono uppercase tracking-widest text-purple-300 mb-1">{label}</p>
                                    <p className="text-xs text-purple-100/70 leading-relaxed">{s.justification}</p>
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
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="group relative p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-500/[0.05] to-white/[0.02] backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:border-emerald-500/40 hover:shadow-[0_0_35px_rgba(52,211,153,0.2)] transition-all hover:scale-[1.01] overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

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
                                    transition={{ delay: 0.3 + i * 0.05 }}
                                    className="flex gap-3 text-sm text-purple-100/80 leading-relaxed"
                                >
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                    {item}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Weaknesses */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 }}
                        className="group relative p-6 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.05] to-white/[0.02] backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:border-amber-500/40 hover:shadow-[0_0_35px_rgba(251,191,36,0.2)] transition-all hover:scale-[1.01] overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

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
                                    transition={{ delay: 0.35 + i * 0.05 }}
                                    className="flex gap-3 text-sm text-purple-100/80 leading-relaxed"
                                >
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                                    {item}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center pt-2"
                >
                    <button
                        onClick={onPracticeAgain}
                        className="flex items-center gap-2 py-3.5 px-8 rounded-xl font-semibold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 hover:from-purple-400 hover:to-fuchsia-400 text-white transition-all shadow-[0_0_30px_rgba(216,180,254,0.6)] hover:scale-[1.02] active:scale-95 border border-white/30 text-sm"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Start Another Round
                        <ArrowUpRight className="h-4 w-4" />
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

// ─── Main Session Page ────────────────────────────────────────────────────────
export default function SessionPage() {
    const params = useNextParams();
    const scenarioType = params.scenarioType;
    const meta = SCENARIO_META[scenarioType];

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Client-side generated bar particles (prevents SSR Math.random hydration mismatch)
    const [barParticles, setBarParticles] = useState([]);
    useEffect(() => {
        setBarParticles(
            Array.from({ length: 8 }).map((_, i) => ({
                id: i,
                duration: 2 + Math.random() * 3,
                delay: Math.random() * 1.5,
                width: 1.2 + Math.random() * 1.8,
                height: 1.2 + Math.random() * 1.8,
                left: Math.random() * 100,
                top: Math.random() * 100,
            }))
        );
    }, []);

    // Dynamic settings states
    const [personalityDescription, setPersonalityDescription] = useState("");
    const [difficulty, setDifficulty] = useState("medium");
    const [uploadedContext, setUploadedContext] = useState("");

    // Restore saved settings from sessionStorage after initial mount to prevent SSR hydration mismatch
    useEffect(() => {
        if (typeof window === "undefined" || !scenarioType) return;
        try {
            const saved = sessionStorage.getItem(`sparIQ-session-${scenarioType}`);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.personalityDescription !== undefined) {
                    setPersonalityDescription(parsed.personalityDescription);
                }
                if (parsed.difficulty !== undefined) {
                    setDifficulty(parsed.difficulty);
                }
                if (parsed.uploadedContext !== undefined) {
                    setUploadedContext(parsed.uploadedContext);
                }
            }
        } catch {
            // ignore
        }
    }, [scenarioType]);

    // Guard ref: skip the write effect on first render so it never overwrites what the landing page
    // just saved before the restore effect has had a chance to run.
    const isFirstRender = useRef(true);

    // Persist sidebar settings changes to sessionStorage so browser refresh restores them consistently
    useEffect(() => {
        if (typeof window === "undefined" || !scenarioType) return;
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return; // restore effect runs first — don't overwrite with stale defaults
        }
        try {
            sessionStorage.setItem(
                `sparIQ-session-${scenarioType}`,
                JSON.stringify({
                    personalityDescription,
                    difficulty,
                    uploadedContext,
                })
            );
        } catch {
            // ignore
        }
    }, [scenarioType, personalityDescription, difficulty, uploadedContext]);

    const [fileName, setFileName] = useState("");
    const [fileLoading, setFileLoading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [debriefLoading, setDebriefLoading] = useState(false);
    const [debriefData, setDebriefData] = useState(null);
    const [debriefError, setDebriefError] = useState(null);

    const chatEndRef = useRef(null);

    // Voice Input States & Refs
    const [voiceLanguage, setVoiceLanguage] = useState("en");
    const [voiceState, setVoiceState] = useState("idle");

    const mediaRecorderRef = useRef(null);
    const audioStreamRef = useRef(null);
    const recognitionRef = useRef(null);
    const chunksRef = useRef([]);

    // Cleanup voice recordings on unmount
    useEffect(() => {
        return () => {
            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    const startMediaRecorder = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;

            const options = { mimeType: "audio/webm" };
            let recorder;
            try {
                recorder = new MediaRecorder(stream, options);
            } catch (e) {
                recorder = new MediaRecorder(stream);
            }

            chunksRef.current = [];
            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            recorder.onstop = async () => {
                setVoiceState("transcribing");
                const audioBlob = new Blob(chunksRef.current, {
                    type: recorder.mimeType || "audio/webm",
                });

                if (audioStreamRef.current) {
                    audioStreamRef.current.getTracks().forEach((track) => track.stop());
                    audioStreamRef.current = null;
                }

                const formData = new FormData();
                formData.append("file", audioBlob, "recording.webm");
                formData.append("language", voiceLanguage);

                try {
                    const res = await fetch("/api/transcribe", {
                        method: "POST",
                        body: formData,
                    });
                    const data = await res.json();
                    if (data.transcript) {
                        setInput((prev) =>
                            prev ? prev + " " + data.transcript : data.transcript
                        );
                    } else if (data.error) {
                        console.error("Transcription error:", data.error);
                    }
                } catch (err) {
                    console.error("Failed to connect to transcription server:", err);
                } finally {
                    setVoiceState("idle");
                }
            };

            mediaRecorderRef.current = recorder;
            setVoiceState("recording");
            recorder.start();
        } catch (err) {
            console.error("Microphone access denied or error:", err);
            setVoiceState("idle");
        }
    }, [voiceLanguage]);

    const startSpeechRecognition = useCallback(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            startMediaRecorder();
            return;
        }

        try {
            const rec = new SpeechRecognition();
            rec.continuous = false;
            rec.interimResults = false;
            rec.lang = "en-US";

            rec.onstart = () => {
                setVoiceState("recording");
            };

            rec.onresult = (event) => {
                const text = event.results[0][0].transcript;
                if (text) {
                    setInput((prev) => (prev ? prev + " " + text : text));
                }
            };

            rec.onerror = (e) => {
                console.warn("Speech recognition error, falling back to Whisper:", e);
                rec.stop();
                startMediaRecorder();
            };

            rec.onend = () => {
                setVoiceState("idle");
            };

            recognitionRef.current = rec;
            rec.start();
        } catch (err) {
            console.warn(
                "Speech recognition failed to start, falling back to Whisper:",
                err
            );
            startMediaRecorder();
        }
    }, [startMediaRecorder]);

    const toggleVoiceInput = () => {
        if (voiceState === "recording") {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            } else if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state !== "inactive"
            ) {
                mediaRecorderRef.current.stop();
            }
        } else if (voiceState === "idle") {
            if (voiceLanguage === "en") {
                startSpeechRecognition();
            } else {
                startMediaRecorder();
            }
        }
    };

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (messages.length > 0) {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [messages, loading]);

    async function handleFileUpload(e) {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileLoading(true);
        setUploadError("");
        setFileName(file.name);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload-context", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok && data.text) {
                setUploadedContext(data.text);
            } else {
                setUploadError(data.error || "Failed to parse file");
                setFileName("");
            }
        } catch (err) {
            setUploadError("Could not connect to parser server");
            setFileName("");
        } finally {
            setFileLoading(false);
        }
    }

    async function sendMessage() {
        if (!input.trim() || loading) return;

        const userMessage = { role: "user", content: input };
        setInput("");
        setLoading(true);

        let historyForRequest;
        setMessages((prev) => {
            historyForRequest = prev;
            return [...prev, userMessage];
        });

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage.content,
                    scenarioType,
                    conversationHistory: historyForRequest,
                    personalityDescription,
                    uploadedContext,
                    difficulty,
                    selectedLanguage: voiceLanguage,
                }),
            });

            const data = await res.json();

            if (data.reply) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: "Error: " + (data.error || "Unknown error") },
                ]);
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Error: could not reach server." },
            ]);
        } finally {
            setLoading(false);
        }
    }

    async function handleEndSession() {
        if (messages.length === 0) return;
        setDebriefLoading(true);
        setDebriefError(null);

        try {
            const res = await fetch("/api/debrief", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript: messages, scenarioType }),
            });

            const data = await res.json();

            if (data.debrief) {
                setDebriefData(data.debrief);

                const anonId = getAnonId();
                if (anonId) {
                    fetch("/api/sessions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            anonUserId: anonId,
                            scenarioType,
                            transcript: messages,
                            debrief: data.debrief,
                        }),
                    }).catch((saveErr) => {
                        console.warn("Session auto-save failed:", saveErr);
                    });
                }
            } else {
                setDebriefError(data.error || "Failed to generate debrief.");
            }
        } catch (err) {
            setDebriefError("Could not reach server. Please try again.");
        } finally {
            setDebriefLoading(false);
        }
    }

    function handlePracticeAgain() {
        setMessages([]);
        setInput("");
        setDebriefData(null);
        setDebriefError(null);
        setDebriefLoading(false);
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    if (!meta) {
        return <div className="p-8 text-white">Unknown scenario.</div>;
    }

    // ── Debrief loading screen ──
    if (debriefLoading) {
        return (
            <div className="relative min-h-screen bg-[#05000a] text-purple-50 font-sans antialiased overflow-hidden flex items-center justify-center">
                {/* Glowing spheres */}
                <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
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
                    <div className="absolute inset-0 bg-[#05000a]/30 backdrop-blur-[1px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 flex flex-col items-center gap-5 text-center"
                >
                    <Loader2 className="h-10 w-10 text-purple-400 animate-spin" />
                    <div>
                        <p className="text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent">Analysing your session…</p>
                        <p className="text-sm text-purple-100/70 mt-1">SparIQ AI is evaluating your performance. This takes a few seconds.</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    // ── Debrief result screen ──
    if (debriefData) {
        return (
            <DebriefScreen
                debrief={debriefData}
                scenarioLabel={meta.label}
                onPracticeAgain={handlePracticeAgain}
                onHome={() => window.location.href = "/"}
            />
        );
    }

    // Shared Sidebar Content
    const renderSidebarContent = () => (
        <div className="space-y-5 text-left">
            <div>
                <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest block mb-1">
                    Adversary Persona
                </span>
                <p className="text-[9px] text-purple-100/50 mb-2">
                    Modify their behaviour mid-conversation.
                </p>
                <textarea
                    rows={3}
                    value={personalityDescription}
                    onChange={(e) => setPersonalityDescription(e.target.value)}
                    placeholder="e.g. Strict examiner, demands exact definitions..."
                    className="w-full rounded-xl border border-white/20 bg-black/50 p-2.5 text-xs text-purple-100 placeholder:text-purple-300/40 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300 transition-all resize-none backdrop-blur-xl"
                />
            </div>

            <div>
                <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest block mb-2">
                    Pressure Intensity
                </span>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { id: "easy", label: "Constructive" },
                        { id: "medium", label: "Challenging" },
                        { id: "hard", label: "Adversarial" },
                    ].map((lvl) => (
                        <button
                            key={lvl.id}
                            type="button"
                            onClick={() => setDifficulty(lvl.id)}
                            className={`py-2 rounded-xl border text-center text-xs font-medium transition-all hover:scale-[1.02] active:scale-95 backdrop-blur-xl ${difficulty === lvl.id
                                    ? "border-purple-300 bg-purple-600/40 text-white font-bold shadow-[0_0_20px_rgba(216,180,254,0.4)]"
                                    : "border-white/15 bg-black/40 text-purple-200/70 hover:border-white/30"
                                }`}
                        >
                            {lvl.label}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest block mb-1">
                    Session Context
                </span>
                <p className="text-[9px] text-purple-100/50 mb-2">
                    Override context or rules for the AI evaluator.
                </p>
                <textarea
                    rows={3}
                    value={uploadedContext}
                    onChange={(e) => setUploadedContext(e.target.value)}
                    placeholder="Paste guidelines, instructions, or meeting notes here..."
                    className="w-full rounded-xl border border-white/20 bg-black/50 p-2.5 text-xs text-purple-100 placeholder:text-purple-300/40 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300 transition-all resize-none backdrop-blur-xl"
                />
            </div>

            <div>
                <span className="text-[10px] font-mono text-purple-300 uppercase tracking-widest block mb-2">
                    Upload New Document
                </span>
                <div
                    className={`flex flex-col justify-center border border-dashed rounded-xl bg-black/40 p-3 relative group transition-all backdrop-blur-xl ${isDragging
                            ? "border-purple-300 bg-purple-600/20 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                            : "border-white/25 hover:border-purple-300/60"
                        }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        if (e.dataTransfer.files?.[0]) {
                            handleFileUpload({ target: { files: e.dataTransfer.files } });
                        }
                    }}
                >
                    <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex items-center gap-2 justify-center text-purple-200/60 text-xs">
                        {fileLoading ? (
                            <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                        ) : (
                            <UploadCloud className="h-4 w-4 text-purple-300 group-hover:scale-110 transition-transform" />
                        )}
                        <span className="truncate">
                            {fileLoading ? "Parsing file..." : fileName || "Drop PDF/Docx/TXT or click"}
                        </span>
                    </div>
                </div>
                {uploadError && (
                    <p className="text-[10px] text-rose-400 mt-1">{uploadError}</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="relative h-screen w-screen bg-[#05000a] text-purple-50 font-sans antialiased overflow-hidden flex flex-col selection:bg-purple-500/30 selection:text-purple-200">

            {/* HIGH-VISIBILITY GLOWING BORDER SPHERES */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                {/* Top Right Massive Sphere */}
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

                {/* Mid Left Giant Sphere */}
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

                {/* Bottom Right Sphere */}
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
                <div className="absolute inset-0 bg-[#05000a]/20 backdrop-blur-[0.5px]" />
            </div>

            {/* Header Navbar */}
            <header className="relative z-20 shrink-0 border-b border-white/20 bg-white/[0.03] backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.location.href = "/"}
                        className="p-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-purple-100 transition-all hover:scale-105 active:scale-95 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:border-purple-300/60"
                    >
                        <Home className="h-4 w-4" />
                    </button>
                    <div>
                        <h1 className="text-sm font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-300 bg-clip-text text-transparent flex items-center gap-2">
                            {meta.label}
                        </h1>
                        <p className="text-[10px] text-purple-300 font-mono uppercase tracking-wider font-semibold">
                            BUILT TO CHALLENGE YOU
                        </p>
                    </div>
                </div>

                {/* Center AI Intensity & Audio Monitor */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 backdrop-blur-xl text-xs shadow-inner">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300/70">Intensity:</span>
                    <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                        difficulty === "hard"
                            ? "bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                            : difficulty === "easy"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                                : "bg-purple-500/20 text-purple-300 border-purple-400/40 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                    }`}>
                        {difficulty}
                    </span>
                    {(loading || voiceState === "recording") && (
                        <div className="flex items-center gap-1 ml-1 text-purple-300">
                            <span className="w-1 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                            <span className="w-1 h-5 bg-fuchsia-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                            <span className="w-1 h-4 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                            <span className="w-1 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "450ms" }} />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="md:hidden p-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-purple-100 transition-all backdrop-blur-xl hover:border-purple-300/60"
                    >
                        <Settings className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleEndSession}
                        disabled={messages.length === 0}
                        className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${messages.length > 0
                                ? "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 hover:from-purple-400 hover:to-fuchsia-400 text-white shadow-[0_0_30px_rgba(216,180,254,0.6)] hover:scale-105 active:scale-95 cursor-pointer border border-white/30"
                                : "border border-white/20 bg-white/10 text-purple-200/40 cursor-not-allowed backdrop-blur-xl"
                            }`}
                    >
                        End & Debrief
                    </button>
                </div>
            </header>

            {/* Main Area: Sidebar + Chat Box */}
            <div className="relative z-10 flex-1 min-h-0 flex overflow-hidden p-3 md:p-6 gap-4 max-w-7xl mx-auto w-full">

                {/* Collapsible Sidebar (Desktop) - Made more transparent */}
                <motion.aside
                    animate={{ width: sidebarCollapsed ? "56px" : "280px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="hidden md:flex flex-col relative shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden"
                >
                    {/* Glass Top Edge Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                    {/* Header bar */}
                    <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <span className="text-xs font-bold text-purple-100 flex items-center gap-2">
                                <Sliders className="h-3.5 w-3.5 text-purple-300" />
                                Session Controls
                            </span>
                        )}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-purple-100 transition-all backdrop-blur-xl hover:border-purple-300/60 mx-auto"
                        >
                            {sidebarCollapsed ? (
                                <ChevronRight className="h-4 w-4 text-purple-300" />
                            ) : (
                                <ChevronLeft className="h-4 w-4" />
                            )}
                        </button>
                    </div>

                    {/* Sidebar Content Body */}
                    {!sidebarCollapsed && (
                        <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                            {renderSidebarContent()}
                        </div>
                    )}
                </motion.aside>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSidebarOpen(false)}
                                className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            />
                            <motion.aside
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="md:hidden fixed top-0 right-0 bottom-0 w-[300px] z-50 bg-[#05000a] border-l border-white/20 p-5 overflow-y-auto shadow-2xl flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
                                        <span className="text-xs font-bold text-purple-100 flex items-center gap-2">
                                            <Sliders className="h-3.5 w-3.5 text-purple-300" />
                                            Session Controls
                                        </span>
                                        <button
                                            onClick={() => setSidebarOpen(false)}
                                            className="p-1 rounded-lg text-purple-100 hover:text-white"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                    {renderSidebarContent()}
                                </div>
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* Main Chat Container - Made ultra transparent with no background card */}
                <main className="flex-1 min-w-0 flex flex-col rounded-2xl border border-white/5 bg-transparent backdrop-blur-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden relative">

                    {/* Inner Bar Ambient Particles - More subtle */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        {barParticles.map((p) => (
                            <motion.div
                                key={p.id}
                                animate={{
                                    opacity: [0.05, 0.3, 0.05],
                                    scale: [0.8, 1.2, 0.8],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: p.duration,
                                    delay: p.delay,
                                }}
                                className="absolute rounded-full bg-purple-400/20"
                                style={{
                                    width: `${p.width}px`,
                                    height: `${p.height}px`,
                                    left: `${p.left}%`,
                                    top: `${p.top}%`,
                                    boxShadow: "0 0 6px rgba(192, 132, 252, 0.2)",
                                }}
                            />
                        ))}
                    </div>

                    {/* Chat Log Window - Completely transparent background */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative z-10 custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-purple-100/60 space-y-4">
                                <div className="p-4 rounded-2xl border border-purple-300/30 bg-purple-600/10 text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.1)] backdrop-blur-xl">
                                    <Sparkles className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                                        Ready to Practice
                                    </h3>
                                    <p className="text-xs max-w-sm text-purple-100/70 leading-relaxed drop-shadow mt-1">
                                        Send your opening statement or tap a quick prompt below to start.
                                    </p>
                                </div>

                                {/* Quick-Start Prompts */}
                                <div className="flex flex-wrap items-center justify-center gap-2 max-w-md pt-2">
                                    {(
                                        scenarioType === "interview"
                                            ? ["I'm ready for the interview", "Hello, thanks for having me today", "Let's begin the interview"]
                                            : scenarioType === "viva"
                                                ? ["I'm ready to defend my thesis", "Good day, examiner. Let's start", "I am prepared for questioning"]
                                                : scenarioType === "negotiation"
                                                    ? ["Let's discuss the proposed deal terms", "Thanks for meeting. I'm ready to negotiate", "Let's review the agreement"]
                                                    : scenarioType === "pitch"
                                                        ? ["Let me walk you through our idea.", "Thanks for your time — here's our pitch.", "We're ready to present."]
                                                        : scenarioType === "debate"
                                                            ? ["I'll argue my position first.", "Let's begin the debate.", "Here's the position I'll be defending."]
                                                            : ["I think we need to talk about what happened", "Can we discuss the issue directly?", "I want to address this situation calmly"]
                                    ).map((promptText, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => {
                                                setInput(promptText);
                                            }}
                                            className="text-xs px-3.5 py-1.5 rounded-full border border-purple-300/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-200 hover:text-white transition-all hover:scale-105 active:scale-95 backdrop-blur-xl hover:border-purple-300/60 shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
                                        >
                                            "{promptText}"
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                const isUser = msg.role === "user";
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed shadow-lg ${isUser
                                                    ? "bg-gradient-to-r from-purple-500/90 via-fuchsia-500/90 to-purple-600/90 text-white rounded-br-none shadow-[0_0_30px_rgba(216,180,254,0.3)] border border-white/30"
                                                    : "bg-white/5 backdrop-blur-xl text-purple-50 border border-white/10 rounded-bl-none shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}

                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl rounded-bl-none p-3.5 flex items-center gap-2 text-purple-100/70 text-xs shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                                    <Loader2 className="h-3.5 w-3.5 text-purple-400 animate-spin" />
                                    <span>Adversary responding...</span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input Controls Footer - Ultra transparent */}
                    <div className="relative z-10 p-3 md:p-4 border-t border-white/10 bg-white/[0.02] backdrop-blur-xl">
                        {debriefError && (
                            <p className="text-xs text-rose-400 mb-2">{debriefError}</p>
                        )}

                        <div className="flex items-center gap-2">

                            {/* Voice & AI Language Switcher */}
                            <button
                                type="button"
                                onClick={() =>
                                    setVoiceLanguage((prev) => (prev === "en" ? "ur" : "en"))
                                }
                                title="Toggle AI & Voice language (English / Urdu)"
                                className="px-3 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-semibold text-purple-300 transition-all shrink-0 hover:scale-105 active:scale-95 backdrop-blur-xl hover:border-purple-300/60"
                            >
                                {voiceLanguage === "en" ? "English" : "Urdu"}
                            </button>

                            {/* Voice Record Mic Toggle Button */}
                            <button
                                type="button"
                                onClick={toggleVoiceInput}
                                disabled={voiceState === "transcribing"}
                                title={
                                    voiceState === "recording"
                                        ? "Stop recording"
                                        : "Start voice input"
                                }
                                className={`p-2.5 rounded-xl border transition-all shrink-0 hover:scale-105 active:scale-95 backdrop-blur-xl ${voiceState === "recording"
                                        ? "border-rose-500/50 bg-rose-500/20 text-rose-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                                        : voiceState === "transcribing"
                                            ? "border-amber-500/50 bg-amber-500/20 text-amber-400 cursor-not-allowed"
                                            : "border-white/20 bg-white/10 hover:bg-white/20 text-purple-300 hover:text-white hover:border-purple-300/60"
                                    }`}
                            >
                                {voiceState === "transcribing" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : voiceState === "recording" ? (
                                    <MicOff className="h-4 w-4 text-rose-400" />
                                ) : (
                                    <Mic className="h-4 w-4" />
                                )}
                            </button>

                            {/* Main Chat Input Field - Ultra transparent */}
                            <textarea
                                rows={1}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={
                                    voiceState === "recording"
                                        ? "Listening to your voice..."
                                        : voiceState === "transcribing"
                                            ? "Transcribing audio..."
                                            : "Type your response..."
                                }
                                className="flex-1 rounded-xl border border-white/15 bg-black/30 backdrop-blur-xl px-3.5 py-2.5 text-xs md:text-sm text-purple-100 placeholder:text-purple-300/40 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300/50 transition-all resize-none max-h-24 custom-scrollbar"
                            />

                            {/* Send Message Button */}
                            <button
                                type="button"
                                onClick={sendMessage}
                                disabled={!input.trim() || loading}
                                className={`p-2.5 rounded-xl transition-all shrink-0 ${input.trim() && !loading
                                        ? "bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 hover:from-purple-400 hover:to-fuchsia-400 text-white shadow-[0_0_30px_rgba(216,180,254,0.4)] hover:scale-105 active:scale-95 cursor-pointer border border-white/30"
                                        : "border border-white/15 bg-white/5 text-purple-200/30 cursor-not-allowed backdrop-blur-xl"
                                    }`}
                            >
                                <ArrowUpRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}