"use client";

import React from "react";

/**
 * 70s / Modern Hardware Workbench Margin Art (Concept 2)
 * ─────────────────────────────────────────────────────────────
 * Decorative floating workbench & modder tools in the outer margins
 * of the Setup section (screens >= 1280px / xl).
 * 
 * Harmonizes with GiantContributionSquares while providing rich
 * context for the PC & peripheral hardware workbench.
 * 
 * - Zero interference with interactions (pointer-events-none, aria-hidden).
 * - Subtle retro line-art styling matching wine, mustard, teal & orange.
 * - Gentle floating micro-animation for an alive, premium feel.
 */

const PALETTE = {
  wine: "#8C0027",
  mustard: "#F1A512",
  teal: "#2BAF90",
  orange: "#DD4111",
  cream: "#FAF6EE",
};

/* ── 1. Soldering Iron with Coiled Cord & Stand ────────────── */
function SolderingIronSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Solder Spool Base */}
      <ellipse cx="40" cy="115" rx="24" ry="10" stroke={PALETTE.wine} strokeWidth="2" />
      <ellipse cx="40" cy="110" rx="24" ry="10" fill={PALETTE.mustard} fillOpacity="0.25" stroke={PALETTE.wine} strokeWidth="2" />
      <path d="M16 110v5c0 5.5 10.7 10 24 10s24-4.5 24-10v-5" stroke={PALETTE.wine} strokeWidth="2" />
      <ellipse cx="40" cy="110" rx="10" ry="4" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="1.5" />
      {/* Solder Wire strand */}
      <path d="M56 112 C75 110, 85 95, 78 78 C72 65, 88 50, 96 46" stroke={PALETTE.teal} strokeWidth="1.8" strokeDasharray="3 2" />

      {/* Soldering Pencil (Angled at 45°) */}
      <g transform="rotate(-38 90 70)">
        {/* Rubber Grip with ridges */}
        <rect x="70" y="58" width="46" height="18" rx="4" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="2.2" />
        <line x1="78" y1="58" x2="78" y2="76" stroke={PALETTE.wine} strokeWidth="1.5" opacity="0.6" />
        <line x1="84" y1="58" x2="84" y2="76" stroke={PALETTE.wine} strokeWidth="1.5" opacity="0.6" />
        <line x1="90" y1="58" x2="90" y2="76" stroke={PALETTE.wine} strokeWidth="1.5" opacity="0.6" />
        <line x1="96" y1="58" x2="96" y2="76" stroke={PALETTE.wine} strokeWidth="1.5" opacity="0.6" />
        <line x1="102" y1="58" x2="102" y2="76" stroke={PALETTE.wine} strokeWidth="1.5" opacity="0.6" />

        {/* Metal Flange Collar */}
        <path d="M116 61h6v12h-6z" fill={PALETTE.mustard} fillOpacity="0.5" stroke={PALETTE.wine} strokeWidth="2" />
        {/* Stainless Heating Barrel */}
        <rect x="122" y="63" width="28" height="8" rx="1.5" stroke={PALETTE.wine} strokeWidth="2" />
        <circle cx="127" cy="67" r="1.5" fill={PALETTE.wine} />
        <circle cx="135" cy="67" r="1.5" fill={PALETTE.wine} />
        {/* Chisel Tip with Heat Glow */}
        <polygon points="150,64 162,66 162,68 150,70" fill={PALETTE.orange} fillOpacity="0.6" stroke={PALETTE.wine} strokeWidth="1.8" />

        {/* Cord coming out rear */}
        <path d="M70 67 C55 67, 45 78, 30 75 C18 72, 10 85, 2 95" stroke={PALETTE.wine} strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* Tiny Heat shimmer waves */}
      <path d="M125 15 Q129 10 126 5" stroke={PALETTE.orange} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M131 18 Q135 13 132 8" stroke={PALETTE.orange} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

