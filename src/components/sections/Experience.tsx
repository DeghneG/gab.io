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

/** Cutout notches mask for ticket stubs */
const ticketMaskStyle: React.CSSProperties = {
  WebkitMaskImage:
    "radial-gradient(circle 9px at 0px 42px, transparent 8.5px, #000 9px), radial-gradient(circle 9px at 100% 42px, transparent 8.5px, #000 9px)",
  WebkitMaskComposite: "destination-in",
  maskImage:
    "radial-gradient(circle 9px at 0px 42px, transparent 8.5px, #000 9px), radial-gradient(circle 9px at 100% 42px, transparent 8.5px, #000 9px)",
  maskComposite: "intersect",
};

/**
 * Ticket-Stub Card for Certifications:
 * Horizontal year strip on top, title, issuer, category chip & credential link.
 */
function CertificationTicket({
  cert,
  stubColor,
  serialNo,
}: {
  cert: Certification;
  stubColor: { bg: string; text: string; label: string };
  serialNo: string;
}) {
  const cardRef = useRef<HTMLLIElement>(null);

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
    <li
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="cert-ticket-item relative select-none h-full"
      style={{
        filter: "drop-shadow(5px 5px 0 #8C0027)",
        willChange: "transform, filter",
      }}
    >
      <div
        className="relative flex flex-col justify-between bg-cream border-3 border-wine rounded-2xl overflow-hidden h-full"
        style={ticketMaskStyle}
      >
        {/* Horizontal Year Strip on Top */}
        <div
          className={`
            cert-stub-top
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
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <h4
            className="text-lg text-wine font-bold leading-snug line-clamp-3"
            style={{ fontFamily: "var(--font-display)" }}
            title={cert.title}
          >
            {cert.title}
          </h4>
          <p
            className="text-xs text-wine/75 font-medium mt-1.5"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {cert.issuer}
          </p>

          <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-wine/10">
            <span
              className="cert-badge inline-flex text-xs px-2.5 py-0.5 bg-teal text-cream rounded-full border border-wine/30 font-bold will-change-transform"
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
                  cert-link-btn
                  w-8 h-8 rounded-full shrink-0
                  flex items-center justify-center
                  border-2 border-wine bg-cream text-wine
                  transition-colors duration-150
                  hover:bg-mustard hover:shadow-[2px_2px_0_0_#8C0027]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mustard
                  will-change-transform
                "
              >
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

/**
 * Experience / Resume section — Horizontal Timeline & Certifications Tickets.
 */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const desktopLineProgressRef = useRef<HTMLDivElement>(null);
  const mobileLineProgressRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<(HTMLDivElement | null)[]>([]);
  const stemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pulseDotRef = useRef<HTMLSpanElement | null>(null);

  // Certifications refs
  const certSectionRef = useRef<HTMLDivElement>(null);
  const certHeaderRef = useRef<HTMLDivElement>(null);
  const certStripeRef = useRef<HTMLDivElement>(null);

  const [showAll, setShowAll] = useState(false);

  const sortedCertifications = [...certifications].sort((a, b) => {
    const yearDiff = (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0);
    if (yearDiff !== 0) return yearDiff;
    return a.title.localeCompare(b.title);
  });

  const hasCerts = sortedCertifications.length > 0;
  const displayedCerts = showAll
    ? sortedCertifications
    : sortedCertifications.slice(0, 3);

  useGSAP(
    () => {
      if (!timelineRef.current) return;

      // Initial hidden states
      if (desktopLineProgressRef.current) {
        gsap.set(desktopLineProgressRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
        });
      }
      if (mobileLineProgressRef.current) {
        gsap.set(mobileLineProgressRef.current, {
          scaleY: 0,
          transformOrigin: "top center",
        });
      }
      markersRef.current.forEach((m) => {
        if (m) gsap.set(m, { scale: 0, opacity: 0, rotation: -30 });
      });
      stemsRef.current.forEach((s) => {
        if (s) gsap.set(s, { scaleY: 0, transformOrigin: "top center" });
      });
      if (pulseDotRef.current) {
        gsap.set(pulseDotRef.current, { scale: 0, opacity: 0 });
      }

      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

      cardsRef.current.forEach((c) => {
        if (c) {
          if (isDesktop) {
            gsap.set(c, {
              y: -35,
              rotationX: -25,
              opacity: 0,
              scale: 0.94,
              transformOrigin: "top center",
            });
          } else {
            gsap.set(c, { x: 40, opacity: 0 });
          }
        }
      });

      // ── Triggered Cinematic Sequence ──
      // Triggers when the timeline reaches comfortable viewing position (top 62%)
      // and replays when scrolling back so it's always easy to see and test!
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 62%",
          toggleActions: "play none none reverse",
        },
      });

      // 1. Multi-color gradient line shoots across like an electric transit track
      if (desktopLineProgressRef.current) {
        masterTl.to(
          desktopLineProgressRef.current,
          { scaleX: 1, duration: 1.35, ease: "power2.inOut" },
          0.05
        );
      }
      if (mobileLineProgressRef.current) {
        masterTl.to(
          mobileLineProgressRef.current,
          { scaleY: 1, duration: 1.35, ease: "power2.inOut" },
          0.05
        );
      }

      // 2. Sequential waypoint punch & hanging signboard drop as the line reaches each stop
      // Node 01 punches down at 0.1s
      if (markersRef.current[0]) {
        masterTl.to(
          markersRef.current[0],
          { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(2.2)" },
          0.1
        );
      }
      if (stemsRef.current[0]) {
        masterTl.to(
          stemsRef.current[0],
          { scaleY: 1, duration: 0.35, ease: "power2.out" },
          0.2
        );
      }
      if (cardsRef.current[0]) {
        masterTl.to(
          cardsRef.current[0],
          isDesktop
            ? { y: 0, rotationX: 0, opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.5)" }
            : { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          0.25
        );
      }

      // Node 02 punches down at 0.6s
      if (markersRef.current[1]) {
        masterTl.to(
          markersRef.current[1],
          { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(2.2)" },
          0.6
        );
      }
      if (stemsRef.current[1]) {
        masterTl.to(
          stemsRef.current[1],
          { scaleY: 1, duration: 0.35, ease: "power2.out" },
          0.7
        );
      }
      if (cardsRef.current[1]) {
        masterTl.to(
          cardsRef.current[1],
          isDesktop
            ? { y: 0, rotationX: 0, opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.5)" }
            : { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          0.75
        );
      }

      // Node 03 punches down at 1.1s + Live beacon turns on
      if (markersRef.current[2]) {
        masterTl.to(
          markersRef.current[2],
          { scale: 1, rotation: 0, opacity: 1, duration: 0.5, ease: "back.out(2.2)" },
          1.1
        );
      }
      if (stemsRef.current[2]) {
        masterTl.to(
          stemsRef.current[2],
          { scaleY: 1, duration: 0.35, ease: "power2.out" },
          1.2
        );
      }
      if (cardsRef.current[2]) {
        masterTl.to(
          cardsRef.current[2],
          isDesktop
            ? { y: 0, rotationX: 0, opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.5)" }
            : { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
          1.25
        );
      }
      if (pulseDotRef.current) {
        masterTl.to(
          pulseDotRef.current,
          { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2.5)" },
          1.4
        );
      }

      // ── Certifications Ticket Dispenser Sequence ──
      if (certSectionRef.current) {
        const certCards = certSectionRef.current.querySelectorAll(".cert-ticket-item");
        const certBadges = certSectionRef.current.querySelectorAll(".cert-badge");
        const certBtns = certSectionRef.current.querySelectorAll(".cert-link-btn");
        const certTops = certSectionRef.current.querySelectorAll(".cert-stub-top");

        // Initial hidden states
        if (certHeaderRef.current) {
          gsap.set(certHeaderRef.current, { opacity: 0, y: 15 });
        }
        if (certStripeRef.current) {
          gsap.set(certStripeRef.current, { scaleX: 0, transformOrigin: "left center" });
        }
        if (certCards.length > 0) {
          gsap.set(certCards, {
            y: -55,
            opacity: 0,
            scale: 0.94,
            rotation: -2,
            transformOrigin: "top center",
          });
        }
        if (certBadges.length > 0) {
          gsap.set(certBadges, { scale: 0, opacity: 0 });
        }
        if (certBtns.length > 0) {
          gsap.set(certBtns, { scale: 0, rotation: -90, opacity: 0 });
        }

        const certTl = gsap.timeline({
          scrollTrigger: {
            trigger: certSectionRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });

        // 1. Heading softly glides in
        if (certHeaderRef.current) {
          certTl.to(
            certHeaderRef.current,
            { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
            0
          );
        }

        // 2. Stripe dispenser slot rail unrolls across
        if (certStripeRef.current) {
          certTl.to(
            certStripeRef.current,
            { scaleX: 1, duration: 0.65, ease: "power3.inOut" },
            0.1
          );
        }

        // 3. Ticket card ejects downward from behind the dispenser rail
        if (certCards.length > 0) {
          certTl.to(
            certCards,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.75,
              stagger: 0.15,
              ease: "back.out(1.8)",
            },
            0.45
          );
        }

        // 4. Perforation stub header stamps / clicks
        if (certTops.length > 0) {
          certTl.fromTo(
            certTops,
            { filter: "brightness(1.2)" },
            { filter: "brightness(1)", duration: 0.35, ease: "power2.out", stagger: 0.15 },
            0.75
          );
        }

        // 5. Category badge and credential link pop in
        if (certBadges.length > 0) {
          certTl.to(
            certBadges,
            { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.2)", stagger: 0.15 },
            0.78
          );
        }
        if (certBtns.length > 0) {
          certTl.to(
            certBtns,
            { scale: 1, rotation: 0, opacity: 1, duration: 0.45, ease: "back.out(2)", stagger: 0.15 },
            0.82
          );
        }
      }
    },
    { scope: sectionRef, dependencies: [showAll] }
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      aria-label="Experience and education"
      className="relative isolate overflow-hidden py-16 md:py-24 lg:py-28"
    >
      <ContourBackground variant="c" maskType="center" className="z-0" />
      <div className="relative z-30 mx-auto max-w-6xl w-full px-6">
        {/* ── 1. Heading Row ────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
          <div>
            <h2
              className="text-3xl md:text-5xl text-wine"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Experience
            </h2>
            <p
              className="text-wine/70 mt-2 text-base"
              style={{ fontFamily: "var(--font-body)" }}
            >
              My journey so far.
            </p>
          </div>

          {/* Download resume button */}
          <a
            href={siteConfig.resumeUrl}
            download
            className="group relative inline-flex items-center justify-center px-7 py-3 bg-orange text-cream text-base rounded-2xl border-4 border-wine outline-none focus-visible:ring-4 focus-visible:ring-mustard transition-transform active:scale-[0.97] shrink-0 w-fit"
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

        {/* ── 2. Horizontal Timeline ───────────────────── */}
        <div ref={timelineRef} className="relative w-full mt-12">
          {/* Desktop Horizontal Line (1024px and up): starts at Col 1 center, ends at Col 3 center */}
          <div
            className="hidden lg:block absolute top-7 left-[calc(100%/6-8px)] right-[calc(100%/6-8px)] -translate-y-1/2 h-1 bg-wine/15 rounded-full z-0"
            aria-hidden="true"
          />
          <div
            ref={desktopLineProgressRef}
            className="hidden lg:block absolute top-7 left-[calc(100%/6-8px)] right-[calc(100%/6-8px)] -translate-y-1/2 h-1.5 bg-gradient-to-r from-[#2BAF90] via-[#F1A512] to-[#DD4111] rounded-full z-0 origin-left shadow-[0_0_8px_rgba(241,165,18,0.35)] will-change-transform"
            aria-hidden="true"
          />

          {/* Mobile / Tablet Vertical Line (<1024px) */}
          <div
            className="lg:hidden absolute left-6 md:left-7 -translate-x-1/2 top-6 bottom-6 w-1 bg-wine/15 rounded-full z-0"
            aria-hidden="true"
          />
          <div
            ref={mobileLineProgressRef}
            className="lg:hidden absolute left-6 md:left-7 -translate-x-1/2 top-6 bottom-6 w-1.5 bg-gradient-to-b from-[#2BAF90] via-[#F1A512] to-[#DD4111] rounded-full z-0 origin-top shadow-[0_0_8px_rgba(241,165,18,0.35)] will-change-transform"
            aria-hidden="true"
          />

          {/* Timeline List: 3 equal columns on desktop, 1 vertical column on mobile/tablet */}
          <ol className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-7 lg:gap-6 items-stretch">
            {timeline.map((entry, i) => (
              <li
                key={`${entry.org}-${entry.period}`}
                className="relative flex flex-row lg:flex-col items-start lg:items-center gap-4 lg:gap-0 h-full group/item"
              >
                {/* Numbered circle marker */}
                <div
                  ref={(el) => {
                    markersRef.current[i] = el;
                  }}
                  className="
                    relative z-10 shrink-0
                    w-12 h-12 md:w-14 md:h-14
                    rounded-full
                    bg-cream border-4 border-wine
                    flex items-center justify-center
                    text-base md:text-lg font-bold text-wine
                    will-change-transform
                    transition-transform duration-200
                    group-hover/item:scale-105 group-hover/item:-rotate-3
                  "
                  style={{
                    fontFamily: "var(--font-display)",
                    boxShadow: "3px 3px 0 0 #F1A512",
                  }}
                  aria-hidden="true"
                >
                  0{i + 1}
                  {i === timeline.length - 1 && (
                    <span
                      ref={pulseDotRef}
                      className="absolute -top-1 -right-1 flex h-3.5 w-3.5 will-change-transform"
                    >
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75" />
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange border border-cream" />
                    </span>
                  )}
                </div>

                {/* 2px wine stem connecting circle to card on desktop */}
                <div
                  ref={(el) => {
                    stemsRef.current[i] = el;
                  }}
                  className="hidden lg:block w-0.5 h-6 bg-wine shrink-0 origin-top will-change-transform"
                  aria-hidden="true"
                />

                {/* Timeline content card */}
                <div
                  ref={(el) => {
                    cardsRef.current[i] = el;
                  }}
                  className="
                    experience-card
                    flex-1 w-full
                    bg-cream border-3 border-wine rounded-2xl
                    p-5 md:p-6
                    shadow-[6px_6px_0_0_#8C0027]
                    will-change-transform
                    transition-all duration-200
                    group-hover/item:-translate-y-1 group-hover/item:shadow-[8px_8px_0_0_#8C0027]
                    flex flex-col justify-between
                  "
                >
                  <div>
                    <h4
                      className="text-lg md:text-xl text-wine mb-1"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {entry.title}
                    </h4>
                    <p
                      className="text-sm text-wine/80 mb-2"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {entry.org}
                    </p>
                    {entry.description && (
                      <p
                        className="text-sm text-wine/70 mb-4 leading-relaxed"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {entry.description}
                      </p>
                    )}
                  </div>

                  {/* Location & Period Chips aligned at bottom */}
                  <div className="flex flex-wrap items-center gap-2 mt-auto pt-2">
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
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ── 3. Certifications ────────────────────────── */}
        {hasCerts && (
          <div ref={certSectionRef} className="mt-20">
            {/* Row Heading */}
            <div
              ref={certHeaderRef}
              className="flex items-baseline justify-between mb-3 will-change-transform"
            >
              <h3
                className="text-2xl md:text-3xl text-wine"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Certifications
              </h3>
              {sortedCertifications.length > 3 && (
                <span
                  className="text-xs md:text-sm text-wine/70 font-bold"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Top 3 of {sortedCertifications.length}
                </span>
              )}
            </div>

            {/* Stripe band dispenser slot rail */}
            <div
              ref={certStripeRef}
              aria-hidden="true"
              className="w-full h-3.5 stripe-band rounded-full border border-wine/20 mb-8 will-change-transform origin-left relative z-20 shadow-[0_2px_4px_rgba(140,0,39,0.15)]"
            />

            {/* Certifications Grid: Desktop 3 cols, Tablet 2 cols, Mobile 1 col (Centered if single item) */}
            <ul
              className={`relative z-10 grid gap-6 items-stretch ${
                displayedCerts.length === 1
                  ? "grid-cols-1 max-w-md mx-auto"
                  : displayedCerts.length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {displayedCerts.map((cert, idx) => {
                const stubColor = STUB_COLORS[idx % STUB_COLORS.length];
                const serialNo = `No. ${String(idx + 1).padStart(3, "0")}`;
                return (
                  <CertificationTicket
                    key={`${cert.title}-${cert.year}-${idx}`}
                    cert={cert}
                    stubColor={stubColor}
                    serialNo={serialNo}
                  />
                );
              })}
            </ul>

            {/* Show all / Show less toggle */}
            {sortedCertifications.length > 3 && (
              <div className="mt-8 flex justify-center">
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
                  {showAll ? "Show less" : "Show all"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stripe band divider at the bottom of the section */}
      <div
        aria-hidden="true"
        className="absolute z-10 bottom-0 left-0 right-0 stripe-band"
      />
    </section>
  );
}
