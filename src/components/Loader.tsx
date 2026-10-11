"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

interface LoaderProps {
  onComplete?: () => void;
}

/* ───────────────────────────────────────────────────────────
   LOADER CUSTOMIZATION SETTINGS
   Tweak these values anytime to customize the loader!
   ─────────────────────────────────────────────────────────── */
export const LOADER_CONFIG = {
  // 🏷️ Labels & Branding
  brandName: "gab.io",
  tapeType: "e-portfolio",
  counterLabel: "TAPE INDEX:",

  // ⏱️ Timing & Durations (in seconds)
  spinDuration: 2.65, // Added +1.5s for a relaxed, deliberate tape reel spin
  logoWipeDuration: 1.85, // Smooth logo reveal across the magnetic tape ribbon
  holdDuration: 0.35, // Satisfying pause at index 100 before door ejects
  ejectDuration: 0.75, // Snappy mechanical split door opening

  // 🎨 Colors
  backgroundColor: "#F5EEDE", // Background cream
  borderColor: "#8C0027", // Outline wine border
  tapeWindowBg: "#EFE8D8", // Cassette well background
  ledColor: "#DD4111", // Status indicator dot

  // ⚙️ Behavior
  playOncePerSession: false, // Set to true to only show on first visit
};

/* ───────────────────────────────────────────────────────────
   CLASSIC 6-COG VINTAGE CASSETTE SPOOL
   ─────────────────────────────────────────────────────────── */
