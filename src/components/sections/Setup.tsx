"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setupItems, SetupItem } from "@/data/setup";
import Setup3DLayer from "@/components/setup-3d/Setup3DLayer";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ───────────────────────────────────────────────────────────
   COMPACT RETRO WORKBENCH LINE ICONS (Fallback in wine)
   ─────────────────────────────────────────────────────────── */
function CpuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="13" y="13" width="22" height="22" rx="3" />
      <rect x="19" y="19" width="10" height="10" rx="1" />
      <line x1="18" y1="7" x2="18" y2="13" />
      <line x1="24" y1="7" x2="24" y2="13" />
      <line x1="30" y1="7" x2="30" y2="13" />
      <line x1="18" y1="35" x2="18" y2="41" />
      <line x1="24" y1="35" x2="24" y2="41" />
      <line x1="30" y1="35" x2="30" y2="41" />
      <line x1="7" y1="18" x2="13" y2="18" />
      <line x1="7" y1="24" x2="13" y2="24" />
      <line x1="7" y1="30" x2="13" y2="30" />
      <line x1="35" y1="18" x2="41" y2="18" />
      <line x1="35" y1="24" x2="41" y2="24" />
      <line x1="35" y1="30" x2="41" y2="30" />
    </svg>
  );
}

function GpuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="8" y="12" width="34" height="22" rx="3" />
      <line x1="8" y1="8" x2="8" y2="38" />
      <line x1="6" y1="8" x2="8" y2="8" />
      <circle cx="19" cy="23" r="6" />
      <circle cx="31" cy="23" r="6" />
      <circle cx="19" cy="23" r="2" fill="currentColor" />
      <circle cx="31" cy="23" r="2" fill="currentColor" />
      <path d="M19 19v2M19 25v2M17 23h-2M23 23h-2" />
      <path d="M31 19v2M31 25v2M29 23h-2M35 23h-2" />
      <line x1="16" y1="34" x2="28" y2="34" strokeWidth="4" />
    </svg>
  );
}

function RamIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="15" width="36" height="18" rx="2" />
      <path d="M6 33h13l1.5-2.5h2l1.5 2.5h18" />
      <rect x="10" y="19" width="5" height="8" rx="1" fill="currentColor" fillOpacity="0.2" />
      <rect x="18" y="19" width="5" height="8" rx="1" fill="currentColor" fillOpacity="0.2" />
      <rect x="26" y="19" width="5" height="8" rx="1" fill="currentColor" fillOpacity="0.2" />
      <rect x="34" y="19" width="5" height="8" rx="1" fill="currentColor" fillOpacity="0.2" />
      <line x1="10" y1="31" x2="10" y2="33" />
      <line x1="14" y1="31" x2="14" y2="33" />
      <line x1="18" y1="31" x2="18" y2="33" />
      <line x1="30" y1="31" x2="30" y2="33" />
      <line x1="34" y1="31" x2="34" y2="33" />
      <line x1="38" y1="31" x2="38" y2="33" />
    </svg>
  );
}

function MonitorIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="8" width="36" height="24" rx="3" />
      <line x1="6" y1="26" x2="42" y2="26" />
      <path d="M21 32l-2 7h10l-2-7" />
      <line x1="14" y1="39" x2="34" y2="39" strokeWidth="3" />
    </svg>
  );
}

function KeyboardIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="12" width="36" height="24" rx="4" />
      <line x1="12" y1="18" x2="15" y2="18" strokeWidth="3" />
      <line x1="19" y1="18" x2="22" y2="18" strokeWidth="3" />
      <line x1="26" y1="18" x2="29" y2="18" strokeWidth="3" />
      <line x1="33" y1="18" x2="36" y2="18" strokeWidth="3" />
      <line x1="12" y1="24" x2="15" y2="24" strokeWidth="3" />
      <line x1="19" y1="24" x2="22" y2="24" strokeWidth="3" />
      <line x1="26" y1="24" x2="29" y2="24" strokeWidth="3" />
      <line x1="33" y1="24" x2="36" y2="24" strokeWidth="3" />
      <line x1="12" y1="30" x2="15" y2="30" strokeWidth="3" />
      <line x1="19" y1="30" x2="29" y2="30" strokeWidth="3" />
      <line x1="33" y1="30" x2="36" y2="30" strokeWidth="3" />
    </svg>
  );
}

function MouseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="14" y="8" width="20" height="32" rx="10" />
      <line x1="24" y1="8" x2="24" y2="20" />
      <rect x="22" y="13" width="4" height="7" rx="2" fill="currentColor" />
    </svg>
  );
}

function HeadphonesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 26V20a12 12 0 0 1 24 0v6" />
      <rect x="7" y="24" width="7" height="14" rx="3.5" fill="currentColor" fillOpacity="0.2" />
      <rect x="34" y="24" width="7" height="14" rx="3.5" fill="currentColor" fillOpacity="0.2" />
      <path d="M18 10a12 12 0 0 1 12 0" strokeWidth="4" />
    </svg>
  );
}

function MousepadIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="6" y="10" width="36" height="28" rx="4" />
      <rect
        x="9"
        y="13"
        width="30"
        height="22"
        rx="2.5"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <rect x="30" y="29" width="6" height="3" rx="1" fill="currentColor" />
    </svg>
  );
}

function HardwareIcon({
  category,
  className,
}: {
  category: SetupItem["category"];
  className?: string;
}) {
  switch (category) {
    case "CPU":
      return <CpuIcon className={className} />;
    case "GPU":
      return <GpuIcon className={className} />;
    case "RAM":
      return <RamIcon className={className} />;
    case "Monitor":
      return <MonitorIcon className={className} />;
    case "Keyboard":
      return <KeyboardIcon className={className} />;
    case "Mouse":
      return <MouseIcon className={className} />;
    case "Headphones":
      return <HeadphonesIcon className={className} />;
    case "Mousepad":
      return <MousepadIcon className={className} />;
    default:
      return <CpuIcon className={className} />;
  }
}

/* ───────────────────────────────────────────────────────────
   SLIM PEGBOARD HANGING ITEM (ZERO CARDS, COMPACT PROPORTIONS)
   ─────────────────────────────────────────────────────────── */