/* ── 2. Thermal Compound Syringe & Paddle Spreader ─────────── */
function ThermalPasteSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 100"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="rotate(-15 65 50)">
        {/* Plunger Handle & Stem */}
        <ellipse cx="14" cy="50" rx="3" ry="12" stroke={PALETTE.wine} strokeWidth="2" />
        <rect x="14" y="47" width="24" height="6" stroke={PALETTE.wine} strokeWidth="2" fill={PALETTE.cream} />
        {/* Plunger Rubber Seal */}
        <rect x="36" y="42" width="6" height="16" rx="1" fill={PALETTE.wine} />

        {/* Syringe Body / Barrel */}
        <rect x="40" y="40" width="58" height="20" rx="3" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="2.2" />
        {/* Thermal compound fill */}
        <rect x="44" y="43" width="38" height="14" rx="2" fill={PALETTE.teal} fillOpacity="0.3" />
        {/* Measurement graduation markings */}
        <line x1="50" y1="40" x2="50" y2="46" stroke={PALETTE.wine} strokeWidth="1.5" />
        <line x1="58" y1="40" x2="58" y2="49" stroke={PALETTE.wine} strokeWidth="1.5" />
        <line x1="66" y1="40" x2="66" y2="46" stroke={PALETTE.wine} strokeWidth="1.5" />
        <line x1="74" y1="40" x2="74" y2="49" stroke={PALETTE.wine} strokeWidth="1.5" />
        <line x1="82" y1="40" x2="82" y2="46" stroke={PALETTE.wine} strokeWidth="1.5" />

        {/* Syringe Luer Neck & Dispensing Needle */}
        <path d="M98 46h8v8h-8z" fill={PALETTE.mustard} fillOpacity="0.4" stroke={PALETTE.wine} strokeWidth="1.8" />
        <path d="M106 48.5h18v3h-18z" stroke={PALETTE.wine} strokeWidth="1.8" fill={PALETTE.cream} />
        {/* Compound drop at tip */}
        <circle cx="127" cy="50" r="2.5" fill={PALETTE.teal} stroke={PALETTE.wine} strokeWidth="1.2" />
      </g>

      {/* Mini silicone thermal paste spreader spatula */}
      <g transform="translate(18, 5)">
        <path
          d="M75 75 L108 58 C112 56, 116 58, 118 62 L120 68 C121 72, 118 76, 114 78 L85 92 Z"
          fill={PALETTE.mustard}
          fillOpacity="0.25"
          stroke={PALETTE.wine}
          strokeWidth="1.8"
        />
        <line x1="82" y1="78" x2="114" y2="64" stroke={PALETTE.wine} strokeWidth="1.5" opacity="0.6" />
      </g>
    </svg>
  );
}

/* ── 3. Anti-Static ESD Ground Clamp & Curly Cord ───────────── */
function EsdClampSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 130"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ESD Warning Emblem Badge */}
      <g transform="translate(15, 12)">
        <polygon
          points="25,5 48,45 2,45"
          fill={PALETTE.mustard}
          fillOpacity="0.28"
          stroke={PALETTE.wine}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Reaching Hand & Lightning */}
        <path d="M22 22 L27 22 L24 30 L28 30 L22 41 L24 33 L20 33 Z" fill={PALETTE.wine} />
      </g>

      {/* Curly Spiraling Ground Wire */}
      <path
        d="M48 55 C65 52, 65 70, 50 72 C35 74, 38 90, 55 90 C72 90, 72 106, 56 108"
        stroke={PALETTE.teal}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Heavy Alligator Clip */}
      <g transform="translate(56, 92) rotate(-18)">
        {/* Upper Serrated Jaw */}
        <path d="M12 12 L38 6 L44 9 L42 16 L28 16 L12 16 Z" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="2" />
        {/* Teeth */}
        <path d="M24 16 L26 13 L28 16 L30 13 L32 16 L34 13 L36 16" stroke={PALETTE.wine} strokeWidth="1.5" />
        {/* Lower Jaw */}
        <path d="M12 24 L38 30 L44 27 L42 20 L28 20 L12 20 Z" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="2" />
        {/* Teeth */}
        <path d="M24 20 L26 23 L28 20 L30 23 L32 20 L34 23 L36 20" stroke={PALETTE.wine} strokeWidth="1.5" />
        {/* Pivot Bolt Spring */}
        <circle cx="16" cy="18" r="4.5" fill={PALETTE.mustard} stroke={PALETTE.wine} strokeWidth="2" />
        {/* Rubber Insulator Sleeve */}
        <rect x="0" y="13" width="12" height="10" rx="2" fill={PALETTE.orange} fillOpacity="0.7" stroke={PALETTE.wine} strokeWidth="1.8" />
      </g>
    </svg>
  );
}