function CassetteSpool({
  spoolRef,
  className,
}: {
  spoolRef: React.RefObject<SVGSVGElement | null>;
  className?: string;
}) {
  return (
    <svg
      ref={spoolRef}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      {/* Outer circular guide */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="#8C0027"
        strokeWidth="4"
      />
      {/* Magnetic tape pack shadow */}
      <circle cx="50" cy="50" r="35" fill="#8C0027" opacity="0.14" />
      {/* Inner hub */}
      <circle
        cx="50"
        cy="50"
        r="23"
        fill="#F5EEDE"
        stroke="#8C0027"
        strokeWidth="3.5"
      />
      {/* 6 authentic drive teeth */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <rect
          key={deg}
          x="46.5"
          y="28"
          width="7"
          height="8.5"
          rx="1"
          fill="#8C0027"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      {/* Spindle hole */}
      <circle
        cx="50"
        cy="50"
        r="11"
        fill="#F5EEDE"
        stroke="#8C0027"
        strokeWidth="3"
      />
    </svg>
  );
}

export default function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const deckHousingRef = useRef<HTMLDivElement>(null);
  const leftSpoolRef = useRef<SVGSVGElement>(null);
  const rightSpoolRef = useRef<SVGSVGElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const vuLeftRef = useRef<HTMLDivElement>(null);
  const vuRightRef = useRef<HTMLDivElement>(null);
  const recDotRef = useRef<HTMLSpanElement>(null);

  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Prevent scrolling while loader is active WITHOUT modifying body overflow
    // This guarantees the scrollbar never disappears or causes horizontal layout shift!
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    // Hard fallback safety timer (increased to fit relaxed 2.65s animation)
    const safetyTimer = setTimeout(() => {
      setIsDone(true);
      onComplete?.();
    }, 4500);

    return () => {
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      clearTimeout(safetyTimer);
    };
  }, [onComplete]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({
        onComplete: () => {
          setIsDone(true);
          onComplete?.();
        },
      });

      // ── Initial setup ──────────────────────────────────────────
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set([topPanelRef.current, bottomPanelRef.current], {
        yPercent: 0,
      });
      gsap.set(deckHousingRef.current, { scale: 0.95, opacity: 0 });
      gsap.set(logoRef.current, {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0,
        filter: "drop-shadow(2px 2px 0px rgba(140,0,39,0.3))",
      });

      // ── Step 1: Deck Power On ──────────────────────────────────
      // Cassette housing fades and pops into place
      tl.to(
        deckHousingRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.4)",
        },
        0.05
      );

      // ── Step 2: Spools Spin & Tape Reads ───────────────────────
      // Spools spin smoothly as magnetic tape winds (4 full rotations over 2.65s)
      tl.to(
        [leftSpoolRef.current, rightSpoolRef.current],
        {
          rotation: "+=1440",
          duration: LOADER_CONFIG.spinDuration,
          ease: "power2.inOut",
        },
        0.15
      );

      // Logo wipes in horizontally like magnetic tape passing the playback head
      tl.to(
        logoRef.current,
        {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: LOADER_CONFIG.logoWipeDuration,
          ease: "power2.inOut",
        },
        0.2
      );

      // Mechanical 3-digit counter ticks up from 000 to 100
      const counterVal = { val: 0 };
      tl.to(
        counterVal,
        {
          val: 100,
          duration: LOADER_CONFIG.spinDuration * 0.85,
          ease: "power1.inOut",
          onUpdate: () => {
            if (counterRef.current) {
              const num = String(Math.floor(counterVal.val)).padStart(3, "0");
              counterRef.current.textContent = num;
            }
          },
        },
        0.15
      );

      // Stereo VU meter bars pulse dynamically
      if (vuLeftRef.current && vuRightRef.current) {
        tl.to(
          vuLeftRef.current,
          {
            scaleX: 0.9,
            duration: 0.22,
            repeat: 8,
            yoyo: true,
            ease: "sine.inOut",
          },
          0.2
        );
        tl.to(
          vuRightRef.current,
          {
            scaleX: 0.82,
            duration: 0.26,
            repeat: 7,
            yoyo: true,
            ease: "sine.inOut",
          },
          0.2
        );
      }

      // ── Step 3: Tape Stop / Mechanical Click Settle ────────────
      tl.to(
        deckHousingRef.current,
        {
          scale: 1.02,
          duration: 0.08,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        },
        LOADER_CONFIG.spinDuration
      );

      // Brief hold for recognition
      tl.to({}, { duration: LOADER_CONFIG.holdDuration });

      // ── Step 4: Cassette Door "EJECT" Split Wipe Reveal ────────
      // Housing fades slightly and pulls back
      tl.to(deckHousingRef.current, {
        opacity: 0,
        scale: 0.96,
        duration: 0.25,
        ease: "power2.in",
      });

      // Top panel slides UP, bottom panel slides DOWN
      tl.to(
        topPanelRef.current,
        {
          yPercent: -100,
          duration: LOADER_CONFIG.ejectDuration,
          ease: "power4.inOut",
        },
        "-=0.1"
      );
      tl.to(
        bottomPanelRef.current,
        {
          yPercent: 100,
          duration: LOADER_CONFIG.ejectDuration,
          ease: "power4.inOut",
        },
        "<"
      );
    },
    { scope: containerRef }
  );

  if (isDone) return null;

  return (
    <aside
      ref={containerRef}
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[9999] flex items-center justify-center select-none overflow-hidden touch-none"
    >
      {/* ── TOP SHUTTER PANEL ──────────────────────────────── */}
      <div
        ref={topPanelRef}
        className="absolute top-0 left-0 right-0 h-1/2 will-change-transform z-10"
        style={{ backgroundColor: LOADER_CONFIG.backgroundColor }}
      >
        <div
          className="grain-overlay opacity-10 pointer-events-none"
          aria-hidden="true"
        />
        {/* Retro Multi-Color Bottom Lip on Top Panel */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 flex w-full">
          <div className="h-full flex-1 bg-[#2BAF90]" />
          <div className="h-full flex-1 bg-[#A1D4B1]" />
          <div className="h-full flex-1 bg-[#F1A512]" />
          <div className="h-full flex-1 bg-[#DD4111]" />
          <div className="h-full flex-1 bg-[#8C0027]" />
        </div>
      </div>

      {/* ── BOTTOM SHUTTER PANEL ───────────────────────────── */}
      <div
        ref={bottomPanelRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 will-change-transform z-10"
        style={{ backgroundColor: LOADER_CONFIG.backgroundColor }}
      >
        <div
          className="grain-overlay opacity-10 pointer-events-none"
          aria-hidden="true"
        />
        {/* Retro Multi-Color Top Lip on Bottom Panel */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex w-full">
          <div className="h-full flex-1 bg-[#8C0027]" />
          <div className="h-full flex-1 bg-[#DD4111]" />
          <div className="h-full flex-1 bg-[#F1A512]" />
          <div className="h-full flex-1 bg-[#A1D4B1]" />
          <div className="h-full flex-1 bg-[#2BAF90]" />
        </div>
      </div>

      {/* ── CASSETTE DECK CENTER UNIT ───────────────────────── */}
      <div
        ref={deckHousingRef}
        className="relative z-20 flex flex-col items-center px-4 max-w-md w-full will-change-transform"
      >
        {/* Outer Cassette Deck Shell */}
        <div
          className="w-full border-[3px] rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0px_0px_#8C0027] flex flex-col items-center gap-4"
          style={{
            backgroundColor: LOADER_CONFIG.backgroundColor,
            borderColor: LOADER_CONFIG.borderColor,
          }}
        >
          {/* Deck Top Header: Deck Brand & Status LED */}
          <div className="w-full flex items-center justify-between border-b-2 border-[#8C0027]/20 pb-2.5 font-mono text-[11px] sm:text-xs text-[#8C0027]">
            <div className="flex items-center gap-2">
              <span
                ref={recDotRef}
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: LOADER_CONFIG.ledColor }}
              />
              <span className="font-bold tracking-widest uppercase">
                {LOADER_CONFIG.brandName}
              </span>
            </div>
            <span className="tracking-wider opacity-75">
              {LOADER_CONFIG.tapeType}
            </span>
          </div>

          {/* Tape Cassette Window */}
          <div
            className="relative w-full border-2 border-[#8C0027] rounded-2xl p-4 sm:p-5 flex flex-col items-center overflow-hidden"
            style={{ backgroundColor: LOADER_CONFIG.tapeWindowBg }}
          >
            {/* Guide Ruler Behind Tape */}
            <div className="w-full flex justify-between px-2 mb-2 text-[9px] font-mono text-[#8C0027]/40 tracking-widest">
              <span>| 100</span>
              <span>| 50</span>
              <span>0 |</span>
            </div>

            {/* Central Spools & Wordmark Area */}
            <div className="relative w-full flex items-center justify-between px-2 sm:px-4 my-1">
              {/* Left Supply Reel */}
              <CassetteSpool
                spoolRef={leftSpoolRef}
                className="w-14 h-14 sm:w-16 sm:h-16 will-change-transform shrink-0"
              />

              {/* Center Magnetic Tape Track & gab.io Logo */}
              <div className="relative flex-1 mx-2 sm:mx-3 flex items-center justify-center">
                {/* Magnetic tape ribbon bar */}
                <div className="absolute inset-x-0 h-4 bg-[#3A1520]/15 rounded-sm" />

                {/* The Logo (Wipes in along tape path) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={logoRef}
                  src="/logo/gab_io_log/logl.png"
                  alt="gab.io logo"
                  className="relative z-10 w-full max-w-[190px] sm:max-w-[220px] aspect-[1930/815] object-contain will-change-transform"
                />
              </div>

              {/* Right Take-Up Reel */}
              <CassetteSpool
                spoolRef={rightSpoolRef}
                className="w-14 h-14 sm:w-16 sm:h-16 will-change-transform shrink-0"
              />
            </div>

            {/* Bottom Window Bevel Cut */}
            <div className="w-3/4 h-2 bg-[#8C0027]/15 rounded-full mt-3" />
          </div>

          {/* Deck Lower Controls / Analog Readouts */}
          <div className="w-full flex items-center justify-between pt-1 gap-4 font-mono text-xs text-[#8C0027]">
            {/* Mechanical 3-Digit Tape Index Counter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] tracking-wider uppercase font-bold text-[#8C0027]/70">
                {LOADER_CONFIG.counterLabel}
              </span>
              <div className="bg-[#3A1520] text-[#F1A512] font-mono font-bold px-2 py-0.5 rounded tracking-widest text-xs border border-[#8C0027] shadow-inner">
                [ <span ref={counterRef}>000</span> ]
              </div>
            </div>

            {/* Stereo VU Meter Readout */}
            <div className="flex flex-col gap-1 w-28 sm:w-36">
              <div className="flex items-center justify-between text-[9px] text-[#8C0027]/70 tracking-tighter">
                <span>-20</span>
                <span>-3</span>
                <span>0</span>
                <span className="text-[#DD4111] font-bold">+3dB</span>
              </div>
              {/* L Channel */}
              <div className="w-full h-1.5 bg-[#8C0027]/15 rounded-sm overflow-hidden p-[0.5px]">
                <div
                  ref={vuLeftRef}
                  className="h-full bg-gradient-to-r from-[#2BAF90] via-[#F1A512] to-[#DD4111] origin-left rounded-sm"
                  style={{ transform: "scaleX(0.1)" }}
                />
              </div>
              {/* R Channel */}
              <div className="w-full h-1.5 bg-[#8C0027]/15 rounded-sm overflow-hidden p-[0.5px]">
                <div
                  ref={vuRightRef}
                  className="h-full bg-gradient-to-r from-[#2BAF90] via-[#F1A512] to-[#DD4111] origin-left rounded-sm"
                  style={{ transform: "scaleX(0.1)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
