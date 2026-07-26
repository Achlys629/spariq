"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  MessageCircleHeart,
  Swords,
  UploadCloud,
  Loader2,
  CheckCircle2,
  History,
  Bot,
  Mic,
  FileText,
  BarChart3,
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
    cardBg: "from-cyan-500/10 via-blue-500/5 to-white/[0.02]",
    hoverBorder: "hover:border-cyan-300/80",
    glow: "hover:shadow-[0_0_35px_rgba(6,182,212,0.4)]",
    iconBg: "bg-cyan-500/15 border-cyan-300/30 group-hover:bg-cyan-500/30",
    iconColor: "text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]",
    badge: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
  },
  {
    id: "viva",
    code: "SIM-02",
    label: "Academic Defense",
    type: "Deep Reasoning",
    description:
      "An examiner that keeps asking why until every concept is fully understood.",
    icon: GraduationCap,
    cardBg: "from-purple-500/10 via-fuchsia-500/5 to-white/[0.02]",
    hoverBorder: "hover:border-purple-300/80",
    glow: "hover:shadow-[0_0_35px_rgba(168,85,247,0.4)]",
    iconBg: "bg-purple-500/15 border-purple-300/30 group-hover:bg-purple-500/30",
    iconColor: "text-purple-300 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]",
    badge: "border-purple-400/30 bg-purple-500/10 text-purple-200",
  },
  {
    id: "negotiation",
    code: "SIM-03",
    label: "Executive Dealmaking",
    type: "Psychological",
    description:
      "Negotiate against an intelligent counterpart who never accepts weak offers.",
    icon: Handshake,
    cardBg: "from-emerald-500/10 via-teal-500/5 to-white/[0.02]",
    hoverBorder: "hover:border-emerald-300/80",
    glow: "hover:shadow-[0_0_35px_rgba(16,185,129,0.4)]",
    iconBg: "bg-emerald-500/15 border-emerald-300/30 group-hover:bg-emerald-500/30",
    iconColor: "text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]",
    badge: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  },
  {
    id: "difficult",
    code: "SIM-04",
    label: "Difficult Conversation",
    type: "High Pressure",
    description:
      "Navigate a tense, emotionally charged conversation where every word and tone matters.",
    icon: MessageCircleHeart,
    cardBg: "from-amber-500/10 via-rose-500/5 to-white/[0.02]",
    hoverBorder: "hover:border-amber-300/80",
    glow: "hover:shadow-[0_0_35px_rgba(245,158,11,0.4)]",
    iconBg: "bg-amber-500/15 border-amber-300/30 group-hover:bg-amber-500/30",
    iconColor: "text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]",
    badge: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  },
  {
    id: "pitch",
    code: "SIM-05",
    label: "Startup Pitch",
    type: "Investor Grade",
    description:
      "A skeptical investor who stress-tests your market size, traction, and defensibility before writing a check.",
    icon: Rocket,
    cardBg: "from-rose-500/10 via-pink-500/5 to-white/[0.02]",
    hoverBorder: "hover:border-rose-300/80",
    glow: "hover:shadow-[0_0_35px_rgba(244,63,94,0.4)]",
    iconBg: "bg-rose-500/15 border-rose-300/30 group-hover:bg-rose-500/30",
    iconColor: "text-rose-300 drop-shadow-[0_0_10px_rgba(251,113,133,0.8)]",
    badge: "border-rose-400/30 bg-rose-500/10 text-rose-200",
  },
  {
    id: "debate",
    code: "SIM-06",
    label: "Debate & Persuasion",
    type: "Logical Rigor",
    description:
      "An opponent who argues the other side, exploits weak logic, and won't concede a point without real evidence.",
    icon: Swords,
    cardBg: "from-cyan-500/10 via-sky-500/5 to-white/[0.02]",
    hoverBorder: "hover:border-cyan-300/80",
    glow: "hover:shadow-[0_0_35px_rgba(34,211,238,0.4)]",
    iconBg: "bg-cyan-500/15 border-cyan-300/30 group-hover:bg-cyan-500/30",
    iconColor: "text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.8)]",
    badge: "border-cyan-400/30 bg-cyan-500/10 text-cyan-200",
  },
];

