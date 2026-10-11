"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

interface LoaderProps {
  onComplete?: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Lock body scroll while loader is visible
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Hard fallback safety timer: loader will NEVER get stuck
    const safetyTimer = setTimeout(() => {
      document.body.style.overflow = "";
      setIsDone(true);
      onComplete?.();
    }, 2400);

    return () => {
      document.body.style.overflow = prevOverflow;
      clearTimeout(safetyTimer);
    };
  }, [onComplete]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({
        onComplete: () => {
          setIsDone(true);
          document.body.style.overflow = "";
          onComplete?.();
        },
      });

      // ── Initial values ──────────────────────────────────────────
      gsap.set(containerRef.current, { yPercent: 0, opacity: 1 });
      gsap.set(logoRef.current, {
        opacity: 0,
        scale: 0.94,
        filter:
          "drop-shadow(-14px -6px 0px rgba(43,175,144,0.9)) drop-shadow(14px 6px 0px rgba(241,165,18,0.9)) drop-shadow(-3px 9px 0px rgba(221,65,17,0.8))",
      });
      gsap.set(statusRef.current, { opacity: 0, y: 10 });
      gsap.set(progressBarRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });

      // ── Phase 1: Logo & Retro Plates Appearance ─────────────────
      // Logo and status fade in with offset silkscreen plates
      tl.to(
        logoRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: "power2.out",
        },
        0.05
      ).to(
        statusRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        0.1
      );

      // Progress counter ticks up from 00% to 100%
      const counter = { val: 0 };
      tl.to(
        counter,
        {
          val: 100,
          duration: 0.9,
          ease: "power1.inOut",
          onUpdate: () => {
            if (progressTextRef.current) {
              const formatted = String(Math.floor(counter.val)).padStart(2, "0");
              progressTextRef.current.textContent = `${formatted}%`;
            }
          },
        },
        0.1
      );

      // Progress track fills
      tl.to(
        progressBarRef.current,
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power1.inOut",
        },
        0.1
      );

      // ── Phase 2: Registration Snap & Tactile Letterpress Press ──
      // The offset color plates converge into alignment
      tl.to(
        logoRef.current,
        {
          filter:
            "drop-shadow(0px 0px 0px rgba(43,175,144,0)) drop-shadow(0px 0px 0px rgba(241,165,18,0)) drop-shadow(0px 0px 0px rgba(221,65,17,0))",
          duration: 0.45,
          ease: "power3.inOut",
        },
        0.65
      ).to(
        logoRef.current,
        {
          scale: 1.03,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
        },
        0.9
      );

      // ── Phase 3: Hold & Curtain Wipe Exit ────────────────────────
      tl.to({}, { duration: 0.2 });

      // Fade out logo & status content
      tl.to([logoRef.current, statusRef.current], {
        opacity: 0,
        y: -14,
        duration: 0.3,
        ease: "power2.in",
      });

      // Lift the cream curtain up smoothly
      tl.to(
        containerRef.current,
        {
          yPercent: -100,
          duration: 0.7,
          ease: "power4.inOut",
        },
        "-=0.1"
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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden touch-none"
      style={{ backgroundColor: "#F5EEDE" }}
    >
      {/* Film grain layer */}
      <div
        className="grain-overlay opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4 max-w-lg w-full">
        {/* Real Logo with GSAP-animated Screen-Print Separation */}
        <div className="relative w-[240px] xs:w-[290px] sm:w-[360px] md:w-[420px] aspect-[1930/815] flex items-center justify-center mb-7">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={logoRef}
            src="/logo/gab_io_log/logl.png"
            alt="gab.io logo"
            className="w-full h-full object-contain pointer-events-none will-change-transform opacity-0"
          />
        </div>

        {/* Vintage Status & Typewriter Counter */}
        <div
          ref={statusRef}
          className="w-full max-w-[240px] xs:max-w-[280px] sm:max-w-[320px] flex flex-col items-center gap-2.5 opacity-0 will-change-transform"
        >
          <div className="w-full flex items-center justify-between text-xs sm:text-sm font-mono tracking-wider text-[#8C0027]">
            <span className="flex items-center gap-1.5 font-bold uppercase text-[11px] sm:text-xs">
              <span className="inline-block w-2 h-2 rounded-full bg-[#F1A512] animate-pulse" />
              Analog Studio
            </span>
            <span ref={progressTextRef} className="font-bold tabular-nums">
              00%
            </span>
          </div>

          {/* Retro Progress Track */}
          <div className="w-full h-1.5 bg-[#8C0027]/15 rounded-full overflow-hidden p-[1px]">
            <div
              ref={progressBarRef}
              className="h-full bg-[#8C0027] rounded-full will-change-transform"
            />
          </div>

          <p className="text-[10px] tracking-widest uppercase text-[#8C0027]/60 text-center font-mono mt-0.5">
            Deghne Gabriel Agana • 1970s Edition
          </p>
        </div>
      </div>

      {/* 5-Color Retro Ribbon on Bottom Curtain Lip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 flex w-full pointer-events-none"
        aria-hidden="true"
      >
        <div className="h-full flex-1 bg-[#2BAF90]" />
        <div className="h-full flex-1 bg-[#A1D4B1]" />
        <div className="h-full flex-1 bg-[#F1A512]" />
        <div className="h-full flex-1 bg-[#DD4111]" />
        <div className="h-full flex-1 bg-[#8C0027]" />
      </div>
    </aside>
  );
}