/* ── 4. Precision Diagonal Flush Cutters ─────────────────────── */
function WireCuttersSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 130"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="rotate(22 65 65)">
        {/* Left Curved Ergonomic Handle */}
        <path
          d="M58 55 C52 75, 34 100, 24 116 C20 122, 26 126, 32 122 C44 108, 62 82, 65 58 Z"
          fill={PALETTE.orange}
          fillOpacity="0.3"
          stroke={PALETTE.wine}
          strokeWidth="2.2"
        />
        {/* Right Curved Ergonomic Handle */}
        <path
          d="M72 55 C78 75, 96 100, 106 116 C110 122, 104 126, 98 122 C86 108, 68 82, 65 58 Z"
          fill={PALETTE.orange}
          fillOpacity="0.3"
          stroke={PALETTE.wine}
          strokeWidth="2.2"
        />

        {/* Center Pivot Hub */}
        <circle cx="65" cy="54" r="9" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="2.2" />
        <circle cx="65" cy="54" r="4" fill={PALETTE.mustard} stroke={PALETTE.wine} strokeWidth="1.8" />

        {/* Left Cutting Blade (Hardened Chisel Ground) */}
        <path d="M59 47 L63 20 C64 16, 68 18, 68 22 L65 47 Z" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="2.2" />
        {/* Right Cutting Blade */}
        <path d="M71 47 L67 20 C66 16, 62 18, 62 22 L65 47 Z" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="2.2" />

        {/* Internal Return Spring coil */}
        <path d="M60 66 C63 68, 67 68, 70 66" stroke={PALETTE.wine} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ── 5. Digital Vernier Caliper ─────────────────────────────── */
function DigitalCaliperSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 170 90"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="rotate(-6 85 45)">
        {/* Main Stainless Ruler Beam */}
        <rect x="25" y="36" width="135" height="14" rx="1.5" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="2.2" />

        {/* Millimeter Graduation Ticks on beam */}
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={i}
            x1={45 + i * 5}
            y1={36}
            x2={45 + i * 5}
            y2={i % 5 === 0 ? 44 : 40}
            stroke={PALETTE.wine}
            strokeWidth="1.2"
          />
        ))}

        {/* Fixed Outer Jaw (Left) */}
        <path
          d="M25 36 L25 15 C25 13, 22 13, 20 16 L12 36 L12 78 C12 82, 17 83, 19 79 L25 50 Z"
          fill={PALETTE.cream}
          stroke={PALETTE.wine}
          strokeWidth="2.2"
        />

        {/* Sliding Measurement Unit */}
        <g transform="translate(68, 0)">
          {/* Slider Outer Body */}
          <rect x="0" y="28" width="48" height="30" rx="3" fill={PALETTE.mustard} fillOpacity="0.25" stroke={PALETTE.wine} strokeWidth="2.2" />

          {/* Digital LCD Window */}
          <rect x="8" y="33" width="32" height="15" rx="2" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="1.6" />
          <text
            x="24"
            y="44"
            fill={PALETTE.wine}
            fontSize="8.5"
            fontWeight="bold"
            fontFamily="monospace"
            textAnchor="middle"
          >
            24.00
          </text>
          <text x="36" y="44" fill={PALETTE.teal} fontSize="4.5" fontWeight="bold" fontFamily="monospace">
            mm
          </text>

          {/* Thumb Roll Wheel & Locking Screw */}
          <circle cx="48" cy="48" r="3.5" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="1.8" />
          <rect x="20" y="23" width="8" height="5" rx="1" fill={PALETTE.wine} />

          {/* Sliding Lower Jaw */}
          <path
            d="M0 50 L0 78 C0 82, 5 83, 7 79 L14 58 L14 50 Z"
            fill={PALETTE.cream}
            stroke={PALETTE.wine}
            strokeWidth="2.2"
          />
        </g>
      </g>
    </svg>
  );
}

/* ── 6. Precision Aluminum Screwdriver & Torx Bits ───────────── */
function PrecisionScrewdriverSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 110 150"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="rotate(18 55 75)">
        {/* Rotating Smooth Palm Cap */}
        <ellipse cx="55" cy="14" rx="13" ry="5" fill={PALETTE.teal} fillOpacity="0.4" stroke={PALETTE.wine} strokeWidth="2.2" />
        <rect x="47" y="14" width="16" height="6" stroke={PALETTE.wine} strokeWidth="2" fill={PALETTE.cream} />

        {/* Fluted / Knurled Aluminum Body */}
        <rect x="45" y="20" width="20" height="55" rx="3" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="2.2" />
        {/* Grip Texture lines */}
        <line x1="49" y1="26" x2="49" y2="68" stroke={PALETTE.wine} strokeWidth="1.4" opacity="0.5" />
        <line x1="55" y1="26" x2="55" y2="68" stroke={PALETTE.wine} strokeWidth="1.4" opacity="0.5" />
        <line x1="61" y1="26" x2="61" y2="68" stroke={PALETTE.wine} strokeWidth="1.4" opacity="0.5" />
        {/* Colored brand ring accent */}
        <rect x="45" y="44" width="20" height="6" fill={PALETTE.mustard} fillOpacity="0.5" stroke={PALETTE.wine} strokeWidth="1.5" />

        {/* Chuck / Collet */}
        <path d="M49 75 L61 75 L58 87 L52 87 Z" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="2" />

        {/* Slender Hardened Steel Shaft */}
        <rect x="53.5" y="87" width="3" height="34" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="1.8" />

        {/* Micro Torx/Star Bit Tip */}
        <polygon points="53,121 57,121 56,128 54,128" fill={PALETTE.wine} />
        {/* Magnetic flux arc lines */}
        <path d="M47 125 C45 127, 45 130, 48 132" stroke={PALETTE.teal} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M63 125 C65 127, 65 130, 62 132" stroke={PALETTE.teal} strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* Floating Spare Hex Bits */}
      <g transform="translate(14, 85) rotate(-12)">
        <polygon points="6,2 14,2 17,7 17,24 14,28 6,28 3,24 3,7" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="1.8" />
        <text x="10" y="18" fill={PALETTE.wine} fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          T5
        </text>
      </g>
      <g transform="translate(78, 100) rotate(14)">
        <polygon points="6,2 14,2 17,7 17,24 14,28 6,28 3,24 3,7" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="1.8" />
        <text x="10" y="18" fill={PALETTE.wine} fontSize="5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
          PH0
        </text>
      </g>
    </svg>
  );
}

