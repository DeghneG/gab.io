"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import ContourBackground from "@/components/contour-background";
import { timeline, siteConfig, certifications, type Certification } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Color map for ticket stubs */
const STUB_COLORS = [
  { bg: "bg-mustard", text: "text-wine", label: "text-wine/70" },
  { bg: "bg-teal", text: "text-cream", label: "text-cream/80" },
  { bg: "bg-orange", text: "text-cream", label: "text-cream/80" },
];

const STUB_WIDTH = 88;
const BARCODE_WIDTH = 48;

const ticketMaskStyle: React.CSSProperties = {
  WebkitMaskImage: `radial-gradient(circle 10px at ${STUB_WIDTH}px 0px, transparent 9.5px, #000 10px), radial-gradient(circle 10px at ${STUB_WIDTH}px 100%, transparent 9.5px, #000 10px)`,
  WebkitMaskComposite: "destination-in",
  maskImage: `radial-gradient(circle 10px at ${STUB_WIDTH}px 0px, transparent 9.5px, #000 10px), radial-gradient(circle 10px at ${STUB_WIDTH}px 100%, transparent 9.5px, #000 10px)`,
  maskComposite: "intersect",
};

const barcodeStyle: React.CSSProperties = {
  width: `${BARCODE_WIDTH}px`,
  background:
    "repeating-linear-gradient(90deg, #8C0027 0px, #8C0027 2px, transparent 2px, transparent 4px, #8C0027 4px, #8C0027 5px, transparent 5px, transparent 8px, #8C0027 8px, #8C0027 11px, transparent 11px, transparent 13px, #8C0027 13px, #8C0027 14px, transparent 14px, transparent 16px)",
};

/**
 * Standard Ticket-Stub Row for the full certification list.
 */
