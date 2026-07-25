"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Sliders,
  Terminal,
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  BriefcaseBusiness,
  GraduationCap,
  Handshake,
  Rocket,
  UploadCloud,
  Loader2,
  CheckCircle2,
  History,
} from "lucide-react";

// HERO SLIDES
const HERO_SLIDES = [
  {
    id: 1,
    tag: "DESIGNED TO CHALLENGE, NOT HELP",
    title: "Most AI Agrees With You. This One Won't",
    desc: "SparIQ simulates real interviewers, examiners, and negotiators who push back, ask hard follow-ups, and refuse vague answers — so the real thing doesn't catch you off guard.",
    avatar: "/avatars/hero-slide-1.png",
  },
  {
    id: 2,
    tag: "BUILT AROUND YOUR SITUATION",
    title: "Tell It Who You're Really Facing",
    desc: "Describe your actual interviewer, examiner, or counterpart, and SparIQ adopts that personality — so you're not just practicing in general, you're rehearsing for the real conversation ahead",
    avatar: "/avatars/hero-slide-2.png",
  },
  {
    id: 3,
    tag: "HONEST FEEDBACK, NOT FLATTERY",
    title: "Know Exactly Where You Stood.",
    desc: "After every session, get a specific breakdown of what worked, what didn't, and where your reasoning held up — grounded in what you actually said, not a generic score.",
    avatar: "/avatars/hero-slide-3.png",
  },
];

// SCENARIOS
const SCENARIOS = [
  {
    id: "interview",
    code: "SIM-01",
    label: "Corporate Interview",
    type: "Adaptive AI Opponent",
    description:
      "A hiring manager who questions every claim, demands evidence and pushes until your reasoning is clear.",
    icon: BriefcaseBusiness,
  },
  {
    id: "viva",
    code: "SIM-02",
    label: "Academic Defense",
    type: "Deep Reasoning",
    description:
      "An examiner that keeps asking why until every concept is fully understood.",
    icon: GraduationCap,
  },
  {
    id: "negotiation",
    code: "SIM-03",
    label: "Executive Dealmaking",
    type: "Psychological",
    description:
      "Negotiate against an intelligent counterpart who never accepts weak offers.",
    icon: Handshake,
  },
  {
    id: "difficult",
    code: "SIM-04",
    label: "Difficult Conversation",
    type: "High Pressure",
    description:
      "Navigate a tense, emotionally charged conversation where every word and tone matters.",
    icon: Rocket,
  },
];

