"use client";

import React from "react";

/**
 * Retro Hardware Bus Ribbon Cable Bridge (Concept 2)
 * ─────────────────────────────────────────────────────────────
 * Connects the software calendar (GitHub Contributions) above to
 * the hardware pegboard (Setup) below.
 *
 * Visual Anatomy:
 * - Dual authentic 16-conductor flat ribbon cables (Left: Data Bus, Right: Power/Control Bus).
 * - Distinctive Pin-1 indicator stripes (Orange on Left, Teal on Right).
 * - Industrial IDC-40 socket clamps with strain relief and solder rivet dots.
 * - Center retro bus telemetry badge ("BUS: CODE ➔ SILICON").
 * - Animated data pulse traveling down the conductors.
 */

const PALETTE = {
  wine: "#8C0027",
  mustard: "#F1A512",
  teal: "#2BAF90",
  orange: "#DD4111",
  cream: "#FAF6EE",
  cableBody: "#EAE3D2",
  cableGroove: "rgba(140, 0, 39, 0.22)",
};

interface RibbonCableProps {
  label: string;
  pin1Color: string;
  clampSpec: string;
  reversePin1?: boolean;
}

function RibbonCable({
  label,
  pin1Color,
  clampSpec,
  reversePin1 = false,
}: RibbonCableProps) {
  // 16 parallel conductors
  const conductors = Array.from({ length: 16 });

  return (
    <div className="relative flex flex-col items-center w-16 md:w-20 h-full group select-none">
      {/* ── TOP IDC CONNECTOR CLAMP (Plugs to GitHub Card) ── */}
      <div
        className="
          relative z-20 w-[112%] h-4.5
          bg-wine rounded-t-sm
          border-2 border-wine
          shadow-[0_2px_4px_rgba(0,0,0,0.18)]
          flex items-center justify-between px-1.5
          -mt-1
        "
      >
        {/* Strain relief bar */}
        <div className="w-2 h-1.5 rounded-full bg-cream/70" />
        <span
          className="text-[7.5px] md:text-[8.5px] font-mono font-bold tracking-widest text-cream uppercase"
          style={{ fontFamily: "monospace" }}
        >
          {label}
        </span>
        <div className="w-2 h-1.5 rounded-full bg-cream/70" />
      </div>

      {/* ── THE 16-CONDUCTOR FLAT RIBBON BODY ── */}
      <div
        className="
          relative z-10 w-full flex-1
          flex overflow-hidden
          border-x-2 border-wine
          shadow-[3px_0_0_0_#8C0027]
          bg-[#EAE3D2]
        "
      >
        {conductors.map((_, idx) => {
          const isPin1 = reversePin1 ? idx === conductors.length - 1 : idx === 0;
          return (
            <div
              key={idx}
              className="relative flex-1 h-full border-r last:border-r-0"
              style={{
                backgroundColor: isPin1 ? pin1Color : PALETTE.cableBody,
                borderColor: PALETTE.cableGroove,
              }}
            >
              {/* Subtle metallic ridge highlight inside each wire */}
              <div
                className="absolute inset-y-0 left-0 w-[40%] pointer-events-none opacity-40"
                style={{
                  background:
                    "linear-gradient(to right, rgba(255,255,255,0.7), transparent)",
                }}
              />
            </div>
          );
        })}

        {/* Data transmission pulse light scanning down the cable */}
        <div
          className="
            absolute inset-x-0 h-6 pointer-events-none
            opacity-0 group-hover:opacity-100 transition-opacity duration-300
            data-pulse-glow
          "
          style={{
            background: `linear-gradient(to bottom, transparent, ${pin1Color}55, transparent)`,
          }}
        />
      </div>

      {/* ── MID-CABLE FERRITE RETENTION CLAMP ── */}
      <div
        className="
          absolute top-1/2 -translate-y-1/2 z-20
          px-1.5 py-0.5
          bg-mustard border-2 border-wine rounded
          shadow-[2px_2px_0_0_#8C0027]
          text-[7px] md:text-[8px] font-mono font-black text-wine
          whitespace-nowrap tracking-tight
          transition-transform duration-200 group-hover:scale-105
        "
      >
        {clampSpec}
      </div>

      {/* ── BOTTOM IDC CONNECTOR CLAMP (Plugs to Setup Pegboard) ── */}
      <div
        className="
          relative z-20 w-[112%] h-4.5
          bg-wine rounded-b-sm
          border-2 border-wine
          shadow-[0_2px_4px_rgba(0,0,0,0.18)]
          flex items-center justify-between px-1.5
          -mb-1
        "
      >
        {/* Brass mounting screw washers */}
        <div className="w-2.5 h-2.5 rounded-full bg-mustard border border-wine/60 flex items-center justify-center">
          <div className="w-1 h-0.5 bg-wine" />
        </div>
        <span
          className="text-[7.5px] md:text-[8.5px] font-mono font-bold tracking-widest text-cream uppercase"
          style={{ fontFamily: "monospace" }}
        >
          HEADER
        </span>
        <div className="w-2.5 h-2.5 rounded-full bg-mustard border border-wine/60 flex items-center justify-center">
          <div className="w-1 h-0.5 bg-wine" />
        </div>
      </div>
    </div>
  );
}

export default function RibbonCableBridge() {
  return (
    <section
      aria-hidden="true"
      className="relative z-25 w-full overflow-hidden select-none"
    >
      {/* Pulse keyframe for subtle live transmission data lines */}
      <style jsx global>{`
        @keyframes cableDataPulse {
          0% {
            top: -24px;
          }
          100% {
            top: 100%;
          }
        }
        .data-pulse-glow {
          animation: cableDataPulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .data-pulse-glow {
            animation: none !important;
          }
        }
      `}</style>

      <div className="relative mx-auto max-w-5xl w-full h-20 md:h-24 px-6 md:px-8 flex items-center justify-center">
        {/* Left Ribbon Cable (IDE Data Bus) */}
        <div className="absolute left-10 sm:left-24 md:left-32 lg:left-40 top-0 bottom-0 flex items-center">
          <RibbonCable
            label="J1·BUS"
            pin1Color={PALETTE.orange}
            clampSpec="40-PIN // 33MHz"
          />
        </div>

        {/* Center Architectural Bus Label / Status Pill */}
        <div className="relative z-30 flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full border-2 border-wine bg-[#FAF6EE] shadow-[3px_3px_0_0_#8C0027]">
          {/* Pulsing signal LED */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
          </span>

          <span
            className="text-[9.5px] sm:text-xs md:text-sm font-bold tracking-wider text-wine uppercase"
            style={{ fontFamily: "var(--font-body)" }}
          >
            CODE <span className="text-orange">➔</span> SILICON
          </span>

          <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-mustard/30 text-wine/80 font-bold">
            16-BIT BUS
          </span>

          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange" />
          </span>
        </div>

        {/* Right Ribbon Cable (GPIO Power / Aux Bus) */}
        <div className="absolute right-10 sm:right-24 md:right-32 lg:right-40 top-0 bottom-0 flex items-center">
          <RibbonCable
            label="J2·PWR"
            pin1Color={PALETTE.teal}
            clampSpec="BUS // 12V-GND"
            reversePin1
          />
        </div>

        {/* Subtle Horizontal Guide Wire behind the badge */}
        <div
          className="absolute inset-x-8 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-wine/25 pointer-events-none z-0"
        />
      </div>
    </section>
  );
}
