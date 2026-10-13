"use client";

import { useRef, useState, useEffect, useCallback, type FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contact } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type FormState = "idle" | "sending" | "success" | "error";
type ActiveField = "from" | "message" | "name";

const KEYBOARD_ROWS = [
  ["1","2","3","4","5","6","7","8","9","0"],
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L","@"],
  ["Z","X","C","V","B","N","M",".","-","_"],
] as const;

/**
 * Web Audio API synthesizer for authentic vintage mechanical typewriter sound FX.
 * Zero external audio files, zero network delay, 100% code-synthesized.
 */
class TypewriterSound {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  constructor(isMuted = false) {
    this.isMuted = isMuted;
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /** Key strike clack: metallic slug striking ribbon and platen */
  playKeyClack() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      // 1. Noise transient (mechanical slug impact)
      const bufferSize = Math.floor(ctx.sampleRate * 0.022);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1550 + (Math.random() * 240 - 120), t);
      filter.Q.setValueAtTime(2.8, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t);

      // 2. Resonant keybed strike tone
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const freq = 560 + (Math.random() * 80 - 40);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(70, t + 0.035);

      oscGain.gain.setValueAtTime(0.15, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);
    } catch {}
  }

  /** Spacebar thud: deeper, heavier wooden/metal keybed resonance */
  playSpaceThud() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(42, t + 0.055);

      oscGain.gain.setValueAtTime(0.22, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    } catch {}
  }

  /** Authentic brass bell DING! */
  playBellDing() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const harmonics = [2093, 4186, 6279];
      harmonics.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq + (Math.random() * 10 - 5), t);

        const amp = idx === 0 ? 0.24 : idx === 1 ? 0.08 : 0.03;
        gain.gain.setValueAtTime(amp, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.9);
      });
    } catch {}
  }

  /** Carriage slide mechanical ratchet clicks */
  playCarriageSlide() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const clickTime = t + 0.04 + i * 0.045;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(720 + i * 110, clickTime);
        gain.gain.setValueAtTime(0.055, clickTime);
        gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(clickTime);
        osc.stop(clickTime + 0.025);
      }
    } catch {}
  }
}