export default function Home() {
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [personalityDescription, setPersonalityDescription] = useState("");
  const [difficulty, setDifficulty] = useState("medium");

  const [uploadedContext, setUploadedContext] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [direction, setDirection] = useState(0);

  // Auto-slide functionality with smooth transitions
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
    );
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const selectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setPersonalityDescription("");
    setDifficulty("medium");
    setUploadedContext("");
    setFileName("");
    setUploadError("");
  };

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

  function handleBeginSession() {
    if (!selectedScenario) return;

    sessionStorage.setItem(
      `sparIQ-session-${selectedScenario.id}`,
      JSON.stringify({
        personalityDescription,
        difficulty,
        uploadedContext,
      })
    );

    router.push(`/session/${selectedScenario.id}`);
  }

  // Variants for smooth slide transitions
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const imageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <main className="relative min-h-screen bg-[#05000a] text-purple-50 font-sans antialiased overflow-hidden selection:bg-purple-500/30 selection:text-purple-200">

      {/* ================= HIGH-VISIBILITY GLOWING BORDER SPHERES ================= */}
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

        {/* Subtle Ambient Dimmer for UI Readability */}
        <div className="absolute inset-0 bg-[#05000a]/30 backdrop-blur-[1px]" />
      </div>

      {/* ================= TOP NAVIGATION HEADER ================= */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/20 bg-white/[0.03] backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => router.push("/")}>
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-pink-400 flex items-center justify-center shadow-[0_0_25px_rgba(216,180,254,0.6)] border border-white/40">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <span className="text-base sm:text-xl font-black tracking-tight text-white block leading-none">
                SparIQ
              </span>
              <span className="text-[8px] sm:text-[10px] font-mono uppercase text-purple-300 tracking-widest">
                AI Simulation Lab
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-purple-100/80">
            <a href="#scenarios" className="hover:text-white transition-colors">
              Scenarios
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              How it Works
            </a>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/history")}
              className="text-xs sm:text-sm font-semibold text-white px-3 sm:px-4 py-1.5 sm:py-2 transition-all flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:border-purple-300/60"
            >
              <History className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-300" />
              <span className="hidden sm:inline">Past Sessions</span>
              <span className="sm:hidden">History</span>
            </button>
          </div>

        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-10 space-y-6 sm:space-y-8">

        {/* ================= HERO CAROUSEL CONTAINER ================= */}
        <section className="relative rounded-[30px] sm:rounded-[60px] border border-white/25 bg-gradient-to-b from-white/[0.12] to-white/[0.03] backdrop-blur-3xl p-4 sm:p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">

          {/* Glass Specular Top Border Highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          <div className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-5 items-center">
            <div className="md:col-span-7 relative h-[180px] sm:h-[200px] md:h-[240px] lg:h-[280px] w-full">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.4 }
                  }}
                  className="absolute inset-0 flex flex-col justify-center space-y-1.5 sm:space-y-3"
                >
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs font-mono uppercase tracking-widest text-purple-200 bg-white/10 px-2.5 sm:px-4 py-0.5 sm:py-1.5 rounded-full border border-white/20 backdrop-blur-xl shadow-inner w-fit">
                    <Zap className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-purple-300" />
                    {HERO_SLIDES[currentSlide].tag}
                  </div>
                  <h2 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-tight drop-shadow leading-tight">
                    {HERO_SLIDES[currentSlide].title}
                  </h2>
                  <p className="text-[10px] sm:text-xs md:text-sm text-purple-100/90 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {HERO_SLIDES[currentSlide].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="md:col-span-5 flex justify-center items-center mt-1 md:mt-0">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentSlide}
                  custom={direction}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 250, damping: 30 },
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4 }
                  }}
                  className="relative w-full max-w-[160px] sm:max-w-[200px] md:max-w-[260px] lg:max-w-[300px]"
                >
                  {/* Glowing aura behind image */}
                  <div className="absolute inset-0 -z-10 bg-purple-500/20 blur-2xl sm:blur-3xl animate-pulse" />

                  <motion.img
                    src={HERO_SLIDES[currentSlide].avatar}
                    alt="Hero Avatar"
                    className="w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(168,85,247,0.3)] sm:drop-shadow-[0_20px_60px_rgba(168,85,247,0.4)]"
                    animate={{
                      y: [0, -8, 0],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      y: {
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      },
                      scale: {
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Reduced vertical space navigation */}
          <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/15 mt-2 sm:mt-3">
            <div className="flex gap-1.5 sm:gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${currentSlide === idx
                      ? "w-4 sm:w-6 bg-purple-300 shadow-[0_0_12px_#e879f9]"
                      : "w-1.5 sm:w-2 bg-white/30 hover:bg-white/50"
                    }`}
                />
              ))}
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <button
                onClick={prevSlide}
                className="p-1 sm:p-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-purple-100 transition-all backdrop-blur-xl hover:scale-110 active:scale-95 hover:border-purple-300/60"
              >
                <ChevronLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1 sm:p-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-purple-100 transition-all backdrop-blur-xl hover:scale-110 active:scale-95 hover:border-purple-300/60"
              >
                <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ================= SCENARIOS CIRCULAR CARDS ================= */}
        <section id="scenarios" className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-purple-300 flex items-center gap-1.5 sm:gap-2">
              <Terminal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Select Scenario to Launch
            </h2>
            <span className="text-[10px] sm:text-xs font-mono text-purple-200/60">04 MODES</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
            {SCENARIOS.map((scenario) => {
              const Icon = scenario.icon;
              return (
                <button
                  key={scenario.id}
                  onClick={() => selectScenario(scenario)}
                  className="group relative text-center p-3 sm:p-4 md:p-5 lg:p-6 rounded-[20px] sm:rounded-[30px] md:rounded-full aspect-square border border-white/20 bg-gradient-to-b from-white/[0.1] to-white/[0.02] hover:from-white/[0.18] hover:to-white/[0.08] hover:border-purple-300/80 transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_35px_rgba(216,180,254,0.45)] overflow-hidden"
                >
                  {/* Glass Card Specular Edge Accent */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3 w-full">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-purple-500/10 border border-purple-300/20 flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-purple-300 group-hover:text-white group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                    </div>

                    <div className="space-y-0.5 sm:space-y-1 w-full text-center">
                      <h3 className="text-[10px] sm:text-xs md:text-sm font-bold text-white tracking-tight drop-shadow-sm">
                        {scenario.label}
                      </h3>
                      <p className="text-[8px] sm:text-[9px] md:text-[10px] text-purple-100/70 line-clamp-2 leading-relaxed px-1 sm:px-2 hidden sm:block">
                        {scenario.description}
                      </p>
                    </div>

                    <span className="text-[7px] sm:text-[8px] md:text-[9px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full border border-white/20 bg-black/40 text-purple-200 backdrop-blur-md">
                      {scenario.type}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs text-purple-200/70 border-t border-white/15 pt-3 sm:pt-4 gap-2 sm:gap-3">
          <p>© SparIQ Engine. High-pressure AI simulation lab.</p>
          <div className="flex items-center gap-2 font-mono text-purple-300">
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>SYSTEM READY</span>
          </div>
        </footer>
      </div>

      {/* ================= FROSTED GLASS POPUP MODAL ================= */}
      <AnimatePresence>
        {selectedScenario && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl rounded-[30px] sm:rounded-[50px] border border-white/30 bg-gradient-to-b from-white/[0.15] to-white/[0.04] backdrop-blur-3xl p-4 sm:p-6 md:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.9)] overflow-hidden text-purple-50 max-h-[90vh] overflow-y-auto"
            >
              {/* Glass Top Edge Highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

              <button
                onClick={() => setSelectedScenario(null)}
                className="absolute top-3 right-3 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-full bg-white/15 text-purple-100 hover:text-white hover:bg-white/25 transition-colors backdrop-blur-xl border border-white/20"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 items-start relative z-10 pt-1 sm:pt-2">
                <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-white/30 backdrop-blur-2xl shadow-inner">
                      {selectedScenario.icon && (() => {
                        const ScenarioIcon = selectedScenario.icon;
                        return <ScenarioIcon className="w-6 h-6 sm:w-8 sm:h-8 text-purple-200" />;
                      })()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-xs font-mono uppercase tracking-widest text-purple-300 mb-0.5">
                        <Sparkles className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                        Configure your session
                      </div>
                      <h3 className="text-lg sm:text-2xl font-bold text-white">
                        {selectedScenario.label}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-xs font-mono uppercase tracking-wider text-purple-200/80">
                      AI Evaluator Persona / Prompt
                    </label>
                    <textarea
                      rows={2}
                      value={personalityDescription}
                      onChange={(e) =>
                        setPersonalityDescription(e.target.value)
                      }
                      placeholder="Describe who you're preparing to face..."
                      className="w-full rounded-xl sm:rounded-2xl border border-white/20 bg-black/50 p-2.5 sm:p-3 text-[10px] sm:text-xs text-purple-100 placeholder:text-purple-300/40 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300 transition-all resize-none backdrop-blur-xl"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[9px] sm:text-xs font-mono uppercase tracking-wider text-purple-200/80">
                      Context / Reference Material (Optional)
                    </label>
                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      <div>
                        <textarea
                          rows={2}
                          value={uploadedContext}
                          onChange={(e) => setUploadedContext(e.target.value)}
                          placeholder="Paste conversation guidelines, rules, meeting details, or notes here..."
                          className="w-full h-full min-h-[60px] sm:min-h-[90px] rounded-xl sm:rounded-2xl border border-white/20 bg-black/50 p-2.5 sm:p-3 text-[10px] sm:text-xs text-purple-100 placeholder:text-purple-300/40 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300 transition-all resize-none backdrop-blur-xl"
                        />
                      </div>
                      <div className="flex flex-col justify-center border border-dashed border-white/25 rounded-xl sm:rounded-2xl bg-black/40 p-3 sm:p-4 relative group hover:border-purple-300/60 transition-colors backdrop-blur-xl">
                        <div className="flex flex-col items-center justify-center text-center space-y-1">
                          {fileLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-300 animate-spin" />
                              <span className="text-[9px] sm:text-[10px] text-purple-200/80">Parsing file...</span>
                            </>
                          ) : fileName ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" />
                              <span className="text-[9px] sm:text-[10px] text-emerald-300 font-mono truncate max-w-[100px] sm:max-w-[130px]">
                                {fileName}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFileName("");
                                  setUploadedContext("");
                                }}
                                className="text-[8px] sm:text-[9px] text-rose-400 hover:text-rose-300 underline font-mono"
                              >
                                Clear file
                              </button>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="h-4 w-4 sm:h-5 sm:w-5 text-purple-200/60 group-hover:text-purple-200 transition-colors" />
                              <span className="text-[9px] sm:text-[10px] text-purple-200/80">Upload PDF, DOCX, or TXT</span>
                              <input
                                type="file"
                                accept=".pdf,.docx,.txt"
                                onChange={handleFileUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </>
                          )}
                        </div>
                        {uploadError && (
                          <div className="text-[8px] sm:text-[9px] text-rose-400 font-mono mt-1 text-center">
                            {uploadError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2.5">
                    <label className="text-[9px] sm:text-xs font-mono uppercase tracking-wider text-purple-200/80 flex items-center gap-1.5 sm:gap-2">
                      <Sliders className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                      Pressure Intensity
                    </label>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                      {[
                        { id: "easy", label: "Constructive", desc: "Standard Q&A" },
                        { id: "medium", label: "Challenging", desc: "Probes weak points" },
                        { id: "hard", label: "Adversarial", desc: "Relentless pressure" },
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          onClick={() => setDifficulty(lvl.id)}
                          className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all backdrop-blur-xl ${difficulty === lvl.id
                              ? "border-purple-300 bg-purple-600/40 text-white font-semibold shadow-[0_0_20px_rgba(216,180,254,0.4)]"
                              : "border-white/15 bg-black/40 text-purple-200/70 hover:border-white/30"
                            }`}
                        >
                          <div className="text-[10px] sm:text-xs capitalize mb-0.5">
                            {lvl.label}
                          </div>
                          <div className="text-[8px] sm:text-[10px] text-purple-200/60">
                            {lvl.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 h-full flex flex-col justify-between rounded-[20px] sm:rounded-[30px] border border-white/20 bg-black/50 p-3 sm:p-5 space-y-4 sm:space-y-6 shadow-inner backdrop-blur-xl">
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-mono text-purple-300 uppercase tracking-widest block mb-2 sm:mb-3 flex items-center gap-1 sm:gap-1.5">
                      <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      Session Summary
                    </span>

                    <div className="space-y-1.5 sm:space-y-2.5 text-[10px] sm:text-xs">
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-purple-200/60">Scenario</span>
                        <span className="text-white font-bold">
                          {selectedScenario.label}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-purple-200/60">Intensity</span>
                        <span className="text-purple-300 font-mono capitalize font-bold">
                          {difficulty}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/10">
                        <span className="text-purple-200/60">Persona</span>
                        <span className="text-purple-100 truncate max-w-[100px] sm:max-w-[140px]">
                          {personalityDescription || "Standard Adversary"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-[10px] sm:text-[11px] text-purple-200/70 leading-relaxed hidden sm:block">
                      Most AI assistants help you.
                      <br />
                      SparIQ challenges your reasoning until you&apos;re prepared for conversations that actually matter.
                    </p>

                    <button
                      onClick={handleBeginSession}
                      className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3.5 px-3 sm:px-5 rounded-xl sm:rounded-2xl font-semibold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 hover:from-purple-400 hover:to-fuchsia-400 text-white transition-all shadow-[0_0_30px_rgba(216,180,254,0.6)] border border-white/30 text-xs sm:text-sm"
                    >
                      Start Sparring Session
                      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}