/* ── 7. Retro DIP-16 Microchip with Pinout Labels ───────────── */
function MicrochipSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 110"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="rotate(12 65 55)">
        {/* DIP IC Ceramic Package Body */}
        <rect x="25" y="24" width="80" height="52" rx="4" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="2.2" />

        {/* Index Half-Circle Notch on Left */}
        <path d="M25 45 C29 45, 32 47, 32 50 C32 53, 29 55, 25 55" stroke={PALETTE.wine} strokeWidth="2" fill={PALETTE.mustard} fillOpacity="0.4" />
        {/* Pin 1 orientation dot */}
        <circle cx="34" cy="34" r="2.2" fill={PALETTE.orange} />

        {/* Top Metallic Leads (8 pins) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={`top-${i}`}
            x={33 + i * 8.5}
            y={14}
            width="4.5"
            height="10"
            rx="1"
            fill={PALETTE.mustard}
            fillOpacity="0.3"
            stroke={PALETTE.wine}
            strokeWidth="1.6"
          />
        ))}

        {/* Bottom Metallic Leads (8 pins) */}
        {Array.from({ length: 8 }).map((_, i) => (
          <rect
            key={`bot-${i}`}
            x={33 + i * 8.5}
            y={76}
            width="4.5"
            height="10"
            rx="1"
            fill={PALETTE.mustard}
            fillOpacity="0.3"
            stroke={PALETTE.wine}
            strokeWidth="1.6"
          />
        ))}

        {/* Stenciled Specification Typography */}
        <rect x="42" y="35" width="46" height="28" rx="2" stroke={PALETTE.wine} strokeWidth="1.2" strokeDasharray="3 2" fill={PALETTE.teal} fillOpacity="0.12" />
        <text
          x="65"
          y="46"
          fill={PALETTE.wine}
          fontSize="7"
          fontWeight="900"
          fontFamily="monospace"
          textAnchor="middle"
          letterSpacing="0.08em"
        >
          GAB-SPEC
        </text>
        <text
          x="65"
          y="56"
          fill={PALETTE.wine}
          fontSize="6"
          fontWeight="bold"
          fontFamily="monospace"
          textAnchor="middle"
          opacity="0.8"
        >
          MOD // 2026
        </text>
      </g>
    </svg>
  );
}

/* ── 8. Nylon Zip Cable Ties & Bundle ───────────────────────── */
function CableTiesSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Looped Zip-Tie */}
      <g transform="translate(10, 10)">
        {/* Large Loop */}
        <ellipse
          cx="50"
          cy="48"
          rx="36"
          ry="30"
          stroke={PALETTE.wine}
          strokeWidth="2.2"
          fill="none"
        />
        {/* Serrated Ladder Racks */}
        <ellipse
          cx="50"
          cy="48"
          rx="32"
          ry="26"
          stroke={PALETTE.wine}
          strokeWidth="1.5"
          strokeDasharray="2 3"
          opacity="0.6"
        />

        {/* Ratchet Head Block */}
        <rect x="76" y="28" width="14" height="10" rx="2" fill={PALETTE.mustard} fillOpacity="0.4" stroke={PALETTE.wine} strokeWidth="2" />
        <rect x="80" y="31" width="6" height="4" fill={PALETTE.wine} />

        {/* Tapered Tail trailing off */}
        <path
          d="M86 38 C94 48, 98 68, 92 84 C88 92, 78 98, 68 100"
          stroke={PALETTE.wine}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </g>

      {/* Second Straight Cable Tie */}
      <g transform="translate(20, 75) rotate(-35)">
        <rect x="0" y="0" width="10" height="7" rx="1.5" fill={PALETTE.orange} fillOpacity="0.4" stroke={PALETTE.wine} strokeWidth="1.8" />
        <rect x="10" y="2" width="60" height="3" rx="1" fill={PALETTE.cream} stroke={PALETTE.wine} strokeWidth="1.6" />
        <line x1="14" y1="2" x2="66" y2="2" stroke={PALETTE.wine} strokeWidth="1.2" strokeDasharray="1.5 2" />
      </g>
    </svg>
  );
}

