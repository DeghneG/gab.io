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

  const [formState, setFormState] = useState<FormState>("idle");
  const [activeField, setActiveField] = useState<ActiveField>("from");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [pressedKey, setPressedKey] = useState<string | null>(null);

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
          // Auto-carriage return for multiline
          const next = prev + "\n" + char;
          syncCarriage(next);
          return next;
        } else {
          // Margin lock (can't type past margin on single line)
          // Play a "ding!" visually? We just bounce the carriage slightly
          if (carriageRef.current) {
             gsap.fromTo(carriageRef.current, 
               { x: (MAX_CHARS_PER_LINE * -8) - 4 }, 
               { x: MAX_CHARS_PER_LINE * -8, duration: 0.1, ease: "bounce.out" }
             );
          }
          return prev;
        }
      }

      const next = prev + char;
      syncCarriage(next);
      return next;
    });
  }, [activeField, formState, syncCarriage]);

  const handleBackspace = useCallback(() => {
    if (formState !== "idle") return;
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
    
    if (activeField === "from") {
      setActiveField("message");
      syncCarriage(message);
    } else if (activeField === "message") {
      setActiveField("name");
      syncCarriage(fullName);
    }
  }, [activeField, formState, message, fullName, syncCarriage]);

  const handleNewline = useCallback(() => {
    if (formState !== "idle" || activeField !== "message") return;
    setMessage((prev) => {
      const next = prev + "\n";
      syncCarriage(next);
      return next;
    });
  }, [formState, activeField, syncCarriage]);

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
      className="relative py-20 md:py-32 bg-wine overflow-hidden"
    >
      <div className="mx-auto max-w-6xl w-full px-6 md:px-8">
        <h2 className="text-3xl md:text-5xl text-cream mb-4">Get in touch</h2>
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
        className="max-w-3xl mx-auto"
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(12deg)",
          }}
        >
          {/* ── CARRIAGE ASSEMBLY — the whole thing moves ── */}
          <div
            ref={carriageRef}
            className="relative z-10"
            style={{ willChange: "transform" }}
          >
            {/* Paper roller bar */}
            <div
              className="relative mx-auto rounded-full"
              style={{
                width: "92%",
                height: 28,
                background: "linear-gradient(180deg, #1a1a1a 0%, #333 20%, #555 50%, #333 80%, #1a1a1a 100%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)",
                zIndex: 5,
              }}
            >
              {/* Carriage Return Lever (Left Side) */}
              <div
                className="absolute z-10"
                style={{
                  top: -6,
                  left: -40,
                  width: 50,
                  height: 12,
                  background: "linear-gradient(180deg, #111, #333)",
                  borderRadius: "6px 0 0 6px",
                  transformOrigin: "right center",
                  transform: "rotate(-15deg)",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.6)",
                }}
              >
                {/* Finger paddle on lever */}
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
                  style={{
                    width: 20,
                    height: 28,
                    background: "linear-gradient(135deg, #444, #111)",
                    borderRadius: "40% 10% 10% 40%",
                    boxShadow: "inset 2px 0 4px rgba(255,255,255,0.1), 4px 4px 10px rgba(0,0,0,0.8)",
                  }}
                />
              </div>

              {/* Roller knobs */}
              <div
                className="absolute -left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #777, #333)",
                  boxShadow: "2px 2px 6px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.15)",
                  border: "2px solid #555",
                }}
              >
                {/* Knob grip lines */}
                <div className="absolute inset-1.5 rounded-full border border-white/10" />
              </div>
              <div
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #777, #333)",
                  boxShadow: "2px 2px 6px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.15)",
                  border: "2px solid #555",
                }}
              >
                <div className="absolute inset-1.5 rounded-full border border-white/10" />
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
                  {/* GitHub */}
                  <p>
                    <span className="font-bold" style={{ color: "rgba(58,21,32,0.4)" }}>GitHub:</span>{" "}
                    <a
                      href={contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                      style={{ color: "#1a6e5a", textDecorationColor: "rgba(26,110,90,0.4)" }}
                    >
                      {contact.github}
                    </a>
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
            className="relative -mt-4 z-20 overflow-hidden"
            style={{
              /* Matte blue-grey shell */
              backgroundColor: "#3B444F",
              backgroundImage: `
                url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
                linear-gradient(180deg, rgba(74,85,96,0.9) 0%, rgba(59,68,79,0.9) 30%, rgba(30,35,40,0.95) 100%)
              `,
              backgroundBlendMode: "overlay, normal",
              borderRadius: "16px 16px 24px 24px",
              padding: "45px 24px 40px",
              boxShadow:
                "0 25px 50px rgba(0,0,0,0.9), 0 10px 15px rgba(0,0,0,0.8), inset 0 2px 2px rgba(255,255,255,0.15), inset -12px 0 24px rgba(0,0,0,0.4), inset 12px 0 24px rgba(0,0,0,0.4), inset 0 -12px 24px rgba(0,0,0,0.5)",
              border: "1px solid #1E2328",
              borderTop: "1px solid #5C6775",
              borderBottom: "4px solid #15181c",
            }}
          >
            {/* The deep typebar cavity (cutout in the middle) */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0"
              style={{
                width: "55%",
                height: 55,
                background: "linear-gradient(180deg, #050505, #111)",
                borderBottomLeftRadius: "50% 100%",
                borderBottomRightRadius: "50% 100%",
                boxShadow: "inset 0 15px 25px rgba(0,0,0,1), 0 2px 0 rgba(255,255,255,0.06), inset 0 -4px 6px rgba(0,0,0,0.8)",
                zIndex: 1,
                border: "1px solid #111",
                borderTop: "6px solid #22282e", // thickness of the metal shell
              }}
            >
              {/* Typebars (the metal arms inside the cavity) */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full opacity-60"
                style={{
                  background: "repeating-linear-gradient(110deg, transparent, transparent 4px, #555 4px, #333 6px)",
                  maskImage: "radial-gradient(ellipse at bottom, black 20%, transparent 80%)",
                  WebkitMaskImage: "radial-gradient(ellipse at bottom, black 20%, transparent 80%)",
                }}
              />
            </div>
            {/* Metal trim at top edge of body */}
            <div
              className="absolute top-0 left-6 right-6 h-1 rounded-full"
              style={{
                background: "linear-gradient(90deg, #555, #888, #aaa, #888, #555)",
              }}
            />

            {/* Brand label & Phone Numbers */}
            <div className="absolute left-6 top-10 md:top-10 z-10 flex flex-col gap-3">
              <span
                className="text-[10px] md:text-xs tracking-[0.2em] font-serif"
                style={{
                  color: "#B0B5BA",
                  textShadow: "0 -1px 1px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  lineHeight: "1.1",
                  fontStyle: "italic",
                }}
              >
                <span>CENTURY</span>
                <span className="ml-2">WRITERS</span>
              </span>

              {/* Engraved Phone Numbers */}
              {contact.phone && contact.phone.length > 0 && (
                <div 
                  className="flex flex-col gap-1.5 mt-2"
                  style={{
                    color: "#AAB0B6",
                    textShadow: "0 -1px 1px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.1)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  {contact.phone.map((p) => (
                    <div key={p.label} className="flex items-center gap-2">
                      <span className="opacity-60 uppercase text-[0.65rem] tracking-wider font-sans">{p.label}:</span>
                      <span className="font-bold">{p.number}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Field selector (Removed to maintain vintage aesthetic, user uses TAB or clicks paper) */}

            {/* ── KEYBOARD ────────────────────────────── */}
            <div className="flex flex-col items-center gap-[6px] md:gap-[10px] mt-6">
              {KEYBOARD_ROWS.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className="flex gap-[5px] md:gap-[9px] justify-center"
                  style={{
                    /* Stagger rows like a real typewriter */
                    paddingLeft: rowIdx === 1 ? 12 : rowIdx === 2 ? 28 : rowIdx === 3 ? 48 : 0,
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
                        {/* Key stem (the arm connecting key to mechanism) */}
                        <div
                          className="absolute left-1/2 -translate-x-1/2 rounded-sm"
                          style={{
                            bottom: -6,
                            width: 6,
                            height: 12,
                            background: "linear-gradient(180deg, #555, #222)",
                            boxShadow: "inset -1px 0 2px rgba(0,0,0,0.5)",
                            zIndex: 0,
                          }}
                        />
                        {/* Key cap — tall rounded square */}
                        <div
                          className="relative z-10 flex items-center justify-center transition-all duration-75"
                          style={{
                            width: 34,
                            height: 34, // tall profile
                            borderRadius: "6px",
                            background: isPressed
                              ? "linear-gradient(180deg, #d4cfc5 0%, #a8a49c 100%)"
                              : "linear-gradient(180deg, #f2efe9 0%, #dcd8cf 100%)",
                            boxShadow: isPressed
                              ? "inset 0 3px 6px rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.5)" // depressed
                              : "0 6px 8px -2px rgba(0,0,0,0.8), 0 3px 3px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.8)", // tall shadow
                            transform: isPressed ? "translateY(5px)" : "translateY(0)",
                            fontSize: 12,
                            fontWeight: 700,
                            color: isPressed ? "#5a1a2b" : "#3A3D40",
                            fontFamily: "var(--font-body)",
                            cursor: "pointer",
                            border: "1px solid rgba(0,0,0,0.15)",
                            borderBottom: isPressed ? "1px solid #888" : "5px solid #a8a49c", // Physical 3D thickness
                            borderTop: "1px solid rgba(255,255,255,0.7)",
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
              <div className="flex gap-[6px] md:gap-[9px] items-center justify-center mt-2">
                {/* BACK key */}
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleKeyClick("BACK")}
                  className="typewriter-key relative"
                  style={{ outline: "none" }}
                >
                  <div
                    className="relative z-10 flex items-center justify-center transition-all duration-75 rounded-full"
                    style={{
                      width: 56,
                      height: 34,
                      borderRadius: "6px",
                      background: pressedKey === "BACK"
                        ? "linear-gradient(180deg, #d4cfc5 0%, #a8a49c 100%)"
                        : "linear-gradient(180deg, #f2efe9 0%, #dcd8cf 100%)",
                      boxShadow: pressedKey === "BACK"
                        ? "inset 0 3px 6px rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.5)"
                        : "0 6px 8px -2px rgba(0,0,0,0.8), 0 3px 3px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.8)",
                      transform: pressedKey === "BACK" ? "translateY(5px)" : "translateY(0)",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#3A3D40",
                      fontFamily: "var(--font-body)",
                      cursor: "pointer",
                      border: "1px solid rgba(0,0,0,0.15)",
                      borderBottom: pressedKey === "BACK" ? "1px solid #888" : "5px solid #a8a49c",
                      borderTop: "1px solid rgba(255,255,255,0.7)",
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
                  <div
                    className="absolute left-1/2 -translate-x-1/2 rounded-sm"
                    style={{
                      bottom: -6,
                      width: "70%",
                      height: 12,
                      background: "linear-gradient(180deg, #555, #222)",
                      boxShadow: "inset -1px 0 2px rgba(0,0,0,0.5)",
                      zIndex: 0,
                    }}
                  />
                  <div
                    className="relative z-10 flex items-center justify-center transition-all duration-75"
                    style={{
                      width: 180,
                      height: 30,
                      borderRadius: "8px",
                      background: pressedKey === "SPC"
                        ? "linear-gradient(180deg, #d4cfc5 0%, #a8a49c 100%)"
                        : "linear-gradient(180deg, #f2efe9 0%, #dcd8cf 100%)",
                      boxShadow: pressedKey === "SPC"
                        ? "inset 0 3px 6px rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.5)"
                        : "0 6px 8px -2px rgba(0,0,0,0.8), 0 3px 3px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.8)",
                      transform: pressedKey === "SPC" ? "translateY(5px)" : "translateY(0)",
                      cursor: "pointer",
                      border: "1px solid rgba(0,0,0,0.15)",
                      borderBottom: pressedKey === "SPC" ? "1px solid #888" : "5px solid #a8a49c",
                      borderTop: "1px solid rgba(255,255,255,0.7)",
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
                    className="relative z-10 flex items-center justify-center transition-all duration-75 rounded-full"
                    style={{
                      width: 56,
                      height: 34,
                      borderRadius: "6px",
                      background: pressedKey === "RET"
                        ? "linear-gradient(180deg, #d4cfc5 0%, #a8a49c 100%)"
                        : "linear-gradient(180deg, #f2efe9 0%, #dcd8cf 100%)",
                      boxShadow: pressedKey === "RET"
                        ? "inset 0 3px 6px rgba(0,0,0,0.4), 0 1px 1px rgba(0,0,0,0.5)"
                        : "0 6px 8px -2px rgba(0,0,0,0.8), 0 3px 3px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.8)",
                      transform: pressedKey === "RET" ? "translateY(5px)" : "translateY(0)",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#3A3D40",
                      fontFamily: "var(--font-body)",
                      cursor: "pointer",
                      border: "1px solid rgba(0,0,0,0.15)",
                      borderBottom: pressedKey === "RET" ? "1px solid #888" : "5px solid #a8a49c",
                      borderTop: "1px solid rgba(255,255,255,0.7)",
                    }}
                  >
                    RET ↵
                  </div>
                </button>

                {/* SEND key */}
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleKeyClick("SEND")}
                  className="typewriter-key relative"
                  style={{ outline: "none" }}
                >
                  <div
                    className="relative z-10 flex items-center justify-center transition-all duration-75 rounded-full"
                    style={{
                      width: 64,
                      height: 34,
                      borderRadius: "6px",
                      background: pressedKey === "SEND"
                        ? "linear-gradient(180deg, #1e7058 0%, #124d3a 100%)"
                        : "linear-gradient(180deg, #2A9679 0%, #1A735A 100%)",
                      boxShadow: pressedKey === "SEND"
                        ? "inset 0 3px 6px rgba(0,0,0,0.6), 0 1px 1px rgba(0,0,0,0.5)"
                        : "0 6px 8px -2px rgba(0,0,0,0.8), 0 3px 3px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.4)",
                      transform: pressedKey === "SEND" ? "translateY(5px)" : "translateY(0)",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#FFF",
                      fontFamily: "var(--font-body)",
                      cursor: "pointer",
                      border: "1px solid rgba(0,0,0,0.2)",
                      borderBottom: pressedKey === "SEND" ? "1px solid #0f4030" : "5px solid #124d3a",
                      borderTop: "1px solid rgba(255,255,255,0.4)",
                    }}
                  >
                    ✉ SEND
                  </div>
                </button>
              </div>
            </div>

            {/* Status line */}
            <p
              className="text-center text-cream/30 text-[9px] md:text-[10px] mt-4"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Typing: <span className="text-mustard/70 font-bold">{activeField === "from" ? "From" : activeField === "message" ? "Message" : "Name"}</span>
              {" "}&#183; TAB/RETURN = next field &#183; Shift+Enter = new line
            </p>

            {/* Feet / rubber pads at the bottom */}
            <div className="absolute -bottom-2 left-8 w-12 h-3 rounded-b-lg bg-[#111]" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.4)" }} />
            <div className="absolute -bottom-2 right-8 w-12 h-3 rounded-b-lg bg-[#111]" style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.4)" }} />
          </div>
        </div>
      </div>

      {/* ── Footer credits ───────────────────────────── */}
      </div>
      <footer className="mt-20 pt-8 border-t border-cream/10 pb-8 md:pb-12 text-center w-full max-w-6xl mx-auto px-6 md:px-8">
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
