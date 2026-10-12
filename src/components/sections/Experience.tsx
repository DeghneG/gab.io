"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import ContourBackground from "@/components/contour-background";
import { timeline, siteConfig, certifications } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Experience / Resume section.
 * Vertical timeline with retro markers and a download-resume button.
 */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineProgressRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const markersRef = useRef<(HTMLDivElement | null)[]>([]);
  const certsContainerRef = useRef<HTMLDivElement>(null);
  const certCardsRef = useRef<(HTMLLIElement | null)[]>([]);

  // Tweakable settings for certifications block
  const INITIAL_ROWS = 6;
  const [showAll, setShowAll] = useState(false);

  const sortedCertifications = [...certifications].sort((a, b) => {
    const yearDiff = (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0);
    if (yearDiff !== 0) return yearDiff;
    return a.title.localeCompare(b.title);
  });

  const displayedCertifications = showAll
    ? sortedCertifications
    : sortedCertifications.slice(0, INITIAL_ROWS);

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

        // Marker pops with tactile letterpress spring
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

        // Card glides in smoothly
        if (card) {
          tl.fromTo(
            card,
            { opacity: 0, x: 35, y: 15 },
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

      // 3. Certifications Ticket-Stub Staggered Entrance
      if (certsContainerRef.current && certCardsRef.current.length > 0) {
        const prefersReduced =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const validCards = certCardsRef.current.filter(Boolean);
        if (!prefersReduced && validCards.length > 0) {
          gsap.fromTo(
            validCards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: certsContainerRef.current,
                start: "top 85%",
                once: true,
              },
            }
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
      className="relative isolate overflow-hidden py-20 md:py-32"
    >
      <ContourBackground variant="c" maskType="center" className="z-0" />
      <div className="relative z-30 mx-auto max-w-6xl w-full px-6 md:px-8">
        <h2 className="text-3xl md:text-5xl text-wine mb-4">Experience</h2>
        <p
          className="text-wine/70 mb-8 md:mb-10 max-w-2xl text-base"
          style={{ fontFamily: "var(--font-body)" }}
        >
          My journey so far.
        </p>

        {/* Vertical timeline */}
        <div ref={timelineRef} className="relative max-w-2xl mx-auto">
          {/* Timeline background track line */}
          <div
            className="absolute left-6 md:left-8 -translate-x-1/2 top-6 bottom-6 w-1 bg-wine/15 rounded-full"
            aria-hidden="true"
          />

          {/* Dynamic Scroll-Drawn Ink Line (Teal -> Mustard -> Orange gradient) */}
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
                  className="flex gap-5 md:gap-7 items-start"
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
                    {/* Live pulse indicator on the current / latest milestone */}
                    {i === timeline.length - 1 && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange border border-cream" />
                      </span>
                    )}
                  </div>

                  {/* Content card */}
                  <div
                    className="
                      experience-card
                      flex-1
                      bg-cream border-3 border-wine rounded-2xl
                      p-5 md:p-6
                      will-change-transform
                    "
                    style={{ boxShadow: "4px 4px 0 0 #8C0027" }}
                  >
                  <h3
                    className="text-lg md:text-xl text-wine mb-1"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {entry.title}
                  </h3>
                  <p
                    className="text-sm text-wine/80 mb-1"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {entry.org}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span
                      className="text-xs px-3 py-1 bg-teal text-cream rounded-full border-2 border-wine/30"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {entry.location}
                    </span>
                    <span
                      className="text-xs px-3 py-1 bg-mustard text-wine rounded-full border-2 border-wine/30"
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

      {/* Certifications Block */}
      {certifications && certifications.length > 0 && (
        <div ref={certsContainerRef} className="max-w-2xl mx-auto mt-16">
          <div className="flex items-center gap-3 mb-2">
            <h3
              className="text-2xl md:text-4xl text-wine"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Certifications
            </h3>
            {process.env.NODE_ENV === "development" && (
              <span
                className="px-2 py-0.5 text-[10px] uppercase tracking-wider bg-orange/15 text-orange border border-orange/40 rounded font-bold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Placeholder
              </span>
            )}
          </div>

          {/* Short stripe band */}
          <div
            aria-hidden="true"
            className="w-20 h-2 rounded-full stripe-band mb-8"
          />

          {/* Ticket-Stub List */}
          <ul className="flex flex-col gap-4">
            {displayedCertifications.map((cert, i) => (
              <li
                key={`${cert.title}-${cert.year}`}
                ref={(el) => {
                  certCardsRef.current[i] = el;
                }}
                className="
                  relative flex items-stretch
                  bg-cream border-3 border-wine rounded-2xl
                  overflow-hidden
                  shadow-[4px_4px_0_0_#8C0027]
                  transition-all duration-100 ease-out
                "
              >
                {/* 1. Left Stub (Year) */}
                <div
                  className="
                    relative w-[72px] md:w-[88px] shrink-0
                    bg-mustard text-wine
                    flex items-center justify-center
                    border-r-2 border-dashed border-wine/40
                    p-2 select-none
                  "
                >
                  <span
                    className="text-base md:text-xl font-bold tracking-wider"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {cert.year}
                  </span>

                  {/* Semicircle notches at top and bottom of perforation */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-mint border-b-2 border-wine z-10 pointer-events-none"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2.5 -right-2.5 w-5 h-5 rounded-full bg-mint border-t-2 border-wine z-10 pointer-events-none"
                  />
                </div>

                {/* 2 & 3. Middle Content & Right Credential Button */}
                <div className="p-4 md:p-5 flex items-center justify-between gap-3 md:gap-4 flex-1 min-w-0">
                  {/* Middle Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                    <h4
                      className="text-base md:text-lg text-wine line-clamp-2 md:truncate leading-snug"
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

                  {/* 3. Right Credential Button */}
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
                </div>
              </li>
            ))}
          </ul>

          {/* Show All / Show Less Toggle Button */}
          {sortedCertifications.length > INITIAL_ROWS && (
            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
                aria-expanded={showAll}
                className="
                  px-5 py-2.5 rounded-full
                  border-2 border-wine/30 bg-cream/60 text-wine
                  hover:border-wine hover:bg-cream
                  text-xs md:text-sm font-bold uppercase tracking-wider
                  transition-all duration-200
                  shadow-[2px_2px_0_0_#8C0027]
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
            </div>
          )}
        </div>
      )}

      {/* Download resume button */}
      <div className="flex justify-center mt-12">
        <a
          href={siteConfig.resumeUrl}
          download
          className="group relative inline-flex items-center justify-center px-7 py-3 bg-orange text-cream text-base rounded-2xl border-4 border-wine outline-none focus-visible:ring-4 focus-visible:ring-mustard transition-transform active:scale-[0.97]"
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

      {/* Stripe band */}
      <div
        aria-hidden="true"
        className="absolute z-10 bottom-0 left-0 right-0 stripe-band"
      />
    </section>
  );
}