function TicketStubRow({
  cert,
  stubColor,
  serialNo,
  ticketMaskStyle,
  barcodeStyle,
  cardRef,
}: {
  cert: Certification;
  stubColor: { bg: string; text: string; label: string };
  serialNo: string;
  ticketMaskStyle: React.CSSProperties;
  barcodeStyle: React.CSSProperties;
  cardRef?: (el: HTMLLIElement | null) => void;
}) {
  const rowRef = useRef<HTMLLIElement>(null);
  const stubRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const seamRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!rowRef.current) return;
    gsap.killTweensOf([rowRef.current, stubRef.current, bodyRef.current, seamRef.current]);

    gsap.to(rowRef.current, {
      y: -5,
      filter: "drop-shadow(10px 10px 0 #8C0027)",
      duration: 0.28,
      ease: "power2.out",
    });

    if (stubRef.current) {
      gsap.to(stubRef.current, {
        transformPerspective: 800,
        transformOrigin: "right center",
        rotateY: -7,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (bodyRef.current) {
      gsap.to(bodyRef.current, {
        transformPerspective: 800,
        transformOrigin: "left center",
        rotateY: 2.5,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (seamRef.current) {
      gsap.to(seamRef.current, {
        borderRightColor: "rgba(140, 0, 39, 0.85)",
        duration: 0.2,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!rowRef.current) return;
    gsap.killTweensOf([rowRef.current, stubRef.current, bodyRef.current, seamRef.current]);

    gsap.to(rowRef.current, {
      y: 0,
      filter: "drop-shadow(6px 6px 0 #8C0027)",
      duration: 0.28,
      ease: "power3.out",
    });

    if (stubRef.current) {
      gsap.to(stubRef.current, {
        rotateY: 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }

    if (bodyRef.current) {
      gsap.to(bodyRef.current, {
        rotateY: 0,
        duration: 0.25,
        ease: "power2.out",
      });
    }

    if (seamRef.current) {
      gsap.to(seamRef.current, {
        borderRightColor: "rgba(140, 0, 39, 0.4)",
        duration: 0.2,
      });
    }
  };

  return (
    <li
      ref={(el) => {
        rowRef.current = el;
        if (cardRef) cardRef(el);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer select-none"
      style={{
        filter: "drop-shadow(6px 6px 0 #8C0027)",
        willChange: "transform, filter",
      }}
    >
      <div
        className="relative flex items-stretch bg-cream border-3 border-wine rounded-2xl overflow-hidden [perspective:1000px]"
        style={ticketMaskStyle}
      >
        {/* Left Stub */}
        <div
          ref={(el) => {
            stubRef.current = el;
            seamRef.current = el;
          }}
          className={`
            relative w-[88px] shrink-0
            ${stubColor.bg} ${stubColor.text}
            flex flex-col items-center justify-center
            border-r-2 border-dashed border-wine/40
            py-5 px-2 select-none gap-1.5
          `}
          style={{ willChange: "transform", transformStyle: "preserve-3d" }}
        >
          <span
            aria-hidden="true"
            className={`text-[10px] uppercase tracking-widest font-bold ${stubColor.label}`}
            style={{ fontFamily: "var(--font-body)" }}
          >
            CERT
          </span>
          <span
            className="text-2xl md:text-3xl font-bold [writing-mode:vertical-rl] rotate-180 tracking-wide"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {cert.year}
          </span>
        </div>

        {/* Middle Info & Right Barcode */}
        <div
          ref={bodyRef}
          className="py-5 px-6 flex items-center justify-between gap-4 md:gap-6 flex-1 min-w-0"
          style={{ willChange: "transform", transformStyle: "preserve-3d" }}
        >
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
            <h4
              className="text-lg md:text-xl text-wine line-clamp-2 md:truncate leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
              title={cert.title}
            >
              {cert.title}
            </h4>
            <p
              className="text-xs md:text-sm text-wine/75"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {cert.issuer}
            </p>
            <span
              className="inline-flex w-fit text-[11px] md:text-xs px-2.5 py-0.5 bg-teal text-cream rounded-full border border-wine/30 font-bold"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {cert.category}
            </span>
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            {cert.url && cert.url.trim() !== "" && (
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View credential: ${cert.title}`}
                className="
                  w-10 h-10 rounded-full shrink-0
                  flex items-center justify-center
                  border-2 border-wine bg-cream text-wine
                  transition-all duration-150
                  hover:bg-mustard hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_#8C0027]
                  active:translate-y-0 active:shadow-none
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard
                "
              >
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </a>
            )}

            <span
              aria-hidden="true"
              className="text-xs text-wine/60 font-bold tracking-wider select-none whitespace-nowrap"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {serialNo}
            </span>

            <div
              aria-hidden="true"
              className="hidden sm:block h-10 md:h-12 shrink-0 border-l border-r border-wine/20 select-none opacity-85"
              style={barcodeStyle}
            />
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * Featured Ticket Stub: Larger ticket for the top of the right bento column.
 */
function FeaturedTicketStub({
  cert,
  stubColor,
  serialNo,
}: {
  cert: Certification;
  stubColor: { bg: string; text: string; label: string };
  serialNo: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stubRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const FEATURED_STUB_WIDTH = 96;
  const featuredMaskStyle: React.CSSProperties = {
    WebkitMaskImage: `radial-gradient(circle 12px at ${FEATURED_STUB_WIDTH}px 0px, transparent 11.5px, #000 12px), radial-gradient(circle 12px at ${FEATURED_STUB_WIDTH}px 100%, transparent 11.5px, #000 12px)`,
    WebkitMaskComposite: "destination-in",
    maskImage: `radial-gradient(circle 12px at ${FEATURED_STUB_WIDTH}px 0px, transparent 11.5px, #000 12px), radial-gradient(circle 12px at ${FEATURED_STUB_WIDTH}px 100%, transparent 11.5px, #000 12px)`,
    maskComposite: "intersect",
  };

  const handleMouseEnter = () => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      y: -5,
      filter: "drop-shadow(10px 10px 0 #8C0027)",
      duration: 0.28,
      ease: "power2.out",
    });
    if (stubRef.current) {
      gsap.to(stubRef.current, {
        transformPerspective: 800,
        transformOrigin: "right center",
        rotateY: -6,
        duration: 0.3,
      });
    }
    if (bodyRef.current) {
      gsap.to(bodyRef.current, {
        transformPerspective: 800,
        transformOrigin: "left center",
        rotateY: 2.5,
        duration: 0.3,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    gsap.to(containerRef.current, {
      y: 0,
      filter: "drop-shadow(6px 6px 0 #8C0027)",
      duration: 0.28,
      ease: "power3.out",
    });
    if (stubRef.current) {
      gsap.to(stubRef.current, { rotateY: 0, duration: 0.25 });
    }
    if (bodyRef.current) {
      gsap.to(bodyRef.current, { rotateY: 0, duration: 0.25 });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer select-none transition-all duration-200"
      style={{
        filter: "drop-shadow(6px 6px 0 #8C0027)",
        willChange: "transform, filter",
      }}
    >
      <div
        className="relative flex items-stretch bg-cream border-4 border-wine rounded-3xl overflow-hidden [perspective:1000px]"
        style={featuredMaskStyle}
      >
        {/* Left Stub: Larger Year & CERT */}
        <div
          ref={stubRef}
          className={`
            relative w-[96px] shrink-0
            ${stubColor.bg} ${stubColor.text}
            flex flex-col items-center justify-center
            border-r-2 border-dashed border-wine/40
            py-6 px-3 select-none gap-2
          `}
          style={{ willChange: "transform", transformStyle: "preserve-3d" }}
        >
          <span
            aria-hidden="true"
            className={`text-xs uppercase tracking-widest font-bold ${stubColor.label}`}
            style={{ fontFamily: "var(--font-body)" }}
          >
            CERT
          </span>
          <span
            className="text-3xl md:text-4xl font-bold [writing-mode:vertical-rl] rotate-180 tracking-wide"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {cert.year}
          </span>
        </div>

        {/* Middle Info & Right Credential Button */}
        <div
          ref={bodyRef}
          className="py-6 px-6 sm:px-7 flex items-center justify-between gap-4 md:gap-6 flex-1 min-w-0"
          style={{ willChange: "transform", transformStyle: "preserve-3d" }}
        >
          <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex w-fit text-xs px-3 py-1 bg-teal text-cream rounded-full border border-wine/30 font-bold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {cert.category}
              </span>
              <span
                className="text-xs text-wine/50 font-bold tracking-wider uppercase"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Featured
              </span>
            </div>
            <h4
              className="text-xl md:text-2xl text-wine font-bold leading-snug line-clamp-2"
              style={{ fontFamily: "var(--font-display)" }}
              title={cert.title}
            >
              {cert.title}
            </h4>
            <p
              className="text-xs md:text-sm text-wine/80 font-medium"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {cert.issuer}
            </p>
          </div>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            {cert.url && cert.url.trim() !== "" && (
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View credential: ${cert.title}`}
                className="
                  w-11 h-11 rounded-full shrink-0
                  flex items-center justify-center
                  border-2 border-wine bg-cream text-wine
                  transition-all duration-150
                  hover:bg-mustard hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_#8C0027]
                  active:translate-y-0 active:shadow-none
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard
                "
              >
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </a>
            )}

            <span
              aria-hidden="true"
              className="hidden sm:inline-block text-xs text-wine/60 font-bold tracking-wider select-none whitespace-nowrap"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {serialNo}
            </span>

            <div
              aria-hidden="true"
              className="hidden md:block h-12 shrink-0 border-l border-r border-wine/20 select-none opacity-85"
              style={barcodeStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact Ticket Stub: Horizontal year strip on top, title & issuer below.
 */
function CompactTicketStub({
  cert,
  stubColor,
  serialNo,
}: {
  cert: Certification;
  stubColor: { bg: string; text: string; label: string };
  serialNo: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const compactMaskStyle: React.CSSProperties = {
    WebkitMaskImage: `radial-gradient(circle 9px at 0px 42px, transparent 8.5px, #000 9px), radial-gradient(circle 9px at 100% 42px, transparent 8.5px, #000 9px)`,
    WebkitMaskComposite: "destination-in",
    maskImage: `radial-gradient(circle 9px at 0px 42px, transparent 8.5px, #000 9px), radial-gradient(circle 9px at 100% 42px, transparent 8.5px, #000 9px)`,
    maskComposite: "intersect",
  };

  const handleMouseEnter = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      y: -4,
      filter: "drop-shadow(8px 8px 0 #8C0027)",
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      y: 0,
      filter: "drop-shadow(5px 5px 0 #8C0027)",
      duration: 0.25,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer select-none h-full transition-all duration-200"
      style={{
        filter: "drop-shadow(5px 5px 0 #8C0027)",
        willChange: "transform, filter",
      }}
    >
      <div
        className="relative flex flex-col justify-between bg-cream border-3 border-wine rounded-2xl overflow-hidden h-full"
        style={compactMaskStyle}
      >
        {/* Horizontal Year Strip on Top */}
        <div
          className={`
            h-[42px] shrink-0
            ${stubColor.bg} ${stubColor.text}
            flex items-center justify-between
            px-4 border-b-2 border-dashed border-wine/40
            select-none
          `}
        >
          <div className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={`text-[9px] uppercase tracking-widest font-bold ${stubColor.label}`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              CERT
            </span>
            <span
              className="text-lg font-bold tracking-wide"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {cert.year}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="text-[10px] font-bold tracking-wider opacity-75"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {serialNo}
          </span>
        </div>

        {/* Title, Issuer & Category Below */}
        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-4">
          <div>
            <h4
              className="text-base sm:text-lg text-wine font-bold leading-snug line-clamp-2"
              style={{ fontFamily: "var(--font-display)" }}
              title={cert.title}
            >
              {cert.title}
            </h4>
            <p
              className="text-xs text-wine/75 font-medium mt-1 line-clamp-1"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {cert.issuer}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-wine/10">
            <span
              className="inline-flex text-[11px] px-2.5 py-0.5 bg-teal text-cream rounded-full border border-wine/30 font-bold"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {cert.category}
            </span>

            {cert.url && cert.url.trim() !== "" && (
              <a
                href={cert.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View credential: ${cert.title}`}
                className="
                  w-8 h-8 rounded-full shrink-0
                  flex items-center justify-center
                  border-2 border-wine bg-cream text-wine
                  transition-all duration-150
                  hover:bg-mustard hover:shadow-[2px_2px_0_0_#8C0027]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard
                "
              >
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Experience / Resume section — Bento-box grid layout.
 */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const markersRef = useRef<(HTMLDivElement | null)[]>([]);

  const [showAll, setShowAll] = useState(false);

  const sortedCertifications = [...certifications].sort((a, b) => {
    const yearDiff = (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0);
    if (yearDiff !== 0) return yearDiff;
    return a.title.localeCompare(b.title);
  });

  const hasCerts = sortedCertifications.length > 0;
  const featuredCert = sortedCertifications[0];
  const compactCerts = sortedCertifications.slice(1, 3);

  useGSAP(
    () => {
      // 1. Dynamic Scroll-Drawn Gradient Line
      if (lineProgressRef.current && timelineRef.current) {
        gsap.fromTo(
          lineProgressRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 75%",
              end: "bottom 75%",
              scrub: 0.5,
            },
          }
        );
      }

      // 2. Milestone Node Stamp & Card Glide-In
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        const marker = markersRef.current[i];
        const card = item.querySelector(".experience-card");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
            once: true,
          },
        });

        if (marker) {
          tl.fromTo(
            marker,
            { scale: 0.4, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(1.7)",
            }
          );
        }

        if (card) {
          tl.fromTo(
            card,
            { opacity: 0, x: 25, y: 10 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              duration: 0.65,
              ease: "power3.out",
            },
            "-=0.3"
          );
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-label="Experience and education"
      className="relative isolate overflow-hidden py-24 md:py-36 lg:py-40"
    >
      <ContourBackground variant="c" maskType="center" className="z-0" />
      <div className="relative z-30 mx-auto max-w-6xl w-full px-6 md:px-10 lg:px-12">
        {/* Section Heading & Subtitle */}
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl md:text-5xl text-wine">Experience</h2>
          {process.env.NODE_ENV === "development" && (
            <span
              className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-orange/15 text-orange border border-orange/40 rounded font-bold"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Placeholder
            </span>
          )}
        </div>
        <p
          className="text-wine/70 mb-12 md:mb-14 max-w-2xl text-base"
          style={{ fontFamily: "var(--font-body)" }}
        >
          My journey so far.
        </p>

        {/* ── 12-Column Bento-Box Grid ────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {/* 1. Timeline Bento Tile: col-span-7 desktop, full-width tablet/mobile */}
          <div
            className={`
              col-span-1 md:col-span-2 ${hasCerts ? "lg:col-span-7" : "lg:col-span-12"}
              bg-cream border-4 border-wine rounded-3xl
              p-6 sm:p-8 flex flex-col justify-between
              shadow-[6px_6px_0_0_#8C0027]
            `}
          >
            {/* Tile Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-wine/15">
              <h3
                className="text-2xl md:text-3xl text-wine"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Education & Journey
              </h3>
              <span
                className="px-3 py-1 bg-mustard text-wine text-xs uppercase font-bold tracking-wider rounded-full border-2 border-wine/30"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {timeline.length} Stages
              </span>
            </div>

            {/* Vertical timeline */}
            <div ref={timelineRef} className="relative w-full">
              {/* Timeline background track line */}
              <div
                className="absolute left-6 md:left-8 -translate-x-1/2 top-6 bottom-6 w-1 bg-wine/15 rounded-full"
                aria-hidden="true"
              />

              {/* Dynamic Scroll-Drawn Ink Line */}
              <div
                ref={lineProgressRef}
                className="absolute left-6 md:left-8 -translate-x-1/2 top-6 bottom-6 w-1.5 bg-gradient-to-b from-[#2BAF90] via-[#F1A512] to-[#DD4111] rounded-full will-change-transform shadow-[0_0_8px_rgba(241,165,18,0.35)]"
                aria-hidden="true"
              />

              <ol className="flex flex-col gap-8 md:gap-10">
                {timeline.map((entry, i) => (
                  <li key={`${entry.org}-${entry.period}`} className="relative">
                    <div
                      ref={(el) => {
                        itemsRef.current[i] = el;
                      }}
                      className="flex gap-5 md:gap-6 items-start"
                    >
                      {/* Timeline marker with milestone numbers */}
                      <div
                        ref={(el) => {
                          markersRef.current[i] = el;
                        }}
                        className="
                          relative z-10 shrink-0
                          w-12 h-12 md:w-16 md:h-16
                          rounded-full
                          bg-cream border-4 border-wine
                          flex items-center justify-center
                          text-base md:text-xl font-bold text-wine
                          will-change-transform
                        "
                        style={{
                          fontFamily: "var(--font-display)",
                          boxShadow: "3px 3px 0 0 #F1A512",
                        }}
                        aria-hidden="true"
                      >
                        0{i + 1}
                        {i === timeline.length - 1 && (
                          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75" />
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange border border-cream" />
                          </span>
                        )}
                      </div>

                      {/* Content card inside tile: inner border only to prevent heavy double shadows */}
                      <div
                        className="
                          experience-card
                          flex-1
                          bg-white/60 border-2 border-wine/40 rounded-2xl
                          p-5 md:p-6
                          will-change-transform
                        "
                      >
                        <h4
                          className="text-lg md:text-xl text-wine mb-1"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {entry.title}
                        </h4>
                        <p
                          className="text-sm text-wine/80 mb-1"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {entry.org}
                        </p>
                        <div className="flex flex-wrap items-center gap-2.5 mt-2">
                          <span
                            className="text-xs px-3 py-1 bg-teal text-cream rounded-full border border-wine/30 font-bold"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {entry.location}
                          </span>
                          <span
                            className="text-xs px-3 py-1 bg-mustard text-wine rounded-full border border-wine/30 font-bold"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {entry.period}
                          </span>
                        </div>
                        {entry.description && (
                          <p
                            className="text-sm text-wine/70 mt-3 leading-relaxed"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {entry.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* 2. Right Side Bento Column: col-span-5 desktop, full-width tablet/mobile */}
          {hasCerts && (
            <div className="col-span-1 md:col-span-2 lg:col-span-5 flex flex-col gap-6">
              {/* Tile Header */}
              <div className="flex items-center justify-between pb-1">
                <h3
                  className="text-2xl md:text-3xl text-wine"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Certifications
                </h3>
                <span
                  className="text-xs text-wine/70 font-bold"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Top {Math.min(3, sortedCertifications.length)} of {sortedCertifications.length}
                </span>
              </div>

              {/* 2a. Featured Certification (Top of Right Column) */}
              {featuredCert && (
                <FeaturedTicketStub
                  cert={featuredCert}
                  stubColor={STUB_COLORS[0]}
                  serialNo="No. 001"
                />
              )}

              {/* 2b. Compact Certifications (2-Column Grid Below Featured) */}
              {compactCerts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 items-stretch">
                  {compactCerts.map((cert, idx) => (
                    <CompactTicketStub
                      key={`${cert.title}-${cert.year}`}
                      cert={cert}
                      stubColor={STUB_COLORS[(idx + 1) % STUB_COLORS.length]}
                      serialNo={`No. ${String(idx + 2).padStart(3, "0")}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Bottom Row: Resume Strip: col-span-12 full-width below both columns */}
          <div
            className="
              col-span-1 md:col-span-2 lg:col-span-12
              bg-cream border-4 border-wine rounded-3xl
              p-6 sm:p-8
              shadow-[6px_6px_0_0_#8C0027]
              flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6
            "
          >
            <div>
              <h3
                className="text-2xl sm:text-3xl md:text-4xl text-wine"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Want the full story?
              </h3>
              <p
                className="text-sm md:text-base text-wine/70 mt-1 max-w-xl"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Download my complete resume with academic history, skills, and project experience.
              </p>
            </div>

            {/* Unchanged Download Resume Button */}
            <a
              href={siteConfig.resumeUrl}
              download
              className="group relative inline-flex items-center justify-center px-7 py-3 bg-orange text-cream text-base rounded-2xl border-4 border-wine outline-none focus-visible:ring-4 focus-visible:ring-mustard transition-transform active:scale-[0.97] shrink-0"
              style={{
                fontFamily: "var(--font-display)",
                boxShadow: "4px 4px 0 0 #8C0027",
              }}
            >
              <div className="relative overflow-hidden h-[24px]">
                <div className="flex flex-col transition-transform duration-200 ease-out group-hover:-translate-y-1/2">
                  {/* Frame 1 */}
                  <div className="flex items-center justify-center h-[24px]">
                    <span className="leading-none pt-1">Download resume</span>
                  </div>
                  {/* Frame 2 */}
                  <div className="flex items-center justify-center h-[24px] text-wine">
                    <span className="leading-none pt-1">Download resume</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* ── Show All / Show Less for remaining certs beyond 3 ── */}
        {sortedCertifications.length > 3 && (
          <div className="mt-8 flex flex-col items-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              aria-expanded={showAll}
              className="
                px-6 py-3 rounded-full
                border-2 border-wine/30 bg-cream/70 text-wine
                hover:border-wine hover:bg-cream
                text-xs md:text-sm font-bold uppercase tracking-wider
                transition-all duration-200
                shadow-[3px_3px_0_0_#8C0027]
                active:translate-y-0.5 active:shadow-none
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard
                cursor-pointer
              "
              style={{ fontFamily: "var(--font-body)" }}
            >
              {showAll
                ? "Show less"
                : `Show all (${sortedCertifications.length})`}
            </button>

            {showAll && (
              <div className="w-full mt-8">
                <ul className="flex flex-col gap-6 md:gap-7">
                  {sortedCertifications.slice(3).map((cert, i) => {
                    const stubColor = STUB_COLORS[(i + 3) % STUB_COLORS.length];
                    const serialNo = `No. ${String(i + 4).padStart(3, "0")}`;
                    return (
                      <TicketStubRow
                        key={`${cert.title}-${cert.year}`}
                        cert={cert}
                        stubColor={stubColor}
                        serialNo={serialNo}
                        ticketMaskStyle={ticketMaskStyle}
                        barcodeStyle={barcodeStyle}
                      />
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stripe band */}
      <div
        aria-hidden="true"
        className="absolute z-10 bottom-0 left-0 right-0 stripe-band"
      />
    </section>
  );
}