// HOW IT WORKS STEPS
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Scenario",
    description:
      "Pick from Corporate Interview, Academic Defense, Executive Dealmaking, or a Difficult Conversation — then tell SparIQ who you're really facing, so the AI adapts to that specific personality.",
    badgeColor: "border-purple-400/30 bg-purple-500/10 text-purple-300",
  },
  {
    step: "02",
    title: "Get Challenged, Not Coached",
    description:
      "Speak or type your responses in English or Urdu. The AI pushes back on vague answers, asks hard follow-ups, and holds its position — just like the real conversation you're preparing for.",
    badgeColor: "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
  },
  {
    step: "03",
    title: "Get an Honest Debrief",
    description:
      "When you end the session, SparIQ breaks down what worked, what didn't, and scores your confidence, communication, and critical thinking — grounded in what you actually said.",
    badgeColor: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  },
  {
    step: "04",
    title: "Track Your Progress",
    description:
      "Every session is saved automatically. Revisit past conversations and debriefs anytime from your session history.",
    badgeColor: "border-amber-400/30 bg-amber-500/10 text-amber-300",
  },
];

// FEATURES LIST
const FEATURES = [
  {
    icon: Bot,
    title: "Adaptive AI Personas",
    description:
      "Describe the real person you're facing, and the AI adopts that personality for the session.",
    iconColor: "text-purple-300",
    borderGlow: "group-hover:border-purple-300/60 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
  },
  {
    icon: BriefcaseBusiness,
    title: "4 Practice Scenarios",
    description:
      "Corporate Interview, Academic Defense, Executive Dealmaking, and Difficult Conversation.",
    iconColor: "text-cyan-300",
    borderGlow: "group-hover:border-cyan-300/60 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]",
  },
  {
    icon: Mic,
    title: "Voice & Text Input",
    description:
      "Speak naturally in English or Urdu, or type — both are always available.",
    iconColor: "text-emerald-300",
    borderGlow: "group-hover:border-emerald-300/60 group-hover:shadow-[0_0_35px_rgba(16,185,129,0.3)]",
  },
  {
    icon: FileText,
    title: "Context Upload",
    description:
      "Add a resume, negotiation terms, or background notes so the AI responds with real context.",
    iconColor: "text-amber-300",
    borderGlow: "group-hover:border-amber-300/60 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]",
  },
  {
    icon: BarChart3,
    title: "Structured Debrief",
    description:
      "Specific strengths, weak moments, and scored feedback after every session.",
    iconColor: "text-pink-300",
    borderGlow: "group-hover:border-pink-300/60 group-hover:shadow-[0_0_30px_rgba(244,114,182,0.3)]",
  },
  {
    icon: History,
    title: "Session History",
    description:
      "Every practice session is saved automatically for revisiting and tracking improvement.",
    iconColor: "text-indigo-300",
    borderGlow: "group-hover:border-indigo-300/60 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]",
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
  // Scenario carousel state
  const [scenarioPage, setScenarioPage] = useState(0);

  // Scenario carousel constants & touch refs (must be at component level — React rules of hooks)
  const SCENARIO_CARDS_DESKTOP = 3;
  const SCENARIO_CARDS_MOBILE = 2;
  const scenarioTotalPages = Math.ceil(SCENARIOS.length / SCENARIO_CARDS_DESKTOP); // 2 pages of 3
  const scenarioTouchStartX = useRef(null);
  const scenarioTouchStartY = useRef(null);

  const prevScenarioPage = useCallback(() =>
    setScenarioPage((p) => (p - 1 + scenarioTotalPages) % scenarioTotalPages), [scenarioTotalPages]);
  const nextScenarioPage = useCallback(() =>
    setScenarioPage((p) => (p + 1) % scenarioTotalPages), [scenarioTotalPages]);

  const handleScenarioTouchStart = (e) => {
    scenarioTouchStartX.current = e.touches[0].clientX;
    scenarioTouchStartY.current = e.touches[0].clientY;
  };
  const handleScenarioTouchEnd = (e) => {
    if (scenarioTouchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - scenarioTouchStartX.current;
    const dy = e.changedTouches[0].clientY - scenarioTouchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) nextScenarioPage();
      else prevScenarioPage();
    }
    scenarioTouchStartX.current = null;
  };

  // Visible slices for current page
  const scenarioDesktopStart = scenarioPage * SCENARIO_CARDS_DESKTOP;
  const scenarioDesktopSlice = SCENARIOS.slice(scenarioDesktopStart, scenarioDesktopStart + SCENARIO_CARDS_DESKTOP);
  const scenarioMobilePage = Math.floor((scenarioPage * SCENARIO_CARDS_DESKTOP) / SCENARIO_CARDS_MOBILE);
  const scenarioMobileStart = scenarioMobilePage * SCENARIO_CARDS_MOBILE;
  const scenarioMobileSlice = SCENARIOS.slice(scenarioMobileStart, scenarioMobileStart + SCENARIO_CARDS_MOBILE);

  const selectScenario = (scenario) => {
    setSelectedScenario(scenario);
    setPersonalityDescription("");
    setDifficulty("medium");
    setUploadedContext("");
    setFileName("");
    setUploadError("");
  };

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

  // Variants for smooth slide transitions — zero x-offset prevents any layout reflow/page jump
  const slideVariants = {
    enter: () => ({
      opacity: 0,
      y: 8,
    }),
    center: {
      opacity: 1,
      y: 0,
    },
    exit: () => ({
      opacity: 0,
      y: -8,
    }),
  };

  const imageVariants = {
    enter: () => ({
      opacity: 0,
      scale: 0.94,
    }),
    center: {
      opacity: 1,
      scale: 1,
    },
    exit: () => ({
      opacity: 0,
      scale: 0.94,
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
            <img
              src="/logo/logo.png"
              alt="SparIQ Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow-[0_0_15px_rgba(192,132,252,0.8)] transition-transform hover:scale-105"
            />
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
            {/* Text column — fixed height + overflow:hidden prevents layout collapse on slide change */}
            <div className="md:col-span-7 relative h-[180px] sm:h-[200px] md:h-[240px] lg:h-[280px] w-full overflow-hidden">
              <AnimatePresence mode="sync">
                <motion.div
                  key={currentSlide}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    opacity: { duration: 0.35, ease: "easeInOut" },
                    y: { duration: 0.35, ease: "easeInOut" },
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

            {/* Image column — fixed height container prevents height collapse during transition */}
            <div className="md:col-span-5 relative h-[160px] sm:h-[200px] md:h-[240px] lg:h-[280px] w-full flex justify-center items-center mt-1 md:mt-0 overflow-hidden">
              <AnimatePresence mode="sync">
                <motion.div
                  key={currentSlide}
                  variants={imageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    opacity: { duration: 0.35, ease: "easeInOut" },
                    scale: { duration: 0.35, ease: "easeInOut" },
                  }}
                  className="absolute flex justify-center items-center w-full max-w-[160px] sm:max-w-[200px] md:max-w-[260px] lg:max-w-[300px]"
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

        {/* ================= SCENARIOS CAROUSEL ================= */}
        <section id="scenarios" className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-purple-300 flex items-center gap-1.5 sm:gap-2">
              <Terminal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Choose a Scenario to Begin
            </h2>
            {/* Arrow buttons in header row */}
            <div className="flex gap-1.5 sm:gap-2">
              <button
                onClick={prevScenarioPage}
                className="p-1.5 sm:p-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-purple-100 transition-all backdrop-blur-xl hover:scale-110 active:scale-95 hover:border-purple-300/60 shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
              >
                <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
              <button
                onClick={nextScenarioPage}
                className="p-1.5 sm:p-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-purple-100 transition-all backdrop-blur-xl hover:scale-110 active:scale-95 hover:border-purple-300/60 shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
              >
                <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>

          {/* Carousel wrapper — touch swipe enabled */}
          <div
            onTouchStart={handleScenarioTouchStart}
            onTouchEnd={handleScenarioTouchEnd}
            className="space-y-3"
          >
            {/* ── Desktop: 3 circular cards per page ── */}
            <div className="hidden md:grid md:grid-cols-3 gap-4 lg:gap-5">
              {scenarioDesktopSlice.map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <button
                    key={scenario.id}
                    onClick={() => selectScenario(scenario)}
                    className={`group relative text-center p-5 lg:p-6 rounded-full aspect-square border border-white/20 bg-gradient-to-b ${scenario.cardBg} ${scenario.hoverBorder} ${scenario.glow} transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden hover:scale-[1.04] active:scale-[0.97]`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex flex-col items-center gap-2 lg:gap-3 w-full">
                      <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-full ${scenario.iconBg} border flex items-center justify-center transition-all group-hover:scale-110`}>
                        <Icon className={`w-6 h-6 lg:w-7 lg:h-7 ${scenario.iconColor} transition-all duration-300`} />
                      </div>
                      <div className="space-y-0.5 w-full text-center">
                        <h3 className="text-xs lg:text-sm font-bold text-white tracking-tight drop-shadow-sm">{scenario.label}</h3>
                        <p className="text-[9px] lg:text-[10px] text-purple-100/70 line-clamp-2 leading-relaxed px-2">{scenario.description}</p>
                      </div>
                      <span className={`text-[8px] lg:text-[9px] font-mono px-2 py-0.5 rounded-full border ${scenario.badge} backdrop-blur-md`}>
                        {scenario.type}
                      </span>
                      <span className="text-[8px] lg:text-[9px] font-semibold text-white/55 group-hover:text-white/85 transition-colors tracking-wide">
                        Tap to configure →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Mobile: exactly 2 circular cards per page ── */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:hidden">
              {scenarioMobileSlice.map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <button
                    key={scenario.id}
                    onClick={() => selectScenario(scenario)}
                    className={`group relative text-center p-3 sm:p-4 rounded-full aspect-square border border-white/20 bg-gradient-to-b ${scenario.cardBg} ${scenario.hoverBorder} ${scenario.glow} transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden active:scale-[0.97]`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-full">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${scenario.iconBg} border flex items-center justify-center transition-all`}>
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${scenario.iconColor} group-hover:scale-110 transition-all duration-300`} />
                      </div>
                      <div className="space-y-0.5 w-full text-center">
                        <h3 className="text-[10px] sm:text-xs font-bold text-white tracking-tight drop-shadow-sm">{scenario.label}</h3>
                      </div>
                      <span className={`text-[7px] sm:text-[8px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full border ${scenario.badge} backdrop-blur-md`}>
                        {scenario.type}
                      </span>
                      <span className="text-[7px] sm:text-[8px] font-semibold text-white/55 tracking-wide">
                        Tap to configure →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Navigation: dot indicators + arrow buttons ── */}
            <div className="flex items-center justify-between pt-1">
              {/* Dots — same pill style as hero carousel */}
              <div className="flex gap-1.5 sm:gap-2">
                {Array.from({ length: scenarioTotalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setScenarioPage(idx)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      scenarioPage === idx
                        ? "w-4 sm:w-6 bg-purple-300 shadow-[0_0_12px_#e879f9]"
                        : "w-1.5 sm:w-2 bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
              {/* 06 MODES label on the right */}
              <span className="text-[10px] sm:text-xs font-mono text-purple-200/60">06 MODES</span>
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section id="features" className="space-y-6 pt-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-purple-300" />
              Core System Features
            </h2>
            <span className="text-[10px] sm:text-xs font-mono text-purple-200/60">06 CAPABILITIES</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="group relative p-6 rounded-3xl border border-white/20 bg-gradient-to-b from-white/[0.1] to-white/[0.02] backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_35px_rgba(216,180,254,0.45)] hover:border-purple-300/80 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Glass Specular Top Highlight */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-4">
                    {/* Circular Icon Container */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 border border-purple-300/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-purple-300/70 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                      <Icon className={`h-6 w-6 ${feat.iconColor} drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]`} />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight mb-1.5">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-purple-100/75 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ================= HOW IT WORKS SECTION (ALTERNATING TIMELINE) ================= */}
        <section id="about" className="space-y-6 pt-6 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-white/15 pb-3">
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-purple-300" />
              How SparIQ Works
            </h2>
            <span className="text-[10px] sm:text-xs font-mono text-purple-200/60">04 STEPS</span>
          </div>

          <div className="relative py-4">

            {/* Vertical Connecting Line (Desktop: Center | Mobile: Left-aligned) */}
            <div className="absolute left-5 md:left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-gradient-to-b from-purple-500 via-fuchsia-500 to-indigo-500 shadow-[0_0_15px_rgba(216,180,254,0.6)]" />

            <div className="space-y-8 md:space-y-12">
              {HOW_IT_WORKS.map((stepItem, idx) => {
                const isEven = idx % 2 === 1; // Step 2 & 4 -> Right on desktop
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.15 }}
                    className={`relative flex items-center ${
                      isEven ? "md:flex-row-reverse" : "md:flex-row"
                    }`}
                  >
                    {/* Content Glass Card Box */}
                    <div className="w-full pl-12 md:pl-0 md:w-[45%]">
                      <div className="group relative p-6 rounded-3xl border border-white/20 bg-gradient-to-b from-white/[0.1] to-white/[0.02] backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_0_35px_rgba(216,180,254,0.45)] hover:border-purple-300/80 transition-all duration-300 overflow-hidden">
                        
                        {/* Specular Edge Highlight */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300/60 font-semibold">
                            PHASE {stepItem.step}
                          </span>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${stepItem.badgeColor} backdrop-blur-md`}>
                            STEP {stepItem.step}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white tracking-tight mb-2">
                          {stepItem.title}
                        </h3>
                        <p className="text-xs text-purple-100/75 leading-relaxed">
                          {stepItem.description}
                        </p>
                      </div>
                    </div>

                    {/* Circular Number Badge on the Line */}
                    <div className="absolute left-5 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/40 bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-indigo-600 text-white font-mono font-extrabold text-sm flex items-center justify-center shadow-[0_0_20px_rgba(216,180,254,0.6)] group-hover:scale-110 transition-transform">
                        {stepItem.step}
                      </div>
                    </div>

                    {/* Spacer for 2-column Desktop Balance */}
                    <div className="hidden md:block w-[45%]" />
                  </motion.div>
                );
              })}
            </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl rounded-[28px] sm:rounded-[36px] border border-white/30 bg-gradient-to-b from-white/[0.15] to-white/[0.04] backdrop-blur-3xl p-5 sm:p-7 shadow-[0_30px_60px_rgba(0,0,0,0.9)] text-purple-50 max-h-[88vh] overflow-y-auto custom-scrollbar"
            >
              {/* Glass Top Edge Highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

              {/* Close Button - positioned inside visible padded corner */}
              <button
                type="button"
                onClick={() => setSelectedScenario(null)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/10 hover:bg-white/25 text-purple-100 hover:text-white transition-all backdrop-blur-xl border border-white/20 z-30 shadow-[0_4px_15px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95"
                title="Close modal"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <div className="grid gap-5 sm:gap-6 lg:grid-cols-12 items-stretch relative z-10 pt-1">
                {/* Left Configuration Column */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4 pr-10">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-white/30 backdrop-blur-2xl shadow-inner shrink-0">
                      {selectedScenario.icon && (() => {
                        const ScenarioIcon = selectedScenario.icon;
                        return <ScenarioIcon className="w-6 h-6 sm:w-7 sm:h-7 text-purple-200" />;
                      })()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-[9px] sm:text-xs font-mono uppercase tracking-widest text-purple-300 mb-0.5">
                        <Sparkles className="h-3 w-3" />
                        Configure session
                      </div>
                      <h3 className="text-lg sm:text-2xl font-bold text-white leading-tight">
                        {selectedScenario.label}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-1.5">
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
                      className="w-full rounded-xl sm:rounded-2xl border border-white/20 bg-black/50 p-2.5 text-[10px] sm:text-xs text-purple-100 placeholder:text-purple-300/40 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300 transition-all resize-none backdrop-blur-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] sm:text-xs font-mono uppercase tracking-wider text-purple-200/80">
                      Context / Reference Material (Optional)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <textarea
                          rows={3}
                          value={uploadedContext}
                          onChange={(e) => setUploadedContext(e.target.value)}
                          placeholder="Paste conversation guidelines, meeting details, or notes..."
                          className="w-full h-full min-h-[75px] rounded-xl sm:rounded-2xl border border-white/20 bg-black/50 p-2.5 text-[10px] sm:text-xs text-purple-100 placeholder:text-purple-300/40 focus:border-purple-300 focus:outline-none focus:ring-1 focus:ring-purple-300 transition-all resize-none backdrop-blur-xl custom-scrollbar"
                        />
                      </div>
                      <div className="flex flex-col justify-center border border-dashed border-white/25 rounded-xl sm:rounded-2xl bg-black/40 p-3 relative group hover:border-purple-300/60 transition-colors backdrop-blur-xl min-h-[75px]">
                        <div className="flex flex-col items-center justify-center text-center space-y-1">
                          {fileLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 text-purple-300 animate-spin" />
                              <span className="text-[9px] text-purple-200/80">Parsing file...</span>
                            </>
                          ) : fileName ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              <span className="text-[9px] text-emerald-300 font-mono truncate max-w-[120px]">
                                {fileName}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFileName("");
                                  setUploadedContext("");
                                }}
                                className="text-[8px] text-rose-400 hover:text-rose-300 underline font-mono"
                              >
                                Clear file
                              </button>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="h-4 w-4 text-purple-200/60 group-hover:text-purple-200 transition-colors" />
                              <span className="text-[9px] text-purple-200/80">Upload PDF, DOCX, TXT</span>
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
                          <div className="text-[8px] text-rose-400 font-mono mt-1 text-center">
                            {uploadError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] sm:text-xs font-mono uppercase tracking-wider text-purple-200/80 flex items-center gap-1.5">
                      <Sliders className="h-3 w-3" />
                      Pressure Intensity
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "easy", label: "Constructive", desc: "Standard Q&A" },
                        { id: "medium", label: "Challenging", desc: "Probes weak points" },
                        { id: "hard", label: "Adversarial", desc: "Relentless pressure" },
                      ].map((lvl) => (
                        <button
                          key={lvl.id}
                          onClick={() => setDifficulty(lvl.id)}
                          className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all backdrop-blur-xl ${difficulty === lvl.id
                              ? "border-purple-300 bg-purple-600/40 text-white font-semibold shadow-[0_0_20px_rgba(216,180,254,0.4)]"
                              : "border-white/15 bg-black/40 text-purple-200/70 hover:border-white/30"
                            }`}
                        >
                          <div className="text-[10px] sm:text-xs capitalize mb-0.5">
                            {lvl.label}
                          </div>
                          <div className="text-[8px] sm:text-[9px] text-purple-200/60">
                            {lvl.desc}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Summary Column */}
                <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-white/20 bg-black/60 p-4 sm:p-5 space-y-4 shadow-inner backdrop-blur-xl">
                  <div className="space-y-3">
                    <span className="text-[10px] sm:text-[11px] font-mono text-purple-300 uppercase tracking-widest block flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      Session Summary
                    </span>

                    <div className="space-y-2 text-[10px] sm:text-xs">
                      <div className="flex justify-between py-1.5 border-b border-white/10">
                        <span className="text-purple-200/60">Scenario</span>
                        <span className="text-white font-bold">
                          {selectedScenario.label}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-white/10">
                        <span className="text-purple-200/60">Intensity</span>
                        <span className="text-purple-300 font-mono capitalize font-bold">
                          {difficulty}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-white/10">
                        <span className="text-purple-200/60">Persona</span>
                        <span className="text-purple-100 truncate max-w-[120px] sm:max-w-[150px]">
                          {personalityDescription || "Standard Adversary"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-[10px] sm:text-[11px] text-purple-200/70 leading-relaxed hidden sm:block">
                      Most AI assistants help you.
                      <br />
                      SparIQ challenges your reasoning until you&apos;re prepared for conversations that actually matter.
                    </p>

                    <button
                      onClick={handleBeginSession}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl sm:rounded-2xl font-bold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-600 hover:from-purple-400 hover:to-fuchsia-400 text-white transition-all shadow-[0_0_30px_rgba(216,180,254,0.6)] border border-white/30 text-xs sm:text-sm hover:scale-[1.02] active:scale-95 cursor-pointer"
                    >
                      Start Sparring Session
                      <ArrowUpRight className="h-4 w-4" />
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