"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Projects section.
 * Each project is a "polaroid" card with a flip interaction on hover.
 * Front: image + title. Back: description, tech stack, links.
 */
export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    /* Stagger cards in from below when section scrolls into view */
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label="Projects"
      className="relative px-5 py-20 md:px-12 lg:px-20"
    >
      {/* Section heading */}
      <h2 className="text-3xl md:text-5xl text-wine mb-12">Projects</h2>

      {/* Project cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        {projects.map((project, i) => (
          <div
            key={project.title}
            ref={(el) => { cardsRef.current[i] = el; }}
            className="group perspective-[800px]"
          >
            {/* Flip container */}
            <div
              className="
                relative w-full aspect-[3/4]
                transition-transform duration-500
                [transform-style:preserve-3d]
                group-hover:[transform:rotateY(180deg)]
                group-focus-within:[transform:rotateY(180deg)]
              "
              style={{ transitionTimingFunction: "var(--ease-out)" }}
            >
              {/* ── FRONT: polaroid frame ────────────────── */}
              <div
                className="
                  absolute inset-0
                  [backface-visibility:hidden]
                  bg-cream border-4 border-wine rounded-2xl
                  flex flex-col overflow-hidden
                "
                style={{ boxShadow: "6px 6px 0 0 #8C0027" }}
              >
                {/* Image area */}
                <div className="flex-1 bg-mint/40 flex items-center justify-center border-b-4 border-wine">
                  <span className="text-6xl">🎞️</span>
                </div>
                {/* Title strip — like a polaroid caption */}
                <div className="p-4 text-center">
                  <h3
                    className="text-xl text-wine"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* ── BACK: details ────────────────────────── */}
              <div
                className="
                  absolute inset-0
                  [backface-visibility:hidden]
                  [transform:rotateY(180deg)]
                  bg-wine text-cream border-4 border-mustard rounded-2xl
                  flex flex-col p-6 justify-between
                "
                style={{ boxShadow: "6px 6px 0 0 #F1A512" }}
              >
                <div>
                  <h3
                    className="text-xl mb-3"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed text-cream/90 mb-4"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {project.description}
                  </p>
                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-1 bg-mustard text-wine rounded-full border-2 border-cream/30"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Links */}
                <div className="flex gap-3 mt-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      className="text-sm px-4 py-2 bg-teal text-cream rounded-xl border-2 border-cream/30 transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
                      style={{ fontFamily: "var(--font-display)" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live site
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      className="text-sm px-4 py-2 bg-cream/20 text-cream rounded-xl border-2 border-cream/30 transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
                      style={{ fontFamily: "var(--font-display)" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Stripe band divider ──────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 stripe-band"
      />
    </section>
  );
}