/* ── Tool Items Positioning Config ──────────────────────────── */
interface MarginItem {
  id: string;
  side: "left" | "right";
  top: number;
  offsetFromCenter: number; // Distance in px from screen center 50%
  Component: React.ComponentType<{ className?: string }>;
  animationDelay: string;
  tilt: string;
}

const MARGIN_TOOLS: MarginItem[] = [
  // ── LEFT MARGIN (Workshop Soldering & Modding) ──────────────
  {
    id: "tool-solder",
    side: "left",
    top: 75,
    offsetFromCenter: 640,
    Component: SolderingIronSvg,
    animationDelay: "0s",
    tilt: "hover:rotate-3",
  },
  {
    id: "tool-paste",
    side: "left",
    top: 255,
    offsetFromCenter: 610,
    Component: ThermalPasteSvg,
    animationDelay: "1.2s",
    tilt: "hover:-rotate-3",
  },
  {
    id: "tool-esd",
    side: "left",
    top: 435,
    offsetFromCenter: 635,
    Component: EsdClampSvg,
    animationDelay: "2.4s",
    tilt: "hover:rotate-2",
  },
  {
    id: "tool-cutters",
    side: "left",
    top: 595,
    offsetFromCenter: 615,
    Component: WireCuttersSvg,
    animationDelay: "3.6s",
    tilt: "hover:-rotate-4",
  },

  // ── RIGHT MARGIN (Precision Measuring & Assembly) ───────────
  {
    id: "tool-caliper",
    side: "right",
    top: 70,
    offsetFromCenter: 630,
    Component: DigitalCaliperSvg,
    animationDelay: "0.6s",
    tilt: "hover:-rotate-2",
  },
  {
    id: "tool-driver",
    side: "right",
    top: 245,
    offsetFromCenter: 610,
    Component: PrecisionScrewdriverSvg,
    animationDelay: "1.8s",
    tilt: "hover:rotate-4",
  },
  {
    id: "tool-chip",
    side: "right",
    top: 425,
    offsetFromCenter: 630,
    Component: MicrochipSvg,
    animationDelay: "3.0s",
    tilt: "hover:-rotate-3",
  },
  {
    id: "tool-ties",
    side: "right",
    top: 585,
    offsetFromCenter: 615,
    Component: CableTiesSvg,
    animationDelay: "4.2s",
    tilt: "hover:rotate-3",
  },
];

export default function SetupMarginArt() {
  return (
    <>
      {/* Keyframe animation for subtle organic breathing float */}
      <style jsx global>{`
        @keyframes workbenchFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .workbench-float-item {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="hidden xl:block absolute inset-0 pointer-events-none select-none z-0 overflow-x-clip"
        aria-hidden="true"
      >
        {MARGIN_TOOLS.map((tool) => {
          const ToolComponent = tool.Component;
          return (
            <div
              key={tool.id}
              className="absolute transition-transform duration-300 ease-out pointer-events-auto group cursor-default"
              style={{
                top: `${tool.top}px`,
                left: tool.side === "left" ? `calc(50% - ${tool.offsetFromCenter}px)` : undefined,
                right: tool.side === "right" ? `calc(50% - ${tool.offsetFromCenter}px)` : undefined,
              }}
            >
              <div
                className="workbench-float-item transition-all duration-300"
                style={{
                  animation: `workbenchFloat 6.5s ease-in-out infinite`,
                  animationDelay: tool.animationDelay,
                }}
              >
                <div
                  className={`
                    w-28 h-28 xl:w-32 xl:h-32 2xl:w-36 2xl:h-36
                    opacity-25 hover:opacity-85
                    transition-all duration-300
                    filter drop-shadow-[0_2px_4px_rgba(140,0,39,0.08)]
                    ${tool.tilt}
                  `}
                >
                  <ToolComponent className="w-full h-full" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
