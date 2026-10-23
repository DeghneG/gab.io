"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
  tapePackRef,
  tapeRingRef,
  initialRadius = 35,
  className,
}: {
  spoolRef: React.RefObject<SVGSVGElement | null>;
  tapePackRef?: React.RefObject<SVGCircleElement | null>;
  tapeRingRef?: React.RefObject<SVGCircleElement | null>;
  initialRadius?: number;
  className?: string;
}) {
  return (
    <svg
      ref={spoolRef}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      {/* Outer circular guide groove */}
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="#E8DFC8"
        stroke="#8C0027"
        strokeWidth="3.5"
      />
      {/* Deep Rich Magnetic Oxide Tape Pack (Bold, high-contrast dark tape roll) */}
      <circle
        ref={tapePackRef}
        cx="50"
        cy="50"
        r={initialRadius}
        fill="#2B0A14"
        stroke="#6B1327"
        strokeWidth="1.5"
      />
      {/* Magnetic tape outer winding coil ring (visual winding texture) */}
      <circle
        ref={tapeRingRef}
        cx="50"
        cy="50"
        r={Math.max(24, initialRadius - 4)}
        fill="none"
        stroke="#C48494"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.8"
      />
      {/* Inner plastic cogged hub */}
      <circle
        cx="50"
        cy="50"
        r="23"
        fill="#FDF9F0"
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
        fill="#E8DFC8"
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
  const leftTapePackRef = useRef<SVGCircleElement>(null);
  const leftTapeRingRef = useRef<SVGCircleElement>(null);
  const rightTapePackRef = useRef<SVGCircleElement>(null);
  const rightTapeRingRef = useRef<SVGCircleElement>(null);
  const tapeRibbonRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const vuLeftRef = useRef<HTMLDivElement>(null);
  const vuRightRef = useRef<HTMLDivElement>(null);
  const recDotRef = useRef<HTMLSpanElement>(null);

  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Keep window at top while loader boots
    window.scrollTo(0, 0);

    // Hard fallback safety timer (increased to fit relaxed 2.65s animation)
    const safetyTimer = setTimeout(() => {
      setIsDone(true);
      onComplete?.();
    }, 4500);

    return () => {
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
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 150);
        },
      });

      // ── Initial setup ──────────────────────────────────────────
      gsap.set(containerRef.current, { opacity: 1 });
      gsap.set([topPanelRef.current, bottomPanelRef.current], {
        yPercent: 0,
      });
      gsap.set(deckHousingRef.current, { scale: 0.95, opacity: 0 });

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

      // ── Step 2: Spools Spin & Realistic Magnetic Tape Transfer ──
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

      // Left Supply Reel: Tape pack shrinks as it unwinds (r: 43 -> r: 25)
      if (leftTapePackRef.current) {
        tl.to(
          leftTapePackRef.current,
          {
            attr: { r: 25 },
            duration: LOADER_CONFIG.spinDuration,
            ease: "power1.inOut",
          },
          0.15
        );
      }
      if (leftTapeRingRef.current) {
        tl.to(
          leftTapeRingRef.current,
          {
            attr: { r: 22 },
            opacity: 0.2,
            duration: LOADER_CONFIG.spinDuration,
            ease: "power1.inOut",
          },
          0.15
        );
      }

      // Right Take-Up Reel: Tape pack expands as it collects tape (r: 25 -> r: 43)
      if (rightTapePackRef.current) {
        tl.to(
          rightTapePackRef.current,
          {
            attr: { r: 43 },
            duration: LOADER_CONFIG.spinDuration,
            ease: "power1.inOut",
          },
          0.15
        );
      }
      if (rightTapeRingRef.current) {
        tl.to(
          rightTapeRingRef.current,
          {
            attr: { r: 40 },
            opacity: 0.45,
            duration: LOADER_CONFIG.spinDuration,
            ease: "power1.inOut",
          },
          0.15
        );
      }

      // Center Magnetic Ribbon: physical tape stream traveling horizontally
      if (tapeRibbonRef.current) {
        tl.to(
          tapeRibbonRef.current,
          {
            x: -120,
            duration: LOADER_CONFIG.spinDuration,
            ease: "none",
          },
          0.15
        );
      }

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
          className="relative w-full border-[3px] rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0px_0px_#8C0027] flex flex-col items-center gap-3.5"
          style={{
            backgroundColor: LOADER_CONFIG.backgroundColor,
            borderColor: LOADER_CONFIG.borderColor,
          }}
        >
          {/* 4 Corner Vintage Metal Screws */}
          <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-[#E2D5BE] border border-[#8C0027]/50 flex items-center justify-center shadow-inner" title="Cassette Shell Screw">
            <div className="w-2 h-[1px] bg-[#8C0027]/80" />
            <div className="h-2 w-[1px] bg-[#8C0027]/80 absolute" />
          </div>
          <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-[#E2D5BE] border border-[#8C0027]/50 flex items-center justify-center shadow-inner" title="Cassette Shell Screw">
            <div className="w-2 h-[1px] bg-[#8C0027]/80 rotate-45" />
            <div className="h-2 w-[1px] bg-[#8C0027]/80 -rotate-45 absolute" />
          </div>
          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-[#E2D5BE] border border-[#8C0027]/50 flex items-center justify-center shadow-inner" title="Cassette Shell Screw">
            <div className="w-2 h-[1px] bg-[#8C0027]/80 rotate-12" />
            <div className="h-2 w-[1px] bg-[#8C0027]/80 -rotate-78 absolute" />
          </div>
          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-[#E2D5BE] border border-[#8C0027]/50 flex items-center justify-center shadow-inner" title="Cassette Shell Screw">
            <div className="w-2 h-[1px] bg-[#8C0027]/80 rotate-60" />
            <div className="h-2 w-[1px] bg-[#8C0027]/80 -rotate-30 absolute" />
          </div>

          {/* Deck Top Header: Deck Brand & Status LED */}
          <div className="w-full flex items-center justify-between border-b-2 border-[#8C0027]/20 pb-2 font-mono text-[11px] sm:text-xs text-[#8C0027]">
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

            {/* Vintage Cassette Sub-Labels */}
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold border border-[#8C0027]/40 bg-[#8C0027]/5">
                SIDE A
              </span>
              <span className="tracking-wider text-[10px] opacity-75 font-mono hidden sm:inline">
                TYPE II · CrO2
              </span>
            </div>
          </div>

          {/* Tape Cassette Window */}
          <div
            className="relative w-full border-2 border-[#8C0027] rounded-2xl p-4 sm:p-5 flex flex-col items-center overflow-hidden"
            style={{ backgroundColor: LOADER_CONFIG.tapeWindowBg }}
          >
            {/* Guide Ruler Behind Tape */}
            <div className="w-full flex justify-between px-2 mb-1.5 text-[9px] font-mono text-[#8C0027]/50 tracking-widest font-semibold">
              <span>| 100</span>
              <span className="text-[8px] uppercase tracking-[0.2em] opacity-60">◄◄ REW · PLAY ▶ · FF ▶▶</span>
              <span>0 |</span>
            </div>

            {/* Central Spools & Wordmark Area */}
            <div className="relative w-full flex items-center justify-between px-2 sm:px-4 my-1">
              {/* Left Supply Reel (Starts full of dark magnetic tape) */}
              <CassetteSpool
                spoolRef={leftSpoolRef}
                tapePackRef={leftTapePackRef}
                tapeRingRef={leftTapeRingRef}
                initialRadius={44}
                className="w-14 h-14 sm:w-16 sm:h-16 will-change-transform shrink-0"
              />

              {/* Center Magnetic Tape Track & Inspection Window */}
              <div className="relative flex-1 mx-2 sm:mx-3 h-8 flex items-center justify-center">
                {/* Magnetic tape ribbon track */}
                <div className="absolute inset-x-0 h-4 bg-[#2B0A14] rounded-sm overflow-hidden flex items-center shadow-inner border-y border-[#6B1327]/60">
                  {/* Dynamic tape oxide traveling stream */}
                  <div
                    ref={tapeRibbonRef}
                    className="w-[300%] h-full shrink-0 opacity-40"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(245,238,222,0.3) 5px, rgba(245,238,222,0.3) 8px)",
                    }}
                  />
                </div>

                {/* Classic Cassette Window Gauge Level: 100 · 50 · 0 */}
                <div className="relative z-10 flex items-center justify-between w-full px-2 text-[9px] font-mono text-[#F5EEDE]/80 font-bold select-none pointer-events-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                  <span>100</span>
                  <div className="flex gap-1 items-center opacity-70">
                    <span className="w-0.5 h-1.5 bg-[#F5EEDE]" />
                    <span className="w-0.5 h-1 bg-[#F5EEDE]" />
                    <span className="w-0.5 h-2.5 bg-[#F5EEDE]" />
                    <span className="w-0.5 h-1 bg-[#F5EEDE]" />
                    <span className="w-0.5 h-1.5 bg-[#F5EEDE]" />
                  </div>
                  <span>50</span>
                  <div className="flex gap-1 items-center opacity-70">
                    <span className="w-0.5 h-1.5 bg-[#F5EEDE]" />
                    <span className="w-0.5 h-1 bg-[#F5EEDE]" />
                    <span className="w-0.5 h-2.5 bg-[#F5EEDE]" />
                    <span className="w-0.5 h-1 bg-[#F5EEDE]" />
                    <span className="w-0.5 h-1.5 bg-[#F5EEDE]" />
                  </div>
                  <span>0</span>
                </div>
              </div>

              {/* Right Take-Up Reel (Starts empty, gathers dark magnetic tape) */}
              <CassetteSpool
                spoolRef={rightSpoolRef}
                tapePackRef={rightTapePackRef}
                tapeRingRef={rightTapeRingRef}
                initialRadius={25}
                className="w-14 h-14 sm:w-16 sm:h-16 will-change-transform shrink-0"
              />
            </div>

            {/* Bottom Tape Head Trapezoid Well */}
            <div className="relative w-40 h-3 mt-2 flex items-center justify-center">
              <div
                className="w-full h-full bg-[#8C0027]/10 border-t border-[#8C0027]/30"
                style={{
                  clipPath: "polygon(12% 0%, 88% 0%, 100% 100%, 0% 100%)",
                }}
              />
              <div className="absolute w-6 h-1.5 bg-[#8C0027]/30 rounded-sm" />
            </div>
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
