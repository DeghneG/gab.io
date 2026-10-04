"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContourBackground from "@/components/contour-background";
import { timeline, siteConfig } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}



/**
 * Experience / Resume section.
 * Vertical timeline with retro markers and a download-resume button.
 */
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    itemsRef.current.forEach((item, i) => {
      if (!item) return;
      gsap.fromTo(
        item,
        { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            once: true,
          },
        }
      );
    });
  }, []);

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
        <div className="relative max-w-2xl mx-auto">
        {/* Timeline line */}
        <div
          className="absolute left-6 md:left-8 top-0 bottom-0 w-1 bg-wine/20 rounded-full"
          aria-hidden="true"
        />

        <ol className="flex flex-col gap-8 md:gap-10">
          {timeline.map((entry, i) => (
            <li key={`${entry.org}-${entry.period}`} className="relative">
              <div
                ref={(el) => { itemsRef.current[i] = el; }}
                className="flex gap-5 md:gap-7 items-start"
              >
                {/* Timeline marker */}
                <div
                  className="
                    relative z-10 shrink-0
                    w-12 h-12 md:w-16 md:h-16
                    rounded-full
                    bg-cream border-4 border-wine
                    flex items-center justify-center
                    text-xl md:text-2xl
                  "
                  style={{ boxShadow: "3px 3px 0 0 #F1A512" }}
                  aria-hidden="true"
                />

                {/* Content card */}
                <div
                  className="
                    flex-1
                    bg-cream border-3 border-wine rounded-2xl
                    p-5 md:p-6
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

      {/* Download resume button */}
      <div className="flex justify-center mt-14">
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
