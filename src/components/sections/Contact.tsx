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
type ActiveField = "from" | "topic" | "message" | "name";

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

  /** Paper rustle / folding friction sound */
  playPaperRustle() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 0.22);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(2200, t);
      filter.frequency.exponentialRampToValueAtTime(750, t + 0.22);
      filter.Q.setValueAtTime(1.8, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(t);
    } catch {}
  }

  /** Mailbox brass flap spring-snap & latch sound */
  playMailboxSnap() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      // 1. Crisp metallic transient
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1100, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.06);

      oscGain.gain.setValueAtTime(0.22, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.07);

      // 2. Heavy metal box latch thud
      const thud = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thud.type = "sine";
      thud.frequency.setValueAtTime(190, t + 0.01);
      thud.frequency.exponentialRampToValueAtTime(45, t + 0.12);

      thudGain.gain.setValueAtTime(0.28, t + 0.01);
      thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      thud.connect(thudGain);
      thudGain.connect(ctx.destination);
      thud.start(t + 0.01);
      thud.stop(t + 0.13);
    } catch {}
  }

  /** Vintage rubber ink stamp impact thud */
  playStampThud() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const t = ctx.currentTime;
      // 1. Solid rubber / wooden handle thud
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(32, t + 0.08);

      oscGain.gain.setValueAtTime(0.35, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.09);

      // 2. Paper slap transient
      const noiseSize = Math.floor(ctx.sampleRate * 0.015);
      const buffer = ctx.createBuffer(1, noiseSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < noiseSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, t);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(t);
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
  const paperRef = useRef<HTMLDivElement>(null);
  const flyingLetterRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const postalSlotRef = useRef<HTMLDivElement>(null);
  const postalFlapRef = useRef<HTMLDivElement>(null);
  const slotApertureRef = useRef<HTMLDivElement>(null);
  const soundRef = useRef<TypewriterSound | null>(null);

  const [formState, setFormState] = useState<FormState>("idle");
  const [activeField, setActiveField] = useState<ActiveField>("from");
  const [isStamped, setIsStamped] = useState(false);
  const [fromEmail, setFromEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [lettersMailedCount, setLettersMailedCount] = useState(0);

  const getSound = useCallback(() => {
    if (!soundRef.current || typeof soundRef.current.playStampThud !== "function") {
      let initialMuted = isMuted;
      try {
        initialMuted = localStorage.getItem("typewriter_muted") === "true";
      } catch {}
      soundRef.current = new TypewriterSound(initialMuted);
    }
    soundRef.current.isMuted = isMuted;
    return soundRef.current;
  }, [isMuted]);

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

  // Ensure paper is never accidentally left invisible when idle
  useEffect(() => {
    if (formState === "idle" && paperRef.current) {
      paperRef.current.style.opacity = "1";
    }
  }, [formState]);

  const toggleSound = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      const sound = getSound();
      if (sound) {
        sound.isMuted = next;
        if (!next) {
          sound.playKeyClack?.();
        }
      }
      try {
        localStorage.setItem("typewriter_muted", String(next));
      } catch {}
      return next;
    });
  }, [getSound]);

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
    if (field === "topic") return topic;
    if (field === "message") return message;
    return fullName;
  }, [fromEmail, topic, message, fullName]);

  /* ── Typing logic ───────────────────────────────── */
  const handleType = useCallback((char: string) => {
    if (formState !== "idle") return;
    
    const setter =
      activeField === "from" ? setFromEmail
      : activeField === "topic" ? setTopic
      : activeField === "message" ? setMessage
      : setFullName;

    setter((prev) => {
      const lines = prev.split("\n");
      const currentLineLen = lines[lines.length - 1].length;

      // Typewriter margin physics
      if (currentLineLen >= MAX_CHARS_PER_LINE) {
        if (activeField === "message") {
          // Auto-carriage return for multiline with chime
          getSound()?.playBellDing?.();
          getSound()?.playCarriageSlide?.();
          const next = prev + "\n" + char;
          syncCarriage(next);
          return next;
        } else {
          // Margin lock (can't type past margin on single line)
          getSound()?.playBellDing?.();
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
        getSound()?.playSpaceThud?.();
      } else {
        getSound()?.playKeyClack?.();
      }

      const next = prev + char;
      syncCarriage(next);
      return next;
    });
  }, [activeField, formState, syncCarriage, getSound]);

  const handleBackspace = useCallback(() => {
    if (formState !== "idle") return;
    getSound()?.playKeyClack?.();
    const setter =
      activeField === "from" ? setFromEmail
      : activeField === "topic" ? setTopic
      : activeField === "message" ? setMessage
      : setFullName;

    setter((prev) => {
      if (prev.length === 0) return prev;
      const next = prev.slice(0, -1);
      syncCarriage(next);
      return next;
    });
  }, [activeField, formState, syncCarriage, getSound]);

  const handleReturn = useCallback(() => {
    if (formState !== "idle") return;
    getSound()?.playBellDing?.();
    getSound()?.playCarriageSlide?.();
    resetCarriage();
    
    if (activeField === "from") {
      setActiveField("topic");
      syncCarriage(topic);
    } else if (activeField === "topic") {
      setActiveField("message");
      syncCarriage(message);
    } else if (activeField === "message") {
      setActiveField("name");
      syncCarriage(fullName);
    }
  }, [activeField, formState, topic, message, fullName, syncCarriage, resetCarriage, getSound]);

  const handleNewline = useCallback(() => {
    if (formState !== "idle" || activeField !== "message") return;
    getSound()?.playBellDing?.();
    getSound()?.playCarriageSlide?.();
    resetCarriage();
    setMessage((prev) => {
      const next = prev + "\n";
      syncCarriage(next);
      return next;
    });
  }, [formState, activeField, syncCarriage, resetCarriage, getSound]);

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

  /* ── Submit with GSAP Origami Fold & Mailbox Insertion ── */
  function handleSubmit(e?: FormEvent<HTMLFormElement>) {
    if (e) e.preventDefault();
    if (formState === "sending" || formState === "success") return;

    if (!fromEmail.trim() || !topic.trim() || !message.trim() || !fullName.trim()) {
      if (!fromEmail.trim()) changeField("from");
      else if (!topic.trim()) changeField("topic");
      else if (!message.trim()) changeField("message");
      else if (!fullName.trim()) changeField("name");
      getSound()?.playBellDing?.();
      return;
    }

    const contentEl = contentRef.current;
    const paperEl = paperRef.current;
    const carriageEl = carriageRef.current;
    const flapEl = postalFlapRef.current;
    const slotEl = slotApertureRef.current;
    const flyingEl = flyingLetterRef.current;

    if (!paperEl || !flapEl || !slotEl || !flyingEl || !contentEl) {
      setFormState("success");
      return;
    }

    setFormState("sending");
    getSound()?.playBellDing?.();

    // 1. Stamp "POSTED" down onto the typed letter
    getSound()?.playStampThud?.();
    setIsStamped(true);
    if (stampRef.current) {
      gsap.fromTo(
        stampRef.current,
        { scale: 2.2, opacity: 0, rotate: -25 },
        { scale: 1, opacity: 0.95, rotate: -10, duration: 0.28, ease: "back.out(2)" }
      );
    }

    // 2. Carriage goes back to the middle (authentic carriage return)
    if (carriageEl) {
      gsap.to(carriageEl, {
        x: 0,
        duration: 0.35,
        ease: "power2.out",
        onStart: () => getSound()?.playCarriageSlide?.(),
      });
    }

    // 3. Flight sequence timeline (begins after carriage is centered in the middle)
    const tl = gsap.timeline({
      delay: 0.35, // Wait for carriage to return to center & stamp to be visible
      onStart: () => {
        // Measure coordinates with the carriage now at exact center
        const contentRect = contentEl.getBoundingClientRect();
        const paperRect = paperEl.getBoundingClientRect();

        const startLeft = paperRect.left - contentRect.left;
        const startTop = paperRect.top - contentRect.top;
        const startWidth = paperRect.width;
        const startHeight = paperRect.height;

        // Position flying letter overlay exactly over the centered paper
        gsap.set(flyingEl, {
          display: "block",
          left: startLeft,
          top: startTop,
          width: startWidth,
          height: startHeight,
          clearProps: "transform,opacity",
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
        });
        // Seamlessly hide paper in platen so flyingEl takes over
        gsap.set(paperEl, { opacity: 0 });
      },
      onComplete: () => {
        // Guarantee everything is in a clean idle state
        if (paperRef.current) {
          paperRef.current.style.opacity = "1";
          paperRef.current.style.transform = "none";
        }
        setFormState("idle");
      },
    });

    // 1. Lift paper up and off the platen roller into the air
    tl.to(flyingEl, {
      y: -110,
      duration: 0.42,
      ease: "power2.out",
      onStart: () => getSound()?.playPaperRustle?.(),
    });

    // 2. 3D Origami paper fold (folds horizontal thirds, then vertical sides into envelope)
    tl.to(flyingEl, {
      scaleY: 0.34,
      transformOrigin: "center center",
      rotateX: 25,
      duration: 0.32,
      ease: "power2.inOut",
      onStart: () => getSound()?.playPaperRustle?.(),
    });
    tl.to(
      flyingEl,
      {
        scaleX: 0.42,
        rotateZ: -8,
        boxShadow: "0 28px 50px rgba(0,0,0,0.75)",
        duration: 0.28,
        ease: "power2.inOut",
      },
      "-=0.1"
    );

    // 3. Brass postal flap tilts open on mailbox
    tl.to(
      flapEl,
      {
        rotateX: -70,
        transformOrigin: "top center",
        duration: 0.22,
        ease: "back.out(2)",
      },
      "-=0.15"
    );

    // 4. Folded letter swooshes over and lines up with postal slot (calculated dynamically)
    tl.to(flyingEl, {
      duration: 0.55,
      ease: "power2.inOut",
      onStart: () => {
        const paperRect = paperEl.getBoundingClientRect();
        const slotRect = slotEl.getBoundingClientRect();
        const deltaX = (slotRect.left + slotRect.width / 2) - (paperRect.left + paperRect.width / 2);
        const deltaY = (slotRect.top + slotRect.height / 2) - (paperRect.top + paperRect.height / 2);
        gsap.to(flyingEl, {
          x: deltaX,
          y: deltaY - 8,
          scale: 0.22,
          rotateZ: 10,
          duration: 0.55,
          ease: "power2.inOut",
        });
      },
    });

    // 5. Letter drops straight down into the slot aperture
    tl.to(flyingEl, {
      y: "+=44",
      opacity: 0,
      duration: 0.22,
      ease: "power1.in",
    });

    // 6. Brass postal flap snaps shut with authentic spring bounce & sound
    tl.to(flapEl, {
      rotateX: 0,
      duration: 0.22,
      ease: "bounce.out",
      onStart: () => getSound()?.playMailboxSnap?.(),
    });

    // 7. Hide flying overlay and clear fields for fresh paper
    tl.set(flyingEl, { display: "none" });
    tl.call(() => {
      setFromEmail("");
      setTopic("");
      setMessage("");
      setFullName("");
      setIsStamped(false);
      setActiveField("from");
      setLettersMailedCount((prev) => prev + 1);
    });

    // 8. Fresh crisp paper rolls into the carriage from behind roller
    tl.fromTo(
      paperEl,
      { y: -160, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.55,
        ease: "power2.out",
        onStart: () => getSound()?.playCarriageSlide?.(),
        onComplete: () => {
          gsap.set(paperEl, { clearProps: "transform" });
          if (paperRef.current) {
            paperRef.current.style.opacity = "1";
            paperRef.current.style.transform = "none";
          }
        },
      }
    );
  }

  function handleReset() {
    setFormState("idle");
    setFromEmail("");
    setTopic("");
    setMessage("");
    setFullName("");
    setIsStamped(false);
    changeField("from");

    if (paperRef.current) {
      gsap.set(paperRef.current, { clearProps: "all" });
      gsap.fromTo(
        paperRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          onStart: () => getSound()?.playCarriageSlide?.(),
        }
      );
    }
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

        {/* Dispatch Confirmation Toast (Appears when letter has been mailed) */}
        {lettersMailedCount > 0 && (
          <div
            role="status"
            className="mb-6 max-w-lg mx-auto px-5 py-3 rounded-xl flex items-center justify-between gap-3 text-xs transition-all shadow-lg animate-fadeIn"
            style={{
              background: "linear-gradient(135deg, rgba(43, 175, 144, 0.22) 0%, rgba(30, 138, 108, 0.18) 100%)",
              border: "1.5px solid #2BAF90",
              color: "#FFF",
              fontFamily: "var(--font-body)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.2)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2BAF90] animate-ping" />
              <div>
                <span className="font-bold text-[#A1D4B1] uppercase tracking-wider text-[11px]">Letter Mailed!</span>
                <span className="text-cream/80 ml-2">Your letter was dropped into the postal box. Fresh paper loaded.</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2BAF90]/30 text-[#A1D4B1] font-bold">
              ✓ SENT
            </span>
          </div>
        )}

      {/* ══════════════════════════════════════════════════
          3D TYPEWRITER
         ══════════════════════════════════════════════════ */}
      <div
        ref={contentRef}
        className="w-full max-w-5xl mx-auto relative"
        style={{ perspective: "1400px" }}
      >
        {/* ── FLOATING ANIMATED FOLDED LETTER OVERLAY (GSAP flight sequence) ── */}
        <div
          ref={flyingLetterRef}
          aria-hidden="true"
          className="pointer-events-none select-none absolute hidden"
          style={{
            zIndex: 60,
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
            background: "linear-gradient(170deg, #e8d5a3 0%, #dcc78e 25%, #d4bc7a 50%, #e0cb90 75%, #d8c080 100%)",
            boxShadow: "0 18px 42px rgba(0,0,0,0.55), inset 0 0 40px rgba(80,50,20,0.15)",
            border: "1px solid rgba(120,80,30,0.35)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {/* Paper lines and texture */}
          <div
            className="w-full h-full p-5 sm:p-7 relative"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(100,80,50,0.18) 23px, rgba(100,80,50,0.18) 24px)`,
            }}
          >
            {/* The stamped badge on flying letter */}
            <div className="absolute top-4 right-4 md:right-8 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-[2.5px] border-dashed border-wine flex flex-col items-center justify-center rotate-[-10deg] bg-wine/5 shadow-[0_2px_4px_rgba(140,0,39,0.2)]">
              <span className="text-[7.5px] sm:text-[8.5px] font-bold tracking-widest text-wine uppercase" style={{ fontFamily: "var(--font-display)" }}>
                POSTED
              </span>
              <span className="text-[5.5px] tracking-widest text-wine/70 uppercase font-mono mt-0.5">
                PARCEL POST
              </span>
            </div>

            {/* Red margin lines */}
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: 32,
                width: 2,
                background: "rgba(180,50,50,0.2)",
              }}
            />

            <div className="pl-6 space-y-1.5 text-xs" style={{ fontFamily: "var(--font-body)", color: "#3A1520" }}>
              <p><span className="font-bold opacity-50">To:</span> {contact.email}</p>
              <p><span className="font-bold opacity-50">From:</span> {fromEmail}</p>
              <p><span className="font-bold opacity-50">Subject:</span> {topic}</p>
              <p className="line-clamp-2"><span className="font-bold opacity-50">Your message:</span> {message}</p>
              <p className="mt-2"><span className="font-bold opacity-50">Best Regards,</span> {fullName}</p>
            </div>

            {/* Visual origami fold creases */}
            <div className="absolute inset-x-0 top-1/3 h-[1px] bg-gradient-to-r from-transparent via-black/25 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-2/3 h-[1px] bg-gradient-to-r from-transparent via-black/25 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ── 3D DESK WORKSPACE PLANE (Shares 14deg tilt across typewriter & mailbox) ── */}
        <div
          className="relative flex flex-col md:flex-row items-center md:items-center justify-center gap-8 lg:gap-14"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(14deg)",
          }}
        >
          {/* ── 1. TYPEWRITER (Main Instrument) ── */}
          <div className="w-full max-w-[580px] lg:max-w-[620px] relative">
            {/* Grounding Contact & Ambient Desk Shadows underneath Typewriter */}
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

          {/* ══════════════════════════════════════════════════
              UNIFIED 3D TYPEWRITER CHASSIS & MECHANISM
             ══════════════════════════════════════════════════ */}
          <div
            className="relative z-10 w-full overflow-visible"
            style={{
              /* Unified cast-metal industrial typewriter chassis */
              backgroundColor: "#3B444F",
              backgroundImage: `
                url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"),
                linear-gradient(180deg, rgba(82,94,106,0.95) 0%, rgba(62,71,82,0.95) 25%, rgba(42,49,58,0.98) 75%, rgba(24,28,33,1) 100%)
              `,
              backgroundBlendMode: "overlay, normal",
              borderRadius: "20px 20px 24px 24px",
              boxShadow:
                "0 32px 64px rgba(0,0,0,0.95), 0 14px 24px rgba(0,0,0,0.85), inset 0 2px 2px rgba(255,255,255,0.3), inset -14px 0 28px rgba(0,0,0,0.45), inset 14px 0 28px rgba(0,0,0,0.45), inset 0 -8px 16px rgba(0,0,0,0.7)",
              border: "1.5px solid #1a1e23",
              borderTop: "2px solid #6b7786",
            }}
          >
            {/* ── 1. STATIONARY REAR CARRIAGE CRADLE & GUIDE RAILS ── */}
            <div className="relative w-full overflow-visible px-2 sm:px-3 pt-2.5">
              {/* Recessed stationary guide rail track cavity */}
              <div
                aria-hidden="true"
                className="absolute inset-x-2 sm:inset-x-3 bottom-0 top-2.5 pointer-events-none rounded-t-[14px]"
                style={{
                  background: "linear-gradient(180deg, #101418 0%, #1a2027 60%, #242c36 100%)",
                  boxShadow: "inset 0 8px 16px rgba(0,0,0,0.95), inset 0 2px 4px rgba(0,0,0,0.8)",
                  border: "1.5px solid #202730",
                  borderBottom: "none",
                }}
              >
                {/* Stationary Dual Chrome Guide Rails */}
                <div
                  className="absolute top-2 left-4 right-4 h-[4px] rounded-full"
                  style={{
                    background: "linear-gradient(180deg, #ffffff 0%, #c4cbd4 40%, #586370 100%)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.9)",
                  }}
                />
                <div
                  className="absolute top-4 left-6 right-6 h-[2px] rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #181d22 0%, #76818f 30%, #a4adb8 50%, #76818f 70%, #181d22 100%)",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.6)",
                  }}
                />

                {/* Left Stationary Buffer Cheek & Stop */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-4 rounded-tl-[12px] flex items-center justify-end"
                  style={{
                    background: "linear-gradient(90deg, #3d4754 0%, #222830 100%)",
                    borderRight: "1px solid #15181c",
                    boxShadow: "2px 0 4px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.25)",
                  }}
                >
                  <div className="w-1.5 h-5 bg-[#0a0c0e] rounded-l-[2px] border-l border-white/10" />
                </div>

                {/* Right Stationary Buffer Cheek & Stop */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-4 rounded-tr-[12px] flex items-center justify-start"
                  style={{
                    background: "linear-gradient(270deg, #3d4754 0%, #222830 100%)",
                    borderLeft: "1px solid #15181c",
                    boxShadow: "-2px 0 4px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.25)",
                  }}
                >
                  <div className="w-1.5 h-5 bg-[#0a0c0e] rounded-r-[2px] border-r border-white/10" />
                </div>
              </div>

              {/* ── 2. MOVING CARRIAGE ASSEMBLY — slides along the rails ── */}
              <div
                ref={carriageRef}
                className="relative z-10"
                style={{ willChange: "transform" }}
              >
                {/* Paper roller bar (Platen Cylinder) */}
                <div
                  className="relative mx-auto rounded-full"
                  style={{
                    width: "90%",
                    height: 28,
                    /* True 3D rubber platen cylinder shading */
                    background: "linear-gradient(180deg, #101316 0%, #2e353e 14%, #5e6978 30%, #293038 60%, #121518 88%, #08090a 100%)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.75), inset 0 2px 2px rgba(255,255,255,0.3), inset 0 -3px 5px rgba(0,0,0,0.9)",
                    zIndex: 5,
                  }}
                >
                  {/* Left Cast Platen Bearing Tower / Upright Bracket */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-11 pointer-events-none rounded-[4px] flex items-center justify-center"
                    style={{
                      background: "linear-gradient(180deg, #566473 0%, #2e353e 40%, #181d22 100%)",
                      border: "1px solid #5a6675",
                      borderLeft: "1.5px solid rgba(255,255,255,0.35)",
                      borderBottom: "2px solid #0f1215",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.4)",
                      zIndex: 12,
                    }}
                  >
                    {/* Brass axle pivot screw */}
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: "radial-gradient(circle at 35% 35%, #ffe680 0%, #d4af37 55%, #6a5205 100%)",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.8)",
                        border: "0.5px solid #4a3a03",
                      }}
                    />
                  </div>

                  {/* Right Cast Platen Bearing Tower / Upright Bracket */}
                  <div
                    aria-hidden="true"
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-11 pointer-events-none rounded-[4px] flex items-center justify-center"
                    style={{
                      background: "linear-gradient(180deg, #566473 0%, #2e353e 40%, #181d22 100%)",
                      border: "1px solid #5a6675",
                      borderRight: "1.5px solid rgba(255,255,255,0.35)",
                      borderBottom: "2px solid #0f1215",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.4)",
                      zIndex: 12,
                    }}
                  >
                    {/* Brass axle pivot screw */}
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: "radial-gradient(circle at 35% 35%, #ffe680 0%, #d4af37 55%, #6a5205 100%)",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.8)",
                        border: "0.5px solid #4a3a03",
                      }}
                    />
                  </div>

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
                      top: -6,
                      left: -42,
                      width: 48,
                      height: 12,
                      background: "linear-gradient(180deg, #ffffff 0%, #adb6c0 30%, #4f5862 70%, #1f2429 100%)",
                      borderRadius: "6px 0 0 6px",
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
                        width: 20,
                        height: 28,
                        background: "linear-gradient(135deg, #444a52 0%, #1c2024 60%, #0d0f11 100%)",
                        borderRadius: "45% 10% 10% 45%",
                        boxShadow: "inset 2px 0 4px rgba(255,255,255,0.25), 4px 6px 12px rgba(0,0,0,0.85)",
                        border: "1px solid #333a42",
                      }}
                    />
                  </button>

                  {/* 3D Cylindrical Roller Knobs */}
                  <div
                    className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full z-10"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, #9aa2ab 0%, #4b525b 50%, #1c2024 100%)",
                      boxShadow: "3px 4px 8px rgba(0,0,0,0.75), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.6)",
                      border: "2px solid #3b424a",
                    }}
                  >
                    {/* Fluted ribbed ring & chrome center hub */}
                    <div className="absolute inset-1 rounded-full border border-white/20" />
                    <div
                      className="absolute inset-2 rounded-full"
                      style={{
                        background: "radial-gradient(circle at 40% 40%, #ffffff 0%, #adb5be 60%, #505862 100%)",
                        boxShadow: "inset 0 1px 1px rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.5)",
                      }}
                    />
                  </div>
                  <div
                    className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full z-10"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, #9aa2ab 0%, #4b525b 50%, #1c2024 100%)",
                      boxShadow: "3px 4px 8px rgba(0,0,0,0.75), inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -2px 3px rgba(0,0,0,0.6)",
                      border: "2px solid #3b424a",
                    }}
                  >
                    <div className="absolute inset-1 rounded-full border border-white/20" />
                    <div
                      className="absolute inset-2 rounded-full"
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
                    height: 7,
                    background: "linear-gradient(180deg, #999, #d0d0d0 30%, #777 80%, #555)",
                    marginTop: -3,
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

                {/* ── PERMANENT METAL PAPER TABLE / PAPER REST PLATE (Behind Paper) ── */}
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none rounded-t-[10px] overflow-hidden"
                  style={{
                    top: 24,
                    bottom: 0,
                    width: "88%",
                    zIndex: 1,
                    /* Dark cast steel with satin lacquer finish matching vintage typewriter shell */
                    background: "linear-gradient(180deg, #1b2026 0%, #29303a 20%, #1a2027 60%, #101418 100%)",
                    boxShadow: "inset 0 2px 3px rgba(255,255,255,0.18), inset 0 -4px 14px rgba(0,0,0,0.85), 0 8px 24px rgba(0,0,0,0.6)",
                    border: "1.5px solid #3c4550",
                    borderBottom: "none",
                  }}
                >
                  {/* Brushed chrome top edge rail */}
                  <div
                    className="absolute top-0 inset-x-0 h-[3px]"
                    style={{
                      background: "linear-gradient(90deg, #555 0%, #ccc 25%, #ffffff 50%, #ccc 75%, #555 100%)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.6)",
                    }}
                  />

                  {/* Stamped metal margin measurement hash marks */}
                  <div
                    className="absolute top-2 inset-x-6 h-3 opacity-30"
                    style={{
                      backgroundImage: "repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 10px)",
                      backgroundSize: "10px 4px",
                      backgroundRepeat: "repeat-x",
                    }}
                  />

                  {/* Vertical fluted stamped grooves in the metal */}
                  <div
                    className="absolute inset-x-8 top-8 bottom-6 opacity-20"
                    style={{
                      backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(0,0,0,0.9) 17px, rgba(255,255,255,0.2) 18px, transparent 19px)",
                    }}
                  />

                  {/* Vintage Century Writers Embossed Brand Insignia */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-35 text-center px-4">
                    <div
                      className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#F1A512] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      ★ CENTURY WRITERS ★
                    </div>
                    <div className="text-[7px] sm:text-[8px] tracking-[0.3em] uppercase text-cream/70 font-mono mt-1">
                      PATENT NO. 1926-US · MODEL 70 CARRIAGE BED
                    </div>
                    <div className="mt-2 w-28 h-[1px] bg-gradient-to-r from-transparent via-[#F1A512]/50 to-transparent" />
                  </div>

                  {/* Left and right chrome paper finger clamp guides */}
                  <div
                    className="absolute top-4 left-3 w-3 h-28 rounded-[2px]"
                    style={{
                      background: "linear-gradient(180deg, #d8dee4 0%, #808892 60%, #40454d 100%)",
                      boxShadow: "1px 2px 4px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.7)",
                      border: "1px solid #2e343d",
                    }}
                  />
                  <div
                    className="absolute top-4 right-3 w-3 h-28 rounded-[2px]"
                    style={{
                      background: "linear-gradient(180deg, #d8dee4 0%, #808892 60%, #40454d 100%)",
                      boxShadow: "-1px 2px 4px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.7)",
                      border: "1px solid #2e343d",
                    }}
                  />
                </div>

                {/* ── THE PAPER (aged, old-school) ────────── */}
                <div
                  ref={paperRef}
                  className="relative mx-auto overflow-hidden"
                  style={{
                    width: "86%",
                    minHeight: 250,
                    willChange: "transform, opacity",
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
                      top: 150,
                      left: 20,
                      width: 7,
                      height: 5,
                      background: "rgba(40,20,10,0.15)",
                      borderRadius: "60% 40% 50% 50%",
                    }}
                  />

                  {/* Age spots / foxing marks */}
                  <div
                    aria-hidden="true"
                    className="absolute pointer-events-none rounded-full"
                    style={{
                      bottom: 50,
                      right: 60,
                      width: 10,
                      height: 8,
                      background: "rgba(130,90,40,0.08)",
                      borderRadius: "50%",
                    }}
                  />

                  {/* Red margin line */}
                  <div
                    className="absolute top-0 bottom-0"
                    style={{
                      left: 44,
                      width: 2,
                      background: "rgba(180,50,50,0.2)",
                    }}
                  />
                  {/* Second faint margin line */}
                  <div
                    className="absolute top-0 bottom-0"
                    style={{
                      left: 48,
                      width: 1,
                      background: "rgba(180,50,50,0.1)",
                    }}
                  />

                  {/* Red POSTED ink stamp that slams down when sent */}
                  <div
                    ref={stampRef}
                    className="absolute top-5 right-5 sm:right-8 pointer-events-none select-none"
                    style={{
                      opacity: isStamped ? 0.95 : 0,
                      transform: isStamped ? "rotate(-10deg) scale(1)" : "rotate(-25deg) scale(2.2)",
                      zIndex: 25,
                    }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[2.5px] border-dashed border-wine flex flex-col items-center justify-center p-1 shadow-[0_2px_8px_rgba(140,0,39,0.35)] bg-wine/5">
                      <span
                        className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-wine"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        POSTED
                      </span>
                      <span className="text-[6.5px] text-wine/75 font-mono mt-0.5 font-bold">
                        {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <span className="text-[5.5px] tracking-widest text-wine/60 uppercase font-mono mt-0.5">
                        PARCEL POST
                      </span>
                    </div>
                  </div>

                  {/* Paper content */}
                  <div className="px-6 py-5 sm:px-8 sm:py-6">
                    <div
                      className="space-y-2.5 text-xs sm:text-[13px] leading-relaxed"
                      style={{ fontFamily: "var(--font-body)", color: "#3A1520" }}
                    >
                      {/* To */}
                      <p>
                        <span className="font-bold" style={{ color: "rgba(58,21,32,0.4)" }}>To:</span>{" "}
                        <span>{contact.email}</span>
                      </p>

                      <div style={{ borderTop: "1px solid rgba(58,21,32,0.08)", margin: "12px 0" }} />

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

                      {/* Subject (under from and before your message) */}
                      <p>
                        <span className="font-bold" style={{ color: "rgba(58,21,32,0.4)" }}>Subject:</span>{" "}
                        <span
                          className={`inline cursor-text outline-none ${activeField === "topic" ? "typewriter-field-cursor" : ""}`}
                          onClick={() => changeField("topic")}
                          role="button"
                          tabIndex={0}
                        >
                          {topic || (activeField !== "topic" && (
                            <span style={{ color: "rgba(58,21,32,0.2)", fontStyle: "italic" }}>e.g. project inquiry, hello</span>
                          ))}
                        </span>
                      </p>

                      {/* Message */}
                      <div>
                        <p className="font-bold mb-1" style={{ color: "rgba(58,21,32,0.4)" }}>Your message:</p>
                        <div
                          className={`min-h-[50px] whitespace-pre-wrap cursor-text outline-none ${activeField === "message" ? "typewriter-field-cursor" : ""}`}
                          onClick={() => changeField("message")}
                          role="button"
                          tabIndex={0}
                        >
                          {message || (activeField !== "message" && (
                            <span style={{ color: "rgba(58,21,32,0.2)", fontStyle: "italic" }}>type here</span>
                          ))}
                        </div>
                      </div>

                      <div style={{ borderTop: "1px solid rgba(58,21,32,0.08)", margin: "12px 0" }} />

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
                </div>
              </div>
            </div>

            {/* ── 3. CHASSIS FRONT DECK & SUNKEN KEYBOARD TRAY ── */}
            <div className="relative z-20 px-3 sm:px-5 md:px-6 pt-3 pb-5 -mt-2">
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
            <div className="absolute left-4 sm:left-6 top-3 sm:top-3.5 z-10 flex flex-col items-center gap-1.5 sm:gap-2 w-[175px] sm:w-[195px]">
              <span
                className="text-[10px] sm:text-[11px] tracking-[0.24em] font-black uppercase text-center w-full select-none"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#D0D6DC",
                  textShadow: "0 -1px 1px rgba(0,0,0,0.95), 0 1px 1px rgba(255,255,255,0.25)",
                  lineHeight: "1.3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                }}
              >
                <span>CENTURY</span>
                <span>WRITERS</span>
              </span>

              {/* Flat Vintage Metal Nameplate / Specification Plaque */}
              {contact.phone && contact.phone.length > 0 && (
                <div 
                  className="w-full relative rounded-md px-3 py-1.5 sm:py-2 select-none"
                  style={{
                    background: "linear-gradient(180deg, #2b333a 0%, #1e2328 100%)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderTop: "1.5px solid rgba(255,255,255,0.28)",
                    borderBottom: "1.5px solid rgba(0,0,0,0.85)",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.12)",
                  }}
                >
                  {/* Corner brass / steel rivets */}
                  <span className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#5d6772] shadow-[0_0.5px_0_rgba(255,255,255,0.35),inset_0_0.5px_0.5px_rgba(255,255,255,0.5)]" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#5d6772] shadow-[0_0.5px_0_rgba(255,255,255,0.35),inset_0_0.5px_0.5px_rgba(255,255,255,0.5)]" />
                  <span className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#5d6772] shadow-[0_0.5px_0_rgba(255,255,255,0.35),inset_0_0.5px_0.5px_rgba(255,255,255,0.5)]" />
                  <span className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#5d6772] shadow-[0_0.5px_0_rgba(255,255,255,0.35),inset_0_0.5px_0.5px_rgba(255,255,255,0.5)]" />

                  {/* Engraved Phone Numbers */}
                  <div className="flex flex-col gap-1 px-1.5">
                    {contact.phone.map((p) => (
                      <div key={p.label} className="flex items-center justify-between gap-2.5">
                        <span
                          className="opacity-65 uppercase text-[8px] sm:text-[8.5px] tracking-wider font-mono font-bold text-[#9aa4ae]"
                          style={{ textShadow: "0 -1px 1px rgba(0,0,0,0.8)" }}
                        >
                          {p.label}:
                        </span>
                        <span
                          className="font-bold tracking-wider text-[10px] sm:text-[11px]"
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
              className="relative mx-auto mt-16 sm:mt-18 rounded-2xl p-2 sm:p-3 md:p-4"
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
              <div className="flex flex-col items-center gap-[5px] md:gap-[7px] relative z-10">
                {KEYBOARD_ROWS.map((row, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="flex gap-[3px] sm:gap-[5px] md:gap-[7px] justify-center"
                    style={{
                      /* Stagger rows like a real typewriter */
                      paddingLeft: rowIdx === 1 ? 10 : rowIdx === 2 ? 22 : rowIdx === 3 ? 38 : 0,
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
                              bottom: -6,
                              width: 5,
                              height: 12,
                              background: "linear-gradient(180deg, #6c737c 0%, #34383e 50%, #111315 100%)",
                              boxShadow: "inset -1px 0 2px rgba(0,0,0,0.6)",
                              zIndex: 0,
                            }}
                          />
                          {/* Key cap — iconic vintage chrome bezel & dished face */}
                          <div
                            className="relative z-10 flex items-center justify-center transition-all duration-75"
                            style={{
                              width: 31,
                              height: 31,
                              borderRadius: "6px",
                              /* Vintage ivory concave dish */
                              background: isPressed
                                ? "radial-gradient(circle at 50% 60%, #b8b3a7 0%, #999387 100%)"
                                : "radial-gradient(circle at 50% 32%, #ffffff 0%, #f6f2e9 45%, #ddd6c8 100%)",
                              /* Raised chrome outer ring + deep drop shadow */
                              boxShadow: isPressed
                                ? "inset 0 3px 6px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.6)"
                                : "0 7px 12px -2px rgba(0,0,0,0.9), 0 3px 4px rgba(0,0,0,0.6), inset 0 1.5px 1.5px rgba(255,255,255,0.95), inset 0 -1.5px 2px rgba(0,0,0,0.35)",
                              transform: isPressed ? "translateY(4px)" : "translateY(0)",
                              fontSize: 11,
                              fontWeight: 700,
                              color: isPressed ? "#5a1a2b" : "#2f3235",
                              fontFamily: "var(--font-body)",
                              cursor: "pointer",
                              border: "1.5px solid #bdc3c7", // Chrome bezel ring
                              borderBottom: isPressed ? "2px solid #777" : "5px solid #8e949a", // 3D metal side extrusion
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
                <div className="flex gap-[4px] sm:gap-[6px] md:gap-[8px] items-center justify-center mt-1.5">
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
                        width: 48,
                        height: 31,
                        borderRadius: "6px",
                        background: pressedKey === "BACK"
                          ? "radial-gradient(circle at 50% 60%, #b8b3a7 0%, #999387 100%)"
                          : "radial-gradient(circle at 50% 32%, #ffffff 0%, #f6f2e9 45%, #ddd6c8 100%)",
                        boxShadow: pressedKey === "BACK"
                          ? "inset 0 3px 6px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.6)"
                          : "0 7px 12px -2px rgba(0,0,0,0.9), 0 3px 4px rgba(0,0,0,0.6), inset 0 1.5px 1.5px rgba(255,255,255,0.95), inset 0 -1.5px 2px rgba(0,0,0,0.35)",
                        transform: pressedKey === "BACK" ? "translateY(4px)" : "translateY(0)",
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: "#2f3235",
                        fontFamily: "var(--font-body)",
                        cursor: "pointer",
                        border: "1.5px solid #bdc3c7",
                        borderBottom: pressedKey === "BACK" ? "2px solid #777" : "5px solid #8e949a",
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
                        bottom: -6,
                        width: 7,
                        height: 12,
                        background: "linear-gradient(180deg, #6c737c 0%, #34383e 50%, #111315 100%)",
                        zIndex: 0,
                      }}
                    />
                    <div
                      className="absolute left-[70%] -translate-x-1/2 rounded-[1px]"
                      style={{
                        bottom: -6,
                        width: 7,
                        height: 12,
                        background: "linear-gradient(180deg, #6c737c 0%, #34383e 50%, #111315 100%)",
                        zIndex: 0,
                      }}
                    />
                    <div
                      className="relative z-10 flex items-center justify-center transition-all duration-75"
                      style={{
                        width: 155,
                        height: 29,
                        borderRadius: "7px",
                        background: pressedKey === "SPC"
                          ? "radial-gradient(ellipse at 50% 60%, #b8b3a7 0%, #999387 100%)"
                          : "radial-gradient(ellipse at 50% 32%, #ffffff 0%, #f6f2e9 45%, #ddd6c8 100%)",
                        boxShadow: pressedKey === "SPC"
                          ? "inset 0 3px 6px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.6)"
                          : "0 7px 12px -2px rgba(0,0,0,0.9), 0 3px 4px rgba(0,0,0,0.6), inset 0 1.5px 1.5px rgba(255,255,255,0.95), inset 0 -1.5px 2px rgba(0,0,0,0.35)",
                        transform: pressedKey === "SPC" ? "translateY(4px)" : "translateY(0)",
                        cursor: "pointer",
                        border: "1.5px solid #bdc3c7",
                        borderBottom: pressedKey === "SPC" ? "2px solid #777" : "5px solid #8e949a",
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
                        width: 48,
                        height: 31,
                        borderRadius: "6px",
                        background: pressedKey === "RET"
                          ? "radial-gradient(circle at 50% 60%, #b8b3a7 0%, #999387 100%)"
                          : "radial-gradient(circle at 50% 32%, #ffffff 0%, #f6f2e9 45%, #ddd6c8 100%)",
                        boxShadow: pressedKey === "RET"
                          ? "inset 0 3px 6px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.6)"
                          : "0 7px 12px -2px rgba(0,0,0,0.9), 0 3px 4px rgba(0,0,0,0.6), inset 0 1.5px 1.5px rgba(255,255,255,0.95), inset 0 -1.5px 2px rgba(0,0,0,0.35)",
                        transform: pressedKey === "RET" ? "translateY(4px)" : "translateY(0)",
                        fontSize: 9.5,
                        fontWeight: 700,
                        color: "#2f3235",
                        fontFamily: "var(--font-body)",
                        cursor: "pointer",
                        border: "1.5px solid #bdc3c7",
                        borderBottom: pressedKey === "RET" ? "2px solid #777" : "5px solid #8e949a",
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
                        width: 58,
                        height: 31,
                        borderRadius: "6px",
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
              Typing: <span className="text-mustard font-bold">{activeField === "from" ? "From" : activeField === "topic" ? "Subject" : activeField === "message" ? "Message" : "Name"}</span>
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

        {/* ── 2. SEPARATE VINTAGE DESK POSTBOX (Desktop Postal Letter Box) ── */}
        <div
          ref={postalSlotRef}
          className="
            relative
            shrink-0
            z-20 select-none
            scale-[0.88] sm:scale-95 md:scale-95 lg:scale-100
            my-4 md:my-0
          "
          style={{
            perspective: "1000px",
          }}
          title="Vintage Postal Letter Box"
          aria-label="Vintage Postal Letter Box"
        >
          {/* Grounding cast shadow on desk surface */}
          <div
            aria-hidden="true"
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[120%] h-12 pointer-events-none rounded-[50%]"
            style={{
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 75%)",
              filter: "blur(6px)",
            }}
          />

          {/* Pillar box main body */}
          <div
            className="relative flex flex-col items-center overflow-hidden"
            style={{
              width: "205px",
              minHeight: "315px",
              borderRadius: "44px 44px 14px 14px",
              background: "linear-gradient(165deg, #323b46 0%, #222830 35%, #14171c 70%, #0a0c0f 100%)",
              boxShadow:
                "0 24px 48px rgba(0,0,0,0.85), inset 2px 2px 3px rgba(255,255,255,0.22), inset -3px -3px 8px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.9)",
              border: "2px solid #3d4654",
            }}
          >
            {/* ── 1. DOMED TOP CAP with brass finial & brand insignia ── */}
            <div className="w-full pt-4 pb-2.5 px-4 flex flex-col items-center relative">
              {/* Polished brass ball finial */}
              <div
                className="w-4 h-4 rounded-full mb-1.5"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #ffe680 0%, #d4af37 45%, #7a5d05 100%)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.7)",
                  border: "1px solid #5a4303",
                }}
              />
              {/* Curved crown insignia badge */}
              <div
                className="text-[9px] font-bold tracking-[0.28em] uppercase text-[#d4af37] text-center"
                style={{
                  fontFamily: "var(--font-display)",
                  textShadow: "0 1px 2px rgba(0,0,0,0.9)",
                }}
              >
                ★ GABRIEL POST ★
              </div>
              <div className="text-[7px] tracking-[0.2em] uppercase text-cream/50 font-mono mt-0.5">
                DISPATCH NO. 70
              </div>

              {/* Embossed metal separator trim band with brass rivets */}
              <div
                className="w-full mt-2.5 h-[3px] rounded-full relative"
                style={{
                  background: "linear-gradient(180deg, #586474 0%, #28303a 100%)",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.25)",
                }}
              >
                <span className="absolute -top-1 left-2 w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
                <span className="absolute -top-1 right-2 w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
              </div>
            </div>

            {/* ── 2. BRASS MAIL SLOT APERTURE & HINGED FLAP ── */}
            <div className="w-full px-3.5 mt-1">
              <div
                className="relative rounded-lg p-2 flex flex-col items-center"
                style={{
                  background: "linear-gradient(180deg, #242a33 0%, #171b20 100%)",
                  border: "1.5px solid #363e4b",
                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.7), 0 4px 8px rgba(0,0,0,0.5)",
                }}
              >
                {/* Embossed "LETTERS" brass plaque header */}
                <div
                  className="text-[8px] font-extrabold tracking-[0.25em] uppercase text-[#d4af37] text-center mb-1.5 py-0.5 px-3 rounded w-full border border-[#d4af37]/35"
                  style={{
                    fontFamily: "var(--font-display)",
                    background: "linear-gradient(180deg, rgba(212,175,55,0.2) 0%, rgba(120,90,10,0.1) 100%)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.9)",
                  }}
                >
                  LETTERS
                </div>

                {/* Slot Aperture Cavity (Deep drop chute) */}
                <div
                  ref={slotApertureRef}
                  className="relative w-full rounded overflow-hidden"
                  style={{
                    height: 32,
                    background: "#040506",
                    boxShadow: "inset 0 6px 12px rgba(0,0,0,0.98), 0 1px 1px rgba(255,255,255,0.12)",
                    border: "1.5px solid #14171b",
                  }}
                >
                  {/* Deep chute gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black via-black/85 to-transparent pointer-events-none" />

                  {/* Hinged Brass Mail Flap */}
                  <div
                    ref={postalFlapRef}
                    className="absolute inset-x-0 top-0 h-full origin-top flex items-center justify-center cursor-default"
                    style={{
                      background: "linear-gradient(180deg, #e5c158 0%, #b88d18 50%, #7d5e06 100%)",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.75), inset 0 1px 1px rgba(255,255,255,0.65), inset 0 -1px 2px rgba(0,0,0,0.5)",
                      borderBottom: "2px solid #5a4203",
                      transformOrigin: "top center",
                    }}
                  >
                    {/* Embossed "P O S T" text */}
                    <span
                      className="text-[9px] font-black tracking-[0.3em] text-[#3d2c05] drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      P O S T
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 3. ENAMEL COLLECTION SCHEDULE & NOTICE PLATE ── */}
            <div className="w-full px-3.5 mt-3 mb-2 flex-1 flex flex-col justify-between">
              <div
                className="rounded-md p-2.5 border border-[#3e4755]"
                style={{
                  background: "linear-gradient(180deg, rgba(20,24,30,0.85) 0%, rgba(12,14,18,0.9) 100%)",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.8)",
                }}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-cream/10">
                  <span className="text-[7.5px] font-bold uppercase tracking-wider text-cream/70 font-mono">
                    COLLECTION
                  </span>
                  <span className="text-[7.5px] font-mono text-[#d4af37]">
                    DAILY
                  </span>
                </div>

                <div className="pt-1.5 space-y-1 text-[7px] font-mono text-cream/50">
                  <div className="flex justify-between">
                    <span>MORNING:</span>
                    <span className="text-cream/80">09:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>EVENING:</span>
                    <span className="text-cream/80">05:00 PM</span>
                  </div>
                </div>

                {/* Live Status Indicator Badge */}
                <div className="mt-2.5 pt-1.5 border-t border-cream/10 flex items-center justify-between text-[7px] font-mono">
                  <span className="text-cream/60">STATUS:</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${lettersMailedCount > 0 ? "bg-[#2BAF90]" : "bg-[#2BAF90] animate-pulse"}`}
                      style={{ boxShadow: "0 0 6px #2BAF90" }}
                    />
                    <span className="text-[#2BAF90] font-bold tracking-wider">
                      {lettersMailedCount > 0 ? `${lettersMailedCount} POSTED` : "READY"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Brass keyhole escutcheon at bottom of door */}
              <div className="my-2 flex items-center justify-center">
                <div
                  className="w-5 h-6 rounded-full flex flex-col items-center justify-center relative"
                  style={{
                    background: "linear-gradient(180deg, #d4af37 0%, #8a6a08 100%)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.5)",
                    border: "1px solid #554002",
                  }}
                  title="Postal Key Inspection Lock"
                >
                  {/* Keyhole slot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  <div className="w-1 h-2 bg-black -mt-0.5 rounded-b-[1px]" />
                </div>
              </div>
            </div>

            {/* ── 4. CAST-IRON STEPPED PEDESTAL BASE ── */}
            <div
              className="w-full h-4 relative flex items-center justify-between px-3"
              style={{
                background: "linear-gradient(180deg, #3a4350 0%, #1e2329 60%, #0d0f12 100%)",
                borderTop: "1px solid #4a5666",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              {/* Heavy base mounting rivets */}
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]" />
              <span className="text-[6.5px] uppercase tracking-[0.25em] text-cream/30 font-mono">
                IRON CAST
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  );
}