/**
 * Contact section — 3D interactive typewriter.
 *
 * A realistic vintage typewriter rendered with CSS 3D transforms.
 * Keys react to physical keyboard input and clicks.
 * Paper scrolls through the carriage as you type.
 */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const carriageRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<TypewriterSound | null>(null);

  const [formState, setFormState] = useState<FormState>("idle");
  const [activeField, setActiveField] = useState<ActiveField>("from");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let initialMuted = false;
    try {
      initialMuted = localStorage.getItem("typewriter_muted") === "true";
    } catch {}
    soundRef.current = new TypewriterSound(initialMuted);
    if (initialMuted) {
      setTimeout(() => setIsMuted(true), 0);
    }
  }, []);

  const toggleSound = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (soundRef.current) {
        soundRef.current.isMuted = next;
        if (!next) {
          soundRef.current.playKeyClack();
        }
      }
      try {
        localStorage.setItem("typewriter_muted", String(next));
      } catch {}
      return next;
    });
  }, []);

  const MAX_CHARS_PER_LINE = 42;

  /* ── Scroll entrance ────────────────────────────── */
  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      }
    );
  }, []);

  /* ── Carriage animation ─────────────────────────── */
  const syncCarriage = useCallback((text: string, instant = false) => {
    if (!carriageRef.current) return;
    
    // Get the length of the current line (after the last \n)
    const lines = text.split("\n");
    const currentLineLen = lines[lines.length - 1].length;
    
    // Calculate physical offset. Limit how far it can physically slide
    // so it never slides completely off screen.
    const maxShift = typeof window !== "undefined" && window.innerWidth < 768 ? 25 : 45;
    const clampedLen = Math.min(currentLineLen, maxShift);
    const offset = clampedLen * -8;
    
    gsap.to(carriageRef.current, {
      x: offset,
      duration: instant ? 0 : 0.08,
      ease: instant ? "none" : "power2.out",
    });
  }, []);

  const resetCarriage = useCallback(() => {
    if (!carriageRef.current) return;
    gsap.to(carriageRef.current, {
      x: 0,
      duration: 0.3,
      ease: "power3.out",
    });
  }, []);

  /* Helper to get current field text */
  const getFieldText = useCallback((field: ActiveField) => {
    if (field === "from") return fromEmail;
    if (field === "message") return message;
    return fullName;
  }, [fromEmail, message, fullName]);

  /* ── Typing logic ───────────────────────────────── */
  const handleType = useCallback((char: string) => {
    if (formState !== "idle") return;
    
    const setter =
      activeField === "from" ? setFromEmail
      : activeField === "message" ? setMessage
      : setFullName;

    setter((prev) => {
      const lines = prev.split("\n");
      const currentLineLen = lines[lines.length - 1].length;

      // Typewriter margin physics
      if (currentLineLen >= MAX_CHARS_PER_LINE) {
        if (activeField === "message") {
          // Auto-carriage return for multiline with chime
          soundRef.current?.playBellDing();
          soundRef.current?.playCarriageSlide();
          const next = prev + "\n" + char;
          syncCarriage(next);
          return next;
        } else {
          // Margin lock (can't type past margin on single line)
          soundRef.current?.playBellDing();
          if (carriageRef.current) {
             gsap.fromTo(carriageRef.current, 
               { x: (MAX_CHARS_PER_LINE * -8) - 4 }, 
               { x: MAX_CHARS_PER_LINE * -8, duration: 0.1, ease: "bounce.out" }
             );
          }
          return prev;
        }
      }

      // Audio feedback
      if (char === " ") {
        soundRef.current?.playSpaceThud();
      } else {
        soundRef.current?.playKeyClack();
      }

      const next = prev + char;
      syncCarriage(next);
      return next;
    });
  }, [activeField, formState, syncCarriage]);

  const handleBackspace = useCallback(() => {
    if (formState !== "idle") return;
    soundRef.current?.playKeyClack();
    const setter =
      activeField === "from" ? setFromEmail
      : activeField === "message" ? setMessage
      : setFullName;

    setter((prev) => {
      if (prev.length === 0) return prev;
      const next = prev.slice(0, -1);
      syncCarriage(next);
      return next;
    });
  }, [activeField, formState, syncCarriage]);

  const handleReturn = useCallback(() => {
    if (formState !== "idle") return;
    soundRef.current?.playBellDing();
    soundRef.current?.playCarriageSlide();
    resetCarriage();
    
    if (activeField === "from") {
      setActiveField("message");
      syncCarriage(message);
    } else if (activeField === "message") {
      setActiveField("name");
      syncCarriage(fullName);
    }
  }, [activeField, formState, message, fullName, syncCarriage, resetCarriage]);

  const handleNewline = useCallback(() => {
    if (formState !== "idle" || activeField !== "message") return;
    soundRef.current?.playBellDing();
    soundRef.current?.playCarriageSlide();
    resetCarriage();
    setMessage((prev) => {
      const next = prev + "\n";
      syncCarriage(next);
      return next;
    });
  }, [formState, activeField, syncCarriage, resetCarriage]);

  const changeField = useCallback((newField: ActiveField) => {
    setActiveField(newField);
    syncCarriage(getFieldText(newField), true);
  }, [getFieldText, syncCarriage]);

  const flashKey = useCallback((key: string) => {
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 120);
  }, []);

  /* ── Physical keyboard listener ─────────────────── */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (formState !== "idle") return;

      if (e.key === "Backspace") {
        e.preventDefault(); flashKey("BACK"); handleBackspace(); return;
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); flashKey("RET"); handleReturn(); return;
      }
      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault(); flashKey("RET"); handleNewline(); return;
      }
      if (e.key === "Tab") {
        e.preventDefault(); flashKey("RET"); handleReturn(); return;
      }
      if (e.key === " ") {
        e.preventDefault(); flashKey("SPC"); handleType(" "); return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        flashKey(e.key.toUpperCase());
        handleType(e.key);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [formState, handleType, handleBackspace, handleReturn, handleNewline, flashKey]);

  /* ── On-screen key handler ──────────────────────── */
  function handleKeyClick(key: string) {
    if (key === "SPC") { flashKey("SPC"); handleType(" "); }
    else if (key === "BACK") { flashKey("BACK"); handleBackspace(); }
    else if (key === "RET") { flashKey("RET"); handleReturn(); }
    else if (key === "SEND") { flashKey("SEND"); handleSubmit(); }
    else { flashKey(key); handleType(key.toLowerCase()); }
  }

  /* ── Submit ─────────────────────────────────────── */
  function handleSubmit(e?: FormEvent<HTMLFormElement>) {
    if (e) e.preventDefault();
    if (!fromEmail.trim() || !message.trim() || !fullName.trim()) return;
    soundRef.current?.playBellDing();
    soundRef.current?.playCarriageSlide();
    setFormState("sending");
    setTimeout(() => setFormState("success"), 1200);
  }

  function handleReset() {
    setFormState("idle");
    setFromEmail(""); setMessage(""); setFullName("");
    changeField("from");
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label="Contact"
      className="relative py-16 md:py-24 lg:py-28 bg-wine overflow-hidden"
    >
      <div className="mx-auto max-w-6xl w-full px-6 md:px-8">
        <h2 className="text-3xl md:text-5xl text-cream mb-3 md:mb-4">Get in touch</h2>
        <p
          className="text-cream/70 mb-8 md:mb-10 max-w-2xl text-base"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Type your message on the typewriter below.
        </p>

      {/* ══════════════════════════════════════════════════
          3D TYPEWRITER
         ══════════════════════════════════════════════════ */}
      <div
        ref={contentRef}
        className="max-w-3xl mx-auto relative"
        style={{ perspective: "1400px" }}
      >
        {/* ── GROUNDING CONTACT & AMBIENT DESK SHADOWS ────── */}
        <div
          aria-hidden="true"
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[94%] h-28 pointer-events-none rounded-[50%]"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, rgba(10,2,5,0.88) 0%, rgba(20,5,10,0.5) 45%, transparent 75%)",
            filter: "blur(22px)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[86%] h-8 pointer-events-none rounded-[50%]"
          style={{
            background: "rgba(0,0,0,0.95)",
            filter: "blur(8px)",
          }}
        />

        <div
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(14deg)",
          }}
        >
          {/* ── CARRIAGE ASSEMBLY — the whole thing moves ── */}
          <div
            ref={carriageRef}
            className="relative z-10"
            style={{ willChange: "transform" }}
          >
            {/* Paper roller bar (Platen Cylinder) */}
            <div
              className="relative mx-auto rounded-full"
              style={{
                width: "92%",
                height: 32,
                /* True 3D rubber platen cylinder shading */
                background: "linear-gradient(180deg, #101316 0%, #2e353e 14%, #5e6978 30%, #293038 60%, #121518 88%, #08090a 100%)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.75), inset 0 2px 2px rgba(255,255,255,0.3), inset 0 -3px 5px rgba(0,0,0,0.9)",
                zIndex: 5,
              }}
            >
              {/* Chrome Paper Bail Bar (holds paper tight to roller) */}
              <div
                aria-hidden="true"
                className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[3px] rounded-full z-10 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, #ffffff 0%, #d5dde5 40%, #76818c 100%)",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.7)",
                }}
              >
                {/* Left bail roller guide */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 rounded-[2px]"
                  style={{
                    left: "22%",
                    width: 14,
                    height: 11,
                    background: "linear-gradient(180deg, #444, #181818 60%, #0a0a0a 100%)",
                    border: "1px solid #5a6068",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
                  }}
                />
                {/* Right bail roller guide */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 rounded-[2px]"
                  style={{
                    right: "22%",
                    width: 14,
                    height: 11,
                    background: "linear-gradient(180deg, #444, #181818 60%, #0a0a0a 100%)",
                    border: "1px solid #5a6068",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
                  }}
                />
              </div>

              {/* Carriage Return Lever (Left Side - Interactive!) */}
              <button
                type="button"
                onClick={() => {
                  flashKey("RET");
                  handleReturn();
                }}
                className="absolute z-10 cursor-pointer group outline-none"
                style={{
                  top: -8,
                  left: -44,
                  width: 56,
                  height: 14,
                  background: "linear-gradient(180deg, #ffffff 0%, #adb6c0 30%, #4f5862 70%, #1f2429 100%)",
                  borderRadius: "7px 0 0 7px",
                  transformOrigin: "right center",
                  transform: "rotate(-15deg)",
                  boxShadow: "0 6px 10px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.8)",
                  transition: "transform 0.1s ease-out",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
                title="Carriage Return Lever (Return / Next Line)"
                aria-label="Carriage Return Lever"
              >
                {/* Finger paddle on lever */}
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 group-hover:brightness-125 group-active:scale-95 transition-all"
                  style={{
                    width: 22,
                    height: 32,
                    background: "linear-gradient(135deg, #444a52 0%, #1c2024 60%, #0d0f11 100%)",
                    borderRadius: "45% 10% 10% 45%",
                    boxShadow: "inset 2px 0 4px rgba(255,255,255,0.25), 4px 6px 12px rgba(0,0,0,0.85)",
                    border: "1px solid #333a42",
                  }}
                />
              </button>

              {/* 3D Cylindrical Roller Knobs */}
              <div
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #9aa2ab 0%, #4b525b 50%, #1c2024 100%)",
                  boxShadow: "3px 4px 8px rgba(0,0,0,0.75), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.6)",
                  border: "2px solid #3b424a",
                }}
              >
                {/* Fluted ribbed ring & chrome center hub */}
                <div className="absolute inset-1.5 rounded-full border border-white/20" />
                <div
                  className="absolute inset-2.5 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 40% 40%, #ffffff 0%, #adb5be 60%, #505862 100%)",
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.5)",
                  }}
                />
              </div>
              <div
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #9aa2ab 0%, #4b525b 50%, #1c2024 100%)",
                  boxShadow: "3px 4px 8px rgba(0,0,0,0.75), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.6)",
                  border: "2px solid #3b424a",
                }}
              >
                <div className="absolute inset-1.5 rounded-full border border-white/20" />
                <div
                  className="absolute inset-2.5 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 40% 40%, #ffffff 0%, #adb5be 60%, #505862 100%)",
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.5)",
                  }}
                />
              </div>
            </div>

            {/* Paper guide bar with ruler */}
            <div
              className="mx-auto flex overflow-hidden"
              style={{
                width: "88%",
                height: 8,
                background: "linear-gradient(180deg, #999, #d0d0d0 30%, #777 80%, #555)",
                marginTop: -4,
                zIndex: 6,
                position: "relative",
                borderRadius: "2px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
              }}
            >
              {/* Ruler hash marks */}
              <div
                className="w-full h-full opacity-50"
                style={{
                  backgroundImage: "repeating-linear-gradient(90deg, #333 0px, #333 1px, transparent 1px, transparent 10px)",
                  backgroundPosition: "bottom",
                  backgroundSize: "10px 4px",
                  backgroundRepeat: "repeat-x"
                }}
              />
            </div>

            {/* ── THE PAPER (aged, old-school) ────────── */}
            <div
              className="relative mx-auto overflow-hidden"
              style={{
                width: "85%",
                minHeight: 300,
                /* Aged yellowed paper base */
                background: "linear-gradient(170deg, #e8d5a3 0%, #dcc78e 25%, #d4bc7a 50%, #e0cb90 75%, #d8c080 100%)",
                /* Notebook lines */
                backgroundImage: `
                  linear-gradient(170deg, #e8d5a3 0%, #dcc78e 25%, #d4bc7a 50%, #e0cb90 75%, #d8c080 100%),
                  repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(100,80,50,0.18) 23px, rgba(100,80,50,0.18) 24px)
                `,
                backgroundBlendMode: "normal",
                boxShadow:
                  "inset 0 0 60px rgba(80,50,20,0.15), inset 0 0 120px rgba(60,30,10,0.08), 4px 4px 20px rgba(0,0,0,0.2)",
                borderLeft: "1px solid rgba(120,80,30,0.25)",
                borderRight: "1px solid rgba(120,80,30,0.25)",
                zIndex: 3,
              }}
            >
              {/* Noise/grain texture overlay for paper fiber look */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "repeat",
                  backgroundSize: "180px 180px",
                  opacity: 0.06,
                  mixBlendMode: "multiply",
                }}
              />



              {/* Small ink blot (left side) */}
              <div
                aria-hidden="true"
                className="absolute pointer-events-none rounded-full"
                style={{
                  top: 180,
                  left: 25,
                  width: 8,
                  height: 6,
                  background: "rgba(40,20,10,0.15)",
                  borderRadius: "60% 40% 50% 50%",
                }}
              />

              {/* Age spots / foxing marks */}
              <div
                aria-hidden="true"
                className="absolute pointer-events-none rounded-full"
                style={{
                  bottom: 60,
                  right: 80,
                  width: 12,
                  height: 10,
                  background: "rgba(130,90,40,0.08)",
                  borderRadius: "50%",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute pointer-events-none rounded-full"
                style={{
                  bottom: 100,
                  left: 120,
                  width: 18,
                  height: 14,
                  background: "rgba(120,80,30,0.06)",
                  borderRadius: "40% 60% 50% 50%",
                }}
              />

              {/* Burn / water damage at edges */}
              <div
                aria-hidden="true"
                className="absolute top-0 right-0 pointer-events-none"
                style={{
                  width: 80,
                  height: 60,
                  background: "radial-gradient(ellipse at top right, rgba(100,60,20,0.1) 0%, transparent 70%)",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 pointer-events-none"
                style={{
                  width: 100,
                  height: 40,
                  background: "radial-gradient(ellipse at bottom left, rgba(90,50,15,0.08) 0%, transparent 70%)",
                }}
              />

              {/* Red margin line */}
              <div
                className="absolute top-0 bottom-0"
                style={{
                  left: 52,
                  width: 2,
                  background: "rgba(180,50,50,0.2)",
                }}
              />
              {/* Second faint margin line */}
              <div
                className="absolute top-0 bottom-0"
                style={{
                  left: 56,
                  width: 1,
                  background: "rgba(180,50,50,0.1)",
                }}
              />

              {/* Paper content */}
              <div className="px-10 py-8 md:px-14 md:py-10">
                <div
                  className="space-y-3 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", color: "#3A1520" }}
                >
                  {/* To */}
                  <p>
                    <span className="font-bold" style={{ color: "rgba(58,21,32,0.4)" }}>To:</span>{" "}
                    <span>{contact.email}</span>
                  </p>

                  <div style={{ borderTop: "1px solid rgba(58,21,32,0.08)", margin: "16px 0" }} />

                  {/* From */}
                  <p>
                    <span className="font-bold" style={{ color: "rgba(58,21,32,0.4)" }}>From:</span>{" "}
                    <span
                      className={`inline cursor-text outline-none ${activeField === "from" ? "typewriter-field-cursor" : ""}`}
                      onClick={() => changeField("from")}
                      role="button"
                      tabIndex={0}
                    >
                      {fromEmail || (activeField !== "from" && (
                        <span style={{ color: "rgba(58,21,32,0.2)", fontStyle: "italic" }}>your email</span>
                      ))}
                    </span>
                  </p>

                  {/* Message */}
                  <div>
                    <p className="font-bold mb-1" style={{ color: "rgba(58,21,32,0.4)" }}>Your message:</p>
                    <div
                      className={`min-h-[60px] whitespace-pre-wrap cursor-text outline-none ${activeField === "message" ? "typewriter-field-cursor" : ""}`}
                      onClick={() => changeField("message")}
                      role="button"
                      tabIndex={0}
                    >
                      {message || (activeField !== "message" && (
                        <span style={{ color: "rgba(58,21,32,0.2)", fontStyle: "italic" }}>type here</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid rgba(58,21,32,0.08)", margin: "16px 0" }} />

                  {/* Best Regards */}
                  <p className="font-bold" style={{ color: "rgba(58,21,32,0.4)" }}>Best Regards,</p>
                  <p>
                    <span
                      className={`inline cursor-text outline-none ${activeField === "name" ? "typewriter-field-cursor" : ""}`}
                      onClick={() => changeField("name")}
                      role="button"
                      tabIndex={0}
                    >
                      {fullName || (activeField !== "name" && (
                        <span style={{ color: "rgba(58,21,32,0.2)", fontStyle: "italic" }}>your full name</span>
                      ))}
                    </span>
                  </p>
                </div>
              </div>

              {/* Torn/rough bottom edge of paper */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: 6,
                  background: "linear-gradient(90deg, rgba(180,150,100,0.3), rgba(200,170,120,0.1), rgba(160,130,80,0.3), rgba(190,160,110,0.1), rgba(170,140,90,0.25))",
                  maskImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 3 Q10 0 20 4 Q30 1 40 3 Q50 5 60 2 Q70 0 80 4 Q90 1 100 3 Q110 5 120 2 Q130 0 140 4 Q150 1 160 3 Q170 5 180 2 Q190 0 200 3 L200 6 L0 6Z' fill='black'/%3E%3C/svg%3E\")",
                  WebkitMaskImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 3 Q10 0 20 4 Q30 1 40 3 Q50 5 60 2 Q70 0 80 4 Q90 1 100 3 Q110 5 120 2 Q130 0 140 4 Q150 1 160 3 Q170 5 180 2 Q190 0 200 3 L200 6 L0 6Z' fill='black'/%3E%3C/svg%3E\")",
                  maskSize: "200px 6px",
                  WebkitMaskSize: "200px 6px",
                  maskRepeat: "repeat-x",
                  WebkitMaskRepeat: "repeat-x",
                }}
              />

              {/* Success overlay */}
              {formState === "success" && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center" style={{ background: "rgba(220,195,130,0.95)" }}>
                  <span className="text-5xl mb-4" aria-hidden="true">✌️</span>
                  <p className="text-2xl text-wine mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    Message sent!
                  </p>
                  <p className="text-sm text-wine/70 mb-5" style={{ fontFamily: "var(--font-body)" }}>
                    Thanks for reaching out. I will get back to you soon.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-5 py-2 bg-wine text-cream rounded-xl border-2 border-wine text-sm transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Type another letter
                  </button>
                </div>
              )}

              {formState === "sending" && (
                <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ background: "rgba(220,195,130,0.9)" }}>
                  <p className="text-xl text-wine animate-pulse" style={{ fontFamily: "var(--font-display)" }}>
                    Sending...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── TYPEWRITER BODY ───────────────────────── */}
          <div
            className="relative -mt-4 z-20 px-3 sm:px-6 md:px-8 pt-5 pb-6"
            style={{
              /* Matte blue-grey shell */
              backgroundColor: "#3B444F",
              backgroundImage: `
                url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
                linear-gradient(180deg, rgba(82,94,106,0.95) 0%, rgba(62,71,82,0.95) 25%, rgba(42,49,58,0.98) 75%, rgba(24,28,33,1) 100%)
              `,
              backgroundBlendMode: "overlay, normal",
              borderRadius: "18px 18px 24px 24px",
              boxShadow:
                "0 32px 64px rgba(0,0,0,0.95), 0 14px 24px rgba(0,0,0,0.85), inset 0 2px 2px rgba(255,255,255,0.3), inset -14px 0 28px rgba(0,0,0,0.45), inset 14px 0 28px rgba(0,0,0,0.45), inset 0 -8px 16px rgba(0,0,0,0.7)",
              border: "1px solid #1a1e23",
              borderTop: "2px solid #6b7786",
            }}
          >
            {/* The deep typebar cavity (cutout in the middle) */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 overflow-hidden"
              style={{
                width: "48%",
                height: 56,
                background: "linear-gradient(180deg, #020202 0%, #0d0f12 70%, #15181c 100%)",
                borderBottomLeftRadius: "50% 100%",
                borderBottomRightRadius: "50% 100%",
                boxShadow: "inset 0 18px 28px rgba(0,0,0,1), 0 2px 0 rgba(255,255,255,0.1), inset 0 -6px 8px rgba(0,0,0,0.9)",
                zIndex: 1,
                border: "1px solid #0d0f11",
                borderTop: "7px solid #232a32", // heavy thickness of metal shell
              }}
            >
              {/* Typebars (the metal arms converging in the cavity) */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full opacity-70"
                style={{
                  background: "repeating-linear-gradient(110deg, transparent, transparent 3px, #6e7680 3px, #363b42 5px, #181b1e 6px)",
                  maskImage: "radial-gradient(ellipse at bottom, black 30%, transparent 85%)",
                  WebkitMaskImage: "radial-gradient(ellipse at bottom, black 30%, transparent 85%)",
                }}
              />

              {/* Type guide bracket (ribbon vibrator) where slugs strike paper */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-5 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, #d8dee4 0%, #808892 50%, #3a3f45 100%)",
                  clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 70% 100%, 50% 40%, 30% 100%, 0% 100%)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.8)",
                }}
              />
              {/* Two-tone typewriter ribbon strip */}
              <div
                aria-hidden="true"
                className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-[3px] pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, #111 50%, #901c1c 50%)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.7)",
                }}
              />
            </div>

            {/* Metal trim highlight at top edge of body */}
            <div
              className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
              style={{
                background: "linear-gradient(90deg, transparent 0%, #6e7986 20%, #b8c2cc 50%, #6e7986 80%, transparent 100%)",
              }}
            />

            {/* ── LEFT: Flat Metal Faceplate with Brand & Engraved Plaque ── */}
            <div className="absolute left-4 sm:left-6 top-5 z-10 flex flex-col gap-1.5 max-w-[170px] sm:max-w-[210px]">
              <span
                className="text-[10px] md:text-xs tracking-[0.2em] font-serif font-bold italic"
                style={{
                  color: "#C2C8CF",
                  textShadow: "0 -1px 1px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.2)",
                  display: "flex",
                  gap: "6px",
                  lineHeight: "1.1",
                }}
              >
                <span>CENTURY</span>
                <span>WRITERS</span>
              </span>

              {/* Flat Vintage Metal Nameplate / Specification Plaque */}
              {contact.phone && contact.phone.length > 0 && (
                <div 
                  className="relative rounded-md px-2.5 sm:px-3 py-1.5"
                  style={{
                    background: "linear-gradient(180deg, #2b333a 0%, #1e2328 100%)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    borderTop: "1px solid rgba(255,255,255,0.26)",
                    borderBottom: "1px solid rgba(0,0,0,0.7)",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.12)",
                  }}
                >
                  {/* Corner brass rivets */}
                  <span className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-[#5d6772] shadow-[0_0.5px_0_rgba(255,255,255,0.3)]" />
                  <span className="absolute top-1 right-1.5 w-1 h-1 rounded-full bg-[#5d6772] shadow-[0_0.5px_0_rgba(255,255,255,0.3)]" />
                  <span className="absolute bottom-1 left-1.5 w-1 h-1 rounded-full bg-[#5d6772] shadow-[0_0.5px_0_rgba(255,255,255,0.3)]" />
                  <span className="absolute bottom-1 right-1.5 w-1 h-1 rounded-full bg-[#5d6772] shadow-[0_0.5px_0_rgba(255,255,255,0.3)]" />

                  {/* Engraved Phone Numbers */}
                  <div className="flex flex-col gap-1 px-1">
                    {contact.phone.map((p) => (
                      <div key={p.label} className="flex items-center justify-between gap-2">
                        <span
                          className="opacity-60 uppercase text-[8px] sm:text-[9px] tracking-wider font-sans font-bold text-[#9aa4ae]"
                          style={{ textShadow: "0 -1px 1px rgba(0,0,0,0.8)" }}
                        >
                          {p.label}:
                        </span>
                        <span
                          className="font-bold tracking-wider text-[10px] sm:text-xs"
                          style={{
                            fontFamily: "var(--font-mono)",
                            color: "#E2E7EC",
                            textShadow: "0 -1px 1px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.16)",
                          }}
                        >
                          {p.number}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: 3D Vintage Rocker / Push-Button Assembly ── */}
            <div className="absolute right-4 sm:right-6 top-5 z-10 flex items-center">
              {/* Outer socket bezel ring stamped into metal */}
              <div
                className="rounded-full p-[3px]"
                style={{
                  background: "linear-gradient(180deg, #13161a 0%, #1e242b 100%)",
                  border: "1px solid #0f1215",
                  borderBottom: "1px solid rgba(255,255,255,0.14)",
                  boxShadow: "inset 0 3px 6px rgba(0,0,0,0.9), inset 0 1px 2px rgba(0,0,0,0.95), 0 1px 1px rgba(255,255,255,0.2)",
                }}
              >
                {/* 3D Button Cap */}
                <button
                  type="button"
                  onClick={toggleSound}
                  className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 rounded-full transition-all outline-none focus-visible:ring-2 focus-visible:ring-mustard group cursor-pointer active:translate-y-[2px]"
                  style={{
                    background: isMuted
                      ? "radial-gradient(ellipse at 50% 50%, #252b31 0%, #171b1f 100%)"
                      : "radial-gradient(ellipse at 50% 28%, #566473 0%, #38414b 60%, #242a31 100%)",
                    border: "1px solid #3c454f",
                    borderTop: "1.5px solid rgba(255,255,255,0.7)",
                    borderBottom: isMuted ? "2px solid #14171a" : "5px solid #1a2027",
                    boxShadow: isMuted
                      ? "inset 0 3px 5px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.5)"
                      : "0 6px 12px -2px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.6), inset 0 1.5px 2px rgba(255,255,255,0.6), inset 0 -1.5px 2px rgba(0,0,0,0.4)",
                    transform: isMuted ? "translateY(2px)" : "translateY(0)",
                  }}
                  aria-label={isMuted ? "Unmute typewriter sound" : "Mute typewriter sound"}
                  title={isMuted ? "Typewriter Sound: OFF (Click to unmute)" : "Typewriter Sound: ON (Click to mute)"}
                >
                  {/* 3D Jewel Indicator Lamp */}
                  <span
                    aria-hidden="true"
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background: isMuted ? "#454d56" : "#10b981",
                      boxShadow: isMuted
                        ? "inset 0 1px 1px rgba(0,0,0,0.6)"
                        : "0 0 8px #10b981, inset 0 1px 1px rgba(255,255,255,0.8)",
                      border: isMuted ? "1px solid #282d33" : "1px solid #34d399",
                    }}
                  />

                  {/* Speaker Icon with 3D Pop */}
                  <span className="text-xs transition-transform group-hover:scale-110 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                    {isMuted ? "🔇" : "🔊"}
                  </span>

                  {/* 3D Engraved Typography */}
                  <span
                    className="text-[10px] uppercase tracking-wider font-bold"
                    style={{
                      color: isMuted ? "#7A828A" : "#F5F0E8",
                      fontFamily: "var(--font-mono)",
                      textShadow: isMuted
                        ? "none"
                        : "0 -1px 1px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.25)",
                    }}
                  >
                    {isMuted ? "Sound: Off" : "Sound: On"}
                  </span>
                </button>
              </div>
            </div>

            {/* ── SUNKEN KEYBOARD TRAY (Recessed 3D Well) ── */}
            <div
              className="relative mx-auto mt-24 sm:mt-26 rounded-2xl p-2.5 sm:p-4 md:p-6"
              style={{
                /* Stamped dark metal tray floor */
                background: "linear-gradient(180deg, #181d22 0%, #232931 35%, #181c20 100%)",
                boxShadow:
                  "inset 0 12px 22px rgba(0,0,0,0.95), inset 0 3px 6px rgba(0,0,0,0.9), inset -4px 0 8px rgba(0,0,0,0.7), inset 4px 0 8px rgba(0,0,0,0.7), inset 0 -3px 6px rgba(255,255,255,0.06), 0 1px 1px rgba(255,255,255,0.14), 0 2px 5px rgba(0,0,0,0.45)",
                border: "1px solid #14171a",
                borderBottom: "1px solid rgba(255,255,255,0.09)",
                width: "98%",
              }}
            >
              {/* Slotted mechanical guide comb lines on tray floor */}
              <div
                aria-hidden="true"
                className="absolute inset-2 rounded-xl pointer-events-none opacity-15"
                style={{
                  backgroundImage: "repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 18px)",
                }}
              />

              {/* ── KEYBOARD ROWS ───────────────────────── */}
              <div className="flex flex-col items-center gap-[6px] md:gap-[9px] relative z-10">
                {KEYBOARD_ROWS.map((row, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="flex gap-[4px] sm:gap-[6px] md:gap-[9px] justify-center"
                    style={{
                      /* Stagger rows like a real typewriter */
                      paddingLeft: rowIdx === 1 ? 12 : rowIdx === 2 ? 26 : rowIdx === 3 ? 46 : 0,
                    }}
                  >
                    {row.map((key) => {
                      const isPressed = pressedKey === key;
                      return (
                        <button
                          key={key}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleKeyClick(key)}
                          className="typewriter-key group relative"
                          aria-label={key}
                          style={{ outline: "none" }}
                        >
                          {/* Key stem (metal arm anchoring into the well) */}
                          <div
                            className="absolute left-1/2 -translate-x-1/2 rounded-[1px]"
                            style={{
                              bottom: -7,
                              width: 6,
                              height: 14,
                              background: "linear-gradient(180deg, #6c737c 0%, #34383e 50%, #111315 100%)",
                              boxShadow: "inset -1px 0 2px rgba(0,0,0,0.6)",
                              zIndex: 0,
                            }}
                          />
                          {/* Key cap — iconic vintage chrome bezel & dished face */}
                          <div
                            className="relative z-10 flex items-center justify-center transition-all duration-75"
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "7px",
                              /* Vintage ivory concave dish */
                              background: isPressed
                                ? "radial-gradient(circle at 50% 60%, #b8b3a7 0%, #999387 100%)"
                                : "radial-gradient(circle at 50% 32%, #ffffff 0%, #f6f2e9 45%, #ddd6c8 100%)",
                              /* Raised chrome outer ring + deep drop shadow */
                              boxShadow: isPressed
                                ? "inset 0 3px 6px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.6)"
                                : "0 7px 12px -2px rgba(0,0,0,0.9), 0 3px 4px rgba(0,0,0,0.6), inset 0 1.5px 1.5px rgba(255,255,255,0.95), inset 0 -1.5px 2px rgba(0,0,0,0.35)",
                              transform: isPressed ? "translateY(5px)" : "translateY(0)",
                              fontSize: 12,
                              fontWeight: 700,
                              color: isPressed ? "#5a1a2b" : "#2f3235",
                              fontFamily: "var(--font-body)",
                              cursor: "pointer",
                              border: "1.5px solid #bdc3c7", // Chrome bezel ring
                              borderBottom: isPressed ? "2px solid #777" : "6px solid #8e949a", // 3D metal side extrusion
                              borderTop: "1.5px solid rgba(255,255,255,0.9)",
                              textShadow: isPressed ? "none" : "0 1px 0 rgba(255,255,255,0.7)",
                            }}
                          >
                            {key}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}

                {/* Bottom row: BACK, SPACE BAR, RETURN, SEND */}
                <div className="flex gap-[5px] sm:gap-[7px] md:gap-[10px] items-center justify-center mt-2">
                  {/* BACK key */}
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleKeyClick("BACK")}
                    className="typewriter-key relative"
                    style={{ outline: "none" }}
                  >
                    <div
                      className="relative z-10 flex items-center justify-center transition-all duration-75"
                      style={{
                        width: 56,
                        height: 34,
                        borderRadius: "7px",
                        background: pressedKey === "BACK"
                          ? "radial-gradient(circle at 50% 60%, #b8b3a7 0%, #999387 100%)"
                          : "radial-gradient(circle at 50% 32%, #ffffff 0%, #f6f2e9 45%, #ddd6c8 100%)",
                        boxShadow: pressedKey === "BACK"
                          ? "inset 0 3px 6px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.6)"
                          : "0 7px 12px -2px rgba(0,0,0,0.9), 0 3px 4px rgba(0,0,0,0.6), inset 0 1.5px 1.5px rgba(255,255,255,0.95), inset 0 -1.5px 2px rgba(0,0,0,0.35)",
                        transform: pressedKey === "BACK" ? "translateY(5px)" : "translateY(0)",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#2f3235",
                        fontFamily: "var(--font-body)",
                        cursor: "pointer",
                        border: "1.5px solid #bdc3c7",
                        borderBottom: pressedKey === "BACK" ? "2px solid #777" : "6px solid #8e949a",
                        borderTop: "1.5px solid rgba(255,255,255,0.9)",
                        textShadow: pressedKey === "BACK" ? "none" : "0 1px 0 rgba(255,255,255,0.7)",
                      }}
                    >
                      ← DEL
                    </div>
                  </button>

                  {/* SPACE BAR */}
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleKeyClick("SPC")}
                    className="typewriter-key relative"
                    style={{ outline: "none" }}
                  >
                    {/* Dual metal stems */}
                    <div
                      className="absolute left-[30%] -translate-x-1/2 rounded-[1px]"
                      style={{
                        bottom: -7,
                        width: 8,
                        height: 14,
                        background: "linear-gradient(180deg, #6c737c 0%, #34383e 50%, #111315 100%)",
                        zIndex: 0,
                      }}
                    />
                    <div
                      className="absolute left-[70%] -translate-x-1/2 rounded-[1px]"
                      style={{
                        bottom: -7,
                        width: 8,
                        height: 14,
                        background: "linear-gradient(180deg, #6c737c 0%, #34383e 50%, #111315 100%)",
                        zIndex: 0,
                      }}
                    />
                    <div
                      className="relative z-10 flex items-center justify-center transition-all duration-75"
                      style={{
                        width: 180,
                        height: 32,
                        borderRadius: "8px",
                        background: pressedKey === "SPC"
                          ? "radial-gradient(ellipse at 50% 60%, #b8b3a7 0%, #999387 100%)"
                          : "radial-gradient(ellipse at 50% 32%, #ffffff 0%, #f6f2e9 45%, #ddd6c8 100%)",
                        boxShadow: pressedKey === "SPC"
                          ? "inset 0 3px 6px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.6)"
                          : "0 7px 12px -2px rgba(0,0,0,0.9), 0 3px 4px rgba(0,0,0,0.6), inset 0 1.5px 1.5px rgba(255,255,255,0.95), inset 0 -1.5px 2px rgba(0,0,0,0.35)",
                        transform: pressedKey === "SPC" ? "translateY(5px)" : "translateY(0)",
                        cursor: "pointer",
                        border: "1.5px solid #bdc3c7",
                        borderBottom: pressedKey === "SPC" ? "2px solid #777" : "6px solid #8e949a",
                        borderTop: "1.5px solid rgba(255,255,255,0.9)",
                      }}
                    />
                  </button>

                  {/* RETURN key */}
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleKeyClick("RET")}
                    className="typewriter-key relative"
                    style={{ outline: "none" }}
                  >
                    <div
                      className="relative z-10 flex items-center justify-center transition-all duration-75"
                      style={{
                        width: 56,
                        height: 34,
                        borderRadius: "7px",
                        background: pressedKey === "RET"
                          ? "radial-gradient(circle at 50% 60%, #b8b3a7 0%, #999387 100%)"
                          : "radial-gradient(circle at 50% 32%, #ffffff 0%, #f6f2e9 45%, #ddd6c8 100%)",
                        boxShadow: pressedKey === "RET"
                          ? "inset 0 3px 6px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.6)"
                          : "0 7px 12px -2px rgba(0,0,0,0.9), 0 3px 4px rgba(0,0,0,0.6), inset 0 1.5px 1.5px rgba(255,255,255,0.95), inset 0 -1.5px 2px rgba(0,0,0,0.35)",
                        transform: pressedKey === "RET" ? "translateY(5px)" : "translateY(0)",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#2f3235",
                        fontFamily: "var(--font-body)",
                        cursor: "pointer",
                        border: "1.5px solid #bdc3c7",
                        borderBottom: pressedKey === "RET" ? "2px solid #777" : "6px solid #8e949a",
                        borderTop: "1.5px solid rgba(255,255,255,0.9)",
                        textShadow: pressedKey === "RET" ? "none" : "0 1px 0 rgba(255,255,255,0.7)",
                      }}
                    >
                      RET ↵
                    </div>
                  </button>

                  {/* SEND key (Vintage Bakelite Emerald Finish) */}
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleKeyClick("SEND")}
                    className="typewriter-key relative"
                    style={{ outline: "none" }}
                  >
                    <div
                      className="relative z-10 flex items-center justify-center transition-all duration-75"
                      style={{
                        width: 66,
                        height: 34,
                        borderRadius: "7px",
                        background: pressedKey === "SEND"
                          ? "radial-gradient(circle at 50% 60%, #155d48 0%, #0d3b2e 100%)"
                          : "radial-gradient(circle at 50% 30%, #32b591 0%, #1f8a6c 50%, #136049 100%)",
                        boxShadow: pressedKey === "SEND"
                          ? "inset 0 3px 6px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.6)"
                          : "0 7px 14px -2px rgba(0,0,0,0.9), 0 3px 4px rgba(0,0,0,0.6), inset 0 1.5px 2px rgba(255,255,255,0.6), inset 0 -1.5px 2px rgba(0,0,0,0.5)",
                        transform: pressedKey === "SEND" ? "translateY(5px)" : "translateY(0)",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#FFF",
                        fontFamily: "var(--font-body)",
                        cursor: "pointer",
                        border: "1.5px solid #62ccad",
                        borderBottom: pressedKey === "SEND" ? "2px solid #0e3d2f" : "6px solid #114e3b",
                        borderTop: "1.5px solid rgba(255,255,255,0.6)",
                        textShadow: "0 -1px 1px rgba(0,0,0,0.6)",
                      }}
                    >
                      ✉ SEND
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Status line */}
            <p
              className="text-center text-cream/40 text-[9px] md:text-[10px] mt-4"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Typing: <span className="text-mustard font-bold">{activeField === "from" ? "From" : activeField === "message" ? "Message" : "Name"}</span>
              {" "}&#183; TAB/RETURN = next field &#183; Shift+Enter = new line &#183; {isMuted ? "🔇 Muted" : "🔊 Audio ON"}
            </p>

            {/* ── MOLDED FRONT BUMPER / APRON (Cast metal 3D thickness) ── */}
            <div
              className="mt-4 -mx-5 h-5 rounded-b-[22px] relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #283038 0%, #191e23 50%, #0d0f12 100%)",
                borderTop: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 6px 14px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.22)",
              }}
            >
              {/* Subtle brushed chrome highlight bead on front lip */}
              <div
                className="absolute top-1 left-10 right-10 h-[1px]"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.25) 70%, transparent 100%)",
                }}
              />
            </div>

            {/* ── RUBBER CHASSIS FEET (Grounding corner pads) ── */}
            <div
              className="absolute -bottom-2.5 left-8 w-14 h-4 rounded-b-xl z-10"
              style={{
                background: "linear-gradient(180deg, #3d434a 0%, #181a1d 50%, #060708 100%)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.25)",
                borderTop: "2px solid #5a626c", // Chrome washer
              }}
            />
            <div
              className="absolute -bottom-2.5 right-8 w-14 h-4 rounded-b-xl z-10"
              style={{
                background: "linear-gradient(180deg, #3d434a 0%, #181a1d 50%, #060708 100%)",
                boxShadow: "0 6px 12px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.25)",
                borderTop: "2px solid #5a626c", // Chrome washer
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Footer credits ───────────────────────────── */}
      </div>
      <footer className="mt-16 md:mt-20 pt-6 border-t border-cream/10 pb-6 md:pb-8 text-center w-full max-w-6xl mx-auto px-6 md:px-8">
        <p
          className="text-cream/40 text-xs text-center"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Built with Next.js, Tailwind CSS, and a whole lot of groove.
        </p>
      </footer>
    </section>
  );
}