function CompactPegboardItem({
  item,
  index,
  isMouseSlot,
  slotRef,
  hideIcon,
}: {
  item: SetupItem;
  index: number;
  isMouseSlot?: boolean;
  slotRef?: React.Ref<HTMLDivElement>;
  hideIcon?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const gearRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);

  const leftMonitorRef = useRef<HTMLDivElement>(null);
  const rightMonitorRef = useRef<HTMLDivElement>(null);

  const formattedNo = `No. ${String(item.id).padStart(2, "0")}`;
  const isFirstRow = index < 4;

  const isWide =
    item.category === "Keyboard" ||
    item.category === "Monitor" ||
    item.category === "Mousepad";

  /* Individual hover physics for dual monitor setup */
  const handleLeftMonitorEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (leftMonitorRef.current) {
      gsap.killTweensOf(leftMonitorRef.current);
      gsap.to(leftMonitorRef.current, {
        y: -7,
        scale: 1.05,
        rotation: -2,
        filter: "drop-shadow(0 10px 14px rgba(140, 0, 39, 0.28))",
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleLeftMonitorLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (leftMonitorRef.current) {
      gsap.killTweensOf(leftMonitorRef.current);
      gsap.to(leftMonitorRef.current, {
        y: 0,
        scale: 1,
        rotation: 0,
        filter: "drop-shadow(0 4px 6px rgba(140, 0, 39, 0.16))",
        duration: 0.25,
        ease: "power3.out",
      });
    }
  };

  const handleRightMonitorEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (rightMonitorRef.current) {
      gsap.killTweensOf(rightMonitorRef.current);
      gsap.to(rightMonitorRef.current, {
        y: -7,
        scale: 1.05,
        rotation: 2,
        filter: "drop-shadow(0 10px 14px rgba(140, 0, 39, 0.28))",
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleRightMonitorLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (rightMonitorRef.current) {
      gsap.killTweensOf(rightMonitorRef.current);
      gsap.to(rightMonitorRef.current, {
        y: 0,
        scale: 1,
        rotation: 0,
        filter: "drop-shadow(0 4px 6px rgba(140, 0, 39, 0.16))",
        duration: 0.25,
        ease: "power3.out",
      });
    }
  };

  const handleMouseEnter = () => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      if (!item.dualImages && gearRef.current) gsap.to(gearRef.current, { y: -3, duration: 0.2 });
      return;
    }

    // If dualImages, don't move both monitors together — they lift 1-at-a-time on direct monitor hover!
    if (!item.dualImages && gearRef.current) {
      gsap.killTweensOf(gearRef.current);
      gsap
        .timeline()
        .to(gearRef.current, {
          rotation: 3,
          scale: 1.05,
          y: -4,
          filter: "drop-shadow(0 10px 10px rgba(140, 0, 39, 0.28))",
          duration: 0.18,
          ease: "power2.out",
        })
        .to(gearRef.current, {
          rotation: -2,
          duration: 0.2,
          ease: "power1.inOut",
        })
        .to(gearRef.current, {
          rotation: 0,
          scale: 1.03,
          duration: 0.22,
          ease: "elastic.out(1.2, 0.4)",
        });
    }

    if (tagRef.current) {
      gsap.killTweensOf(tagRef.current);
      gsap
        .timeline({ delay: 0.04 })
        .to(tagRef.current, { rotation: -2.5, y: -2, duration: 0.15, ease: "power2.out" })
        .to(tagRef.current, { rotation: 1.5, duration: 0.18, ease: "power1.inOut" })
        .to(tagRef.current, { rotation: 0, duration: 0.2, ease: "elastic.out(1.2, 0.4)" });
    }
  };

  const handleMouseLeave = () => {
    if (!item.dualImages && gearRef.current) {
      gsap.killTweensOf(gearRef.current);
      gsap.to(gearRef.current, {
        rotation: 0,
        scale: 1,
        y: 0,
        filter: "drop-shadow(0 6px 8px rgba(140, 0, 39, 0.18))",
        duration: 0.25,
        ease: "power3.out",
      });
    }
    if (tagRef.current) {
      gsap.killTweensOf(tagRef.current);
      gsap.to(tagRef.current, {
        rotation: 0,
        y: 0,
        duration: 0.25,
        ease: "power3.out",
      });
    }
  };

  const hasLink = Boolean(item.url && item.url.trim().length > 0);

  const content = (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      className="group/hanging relative w-full flex flex-col items-center select-none outline-none"
    >
      {/* ── 1. The Steel Pegboard Pin ── */}
      <div className="relative flex flex-col items-center z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-wine border border-wine/80 shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)] flex items-center justify-center">
          <div className="w-0.5 h-0.5 rounded-full bg-mustard" />
        </div>
        <div className="w-[2px] h-3 bg-wine/80 rounded-b-sm" />
      </div>

      {/* Twine between pin and gear with proper vertical breathing room */}
      <div className="w-[1px] h-2.5 border-l border-dashed border-wine/50 my-0.5" />

      {/* ── 2. Floating Hardware Gear (Compact Silhouette) ── */}
      <div
        ref={
          isMouseSlot
            ? (node) => {
                gearRef.current = node;
                if (typeof slotRef === "function") slotRef(node);
                else if (slotRef) (slotRef as any).current = node;
              }
            : gearRef
        }
        className={`relative flex items-center justify-center transition-opacity duration-300 ${
          item.dualImages
            ? "w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32"
            : isWide
            ? "w-36 h-20 sm:w-48 sm:h-28 md:w-56 md:h-32"
            : "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
        }`}
        style={{
          transformOrigin: "50% 0%",
          filter: item.dualImages ? "none" : "drop-shadow(0 6px 8px rgba(140, 0, 39, 0.18))",
          willChange: "transform, filter",
          opacity: isMouseSlot && hideIcon ? 0 : 1,
          pointerEvents: isMouseSlot && hideIcon ? "none" : undefined,
        }}
      >
        {/* Soft radial glow */}
        <div
          aria-hidden="true"
          className="absolute inset-1 rounded-full pointer-events-none opacity-40 group-hover/hanging:opacity-80 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle, rgba(241, 165, 18, 0.2) 0%, rgba(43, 175, 144, 0.1) 60%, transparent 75%)",
          }}
        />

        {item.dualImages ? (
          /* Dual Independent Monitors — side-by-side with individual 1-at-a-time hover physics */
          <div className="relative w-full h-full flex items-center justify-center gap-2 sm:gap-3 px-1">
            {/* Left Monitor */}
            <div
              ref={leftMonitorRef}
              onMouseEnter={handleLeftMonitorEnter}
              onMouseLeave={handleLeftMonitorLeave}
              className="relative flex-1 h-full flex items-center justify-center cursor-pointer select-none transition-transform"
              style={{
                transformOrigin: "50% 100%",
                filter: "drop-shadow(0 4px 6px rgba(140, 0, 39, 0.16))",
                willChange: "transform, filter",
              }}
              title={item.dualImages.leftAlt || "AOC 24G42E 180Hz (Left)"}
            >
              <div className="relative w-full h-full p-0.5">
                <Image
                  src={item.dualImages.left}
                  alt={item.dualImages.leftAlt || "AOC 24G42E 180Hz"}
                  fill
                  sizes="(max-width: 480px) 95px, (max-width: 768px) 115px, 135px"
                  className="object-contain"
                  priority={isFirstRow}
                  loading={isFirstRow ? undefined : "lazy"}
                />
              </div>
            </div>

            {/* Right Monitor */}
            <div
              ref={rightMonitorRef}
              onMouseEnter={handleRightMonitorEnter}
              onMouseLeave={handleRightMonitorLeave}
              className="relative flex-1 h-full flex items-center justify-center cursor-pointer select-none transition-transform"
              style={{
                transformOrigin: "50% 100%",
                filter: "drop-shadow(0 4px 6px rgba(140, 0, 39, 0.16))",
                willChange: "transform, filter",
              }}
              title={item.dualImages.rightAlt || "AOC 27G11ZE2 240Hz (Right)"}
            >
              <div className="relative w-full h-full p-0.5">
                <Image
                  src={item.dualImages.right}
                  alt={item.dualImages.rightAlt || "AOC 27G11ZE2 240Hz"}
                  fill
                  sizes="(max-width: 480px) 95px, (max-width: 768px) 115px, 135px"
                  className="object-contain"
                  priority={isFirstRow}
                  loading={isFirstRow ? undefined : "lazy"}
                />
              </div>
            </div>
          </div>
        ) : item.image && !imageFailed ? (
          <div
            className={`relative w-full h-full flex items-center justify-center ${
              isWide ? "p-0.5" : "p-1"
            }`}
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes={
                isWide
                  ? "(max-width: 480px) 160px, (max-width: 768px) 200px, 240px"
                  : "(max-width: 480px) 120px, (max-width: 768px) 140px, 160px"
              }
              className="object-contain"
              priority={isFirstRow}
              loading={isFirstRow ? undefined : "lazy"}
              onError={() => setImageFailed(true)}
            />
          </div>
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-dashed border-wine/40 bg-cream/70 flex items-center justify-center shadow-[2px_2px_0_0_#8C0027]">
            <HardwareIcon
              category={item.category}
              className="w-9 h-9 sm:w-11 sm:h-11 stroke-wine"
            />
          </div>
        )}
      </div>

      {/* ── 3. Short Twine String with clean vertical breathing room ── */}
      <div className="w-[1px] h-3 border-l border-dashed border-wine/50 my-1" />

      {/* ── 4. Compact Workshop Tag ── */}
      <div
        ref={tagRef}
        className="
          relative w-full max-w-[140px] sm:max-w-[160px]
          bg-[#FBF8F0] border-2 border-wine
          shadow-[3px_3px_0_0_#8C0027]
          px-2.5 py-2 text-left
          transition-transform duration-200
        "
        style={{
          transformOrigin: "50% 0%",
          clipPath:
            "polygon(8px 0%, calc(100% - 8px) 0%, 100% 8px, 100% 100%, 0% 100%, 0% 8px)",
          willChange: "transform",
        }}
      >
        {/* Brass Eyelet */}
        <div className="flex items-center justify-center mb-1">
          <div className="w-1.5 h-1.5 rounded-full border border-wine/80 bg-cream" />
        </div>

        {/* Tag Header */}
        <div className="flex items-center justify-between gap-1 pb-1 border-b border-dashed border-wine/25 mb-1">
          <span
            className="text-[9px] font-bold text-wine/75 font-mono"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {formattedNo}
          </span>
          <span
            className="text-[9px] px-1.5 py-0.2 bg-teal text-cream rounded-full border border-wine/30 font-bold"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {item.category}
          </span>
        </div>

        {/* Model Name */}
        <h3
          className="text-xs sm:text-sm text-wine font-normal leading-tight line-clamp-1"
          style={{ fontFamily: "var(--font-display)" }}
          title={item.name}
        >
          {item.name}
        </h3>

        {/* Specs List */}
        <ul
          className="mt-1 pt-1 border-t border-dashed border-wine/20 text-[10px] space-y-0.5 text-wine/80 font-medium"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {item.specs.map((spec, sIdx) => (
            <li key={sIdx} className="leading-tight flex items-start gap-1">
              <span className="text-teal font-bold select-none">•</span>
              <span className="line-clamp-1">{spec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <li role="listitem" className="compact-pegboard-item h-full flex flex-col justify-start">
      {hasLink ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-lg"
          aria-label={`${item.category}: ${item.name} (opens in a new tab)`}
        >
          {content}
        </a>
      ) : (
        <div
          tabIndex={0}
          role="region"
          aria-label={`${item.category}: ${item.name}`}
          className="block outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-lg"
        >
          {content}
        </div>
      )}
    </li>
  );
}

/* ───────────────────────────────────────────────────────────
   SLIM, COMPACT PEGBOARD SETUP SECTION
   ─────────────────────────────────────────────────────────── */
export default function Setup() {
  const containerRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const mouseSlotRef = useRef<HTMLDivElement>(null);
  const resetFnRef = useRef<(() => void) | null>(null);

  const [is3DActive, setIs3DActive] = useState(false);
  const [mousePos, setMousePos] = useState<{
    x: number;
    z: number;
    isDefault: boolean;
  } | null>(null);

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) return;

      const items = gsap.utils.toArray<HTMLElement>(".compact-pegboard-item");
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  const showManufacturerCredit = setupItems.some(
    (item) => item.source === "manufacturer" || item.image.startsWith("https://")
  );

  return (
    <section
      id="setup"
      ref={containerRef}
      aria-labelledby="setup-section-heading"
      className="relative z-30 w-full px-6 md:px-8 py-6 md:py-10 overflow-x-clip"
    >
      <div className="relative mx-auto max-w-5xl w-full">
        {/* ── Slim Perforated Pegboard Surface (Low-profile, no giant card) ── */}
        <div
          ref={boardRef}
          className="
            relative w-full
            bg-[#FAF6EE] border-3 border-wine rounded-2xl
            shadow-[5px_5px_0_0_#8C0027]
            px-4 py-5 sm:px-6 sm:py-7 md:px-8 md:py-8
            overflow-hidden
          "
        >
          {/* 3D Canvas Layer over the board */}
          <Setup3DLayer
            boardContainerRef={boardRef}
            mouseSlotRef={mouseSlotRef}
            onActiveStateChange={setIs3DActive}
            onResetReady={(fn) => {
              resetFnRef.current = fn;
            }}
            onMousePosChange={setMousePos}
          />

          {/* Subtle Pegboard Dot Matrix Pattern */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none opacity-15"
            style={{
              backgroundImage:
                "radial-gradient(#8C0027 1.5px, transparent 1.5px)",
              backgroundSize: "18px 18px",
              backgroundPosition: "9px 9px",
            }}
          />

          {/* Corner Washers */}
          <div
            aria-hidden="true"
            className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full border border-wine/60 bg-mustard flex items-center justify-center pointer-events-none"
          >
            <div className="w-1 h-0.5 bg-wine" />
          </div>
          <div
            aria-hidden="true"
            className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full border border-wine/60 bg-mustard flex items-center justify-center pointer-events-none"
          >
            <div className="w-1 h-0.5 bg-wine" />
          </div>
          <div
            aria-hidden="true"
            className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full border border-wine/60 bg-mustard flex items-center justify-center pointer-events-none"
          >
            <div className="w-1 h-0.5 bg-wine" />
          </div>
          <div
            aria-hidden="true"
            className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full border border-wine/60 bg-mustard flex items-center justify-center pointer-events-none"
          >
            <div className="w-1 h-0.5 bg-wine" />
          </div>

          {/* ── Compact Header ── */}
          <div className="relative z-10 text-left mb-6 sm:mb-8 border-b border-dashed border-wine/25 pb-3.5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <span
                className="inline-flex items-center text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-sm bg-mustard text-wine border border-wine mb-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                WORKBENCH GEAR
              </span>
              <h2
                id="setup-section-heading"
                className="text-3xl md:text-4xl text-wine leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Setup
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <p
                className="text-xs sm:text-sm text-wine/75"
                style={{ fontFamily: "var(--font-body)" }}
              >
                What I build and play on.
              </p>

              {is3DActive && (
                <button
                  type="button"
                  onClick={() => resetFnRef.current?.()}
                  className="text-xs uppercase font-bold text-wine/80 hover:text-wine underline underline-offset-2 transition-colors cursor-pointer ml-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Reset position
                </button>
              )}

              {process.env.NODE_ENV !== "production" && is3DActive && mousePos && (
                <span
                  className="text-[9px] font-mono text-wine/50 font-bold hidden sm:inline-block"
                  title="3D Mouse coordinates"
                >
                  [3D: {mousePos.x.toFixed(1)}, {mousePos.z.toFixed(1)}]
                </span>
              )}
            </div>
          </div>

          {/* ── 8 Hanging Items Grid (Tight & Proportioned) ── */}
          <ul
            role="list"
            aria-label="Hardware Setup Components"
            className="
              relative z-10
              grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
              gap-x-3 sm:gap-x-5 md:gap-x-6 gap-y-6 sm:gap-y-8
            "
          >
            {setupItems.map((item, index) => (
              <CompactPegboardItem
                key={item.id}
                item={item}
                index={index}
                isMouseSlot={item.category === "Mouse"}
                slotRef={item.category === "Mouse" ? mouseSlotRef : undefined}
                hideIcon={item.category === "Mouse" && is3DActive}
              />
            ))}
          </ul>

          {showManufacturerCredit && (
            <p
              className="relative z-10 text-[11px] text-wine/70 tracking-normal text-center mt-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Product images belong to their respective manufacturers.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
