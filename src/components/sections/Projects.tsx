"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ContourBackground from "@/components/contour-background";
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
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", "Personal", "Web Dev", "E-Commerce", "Educational"];

  const filteredProjects = projects.filter(
    (p) =>
      activeFilter === "All" ||
      (p.type && p.type.toLowerCase().includes(activeFilter.toLowerCase()))
  );

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
  }, { dependencies: [activeFilter] });

  return (
    <section
      ref={sectionRef}
      id="projects"
      aria-label="Projects"
      className="relative isolate overflow-hidden py-20 md:py-32"
    >
      <ContourBackground variant="b" maskType="center" className="z-0" />
      <div className="relative z-30 mx-auto max-w-6xl w-full px-6 md:px-8">
        {/* Section heading */}
        <div className="mb-10 md:mb-12">
          <h2 className="text-3xl md:text-5xl text-wine mb-4">Featured Projects</h2>
          <p
            className="text-lg md:text-xl text-wine/80 max-w-2xl mb-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            A curated selection of my recent work, from personal side projects to full-stack applications and organizational websites.
          </p>

          {/* Sorter Pills */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`
                  px-4 py-2 rounded-full border-2 transition-all duration-300 font-bold text-sm uppercase tracking-wider
                  ${
                    activeFilter === category
                      ? "bg-wine text-cream border-wine shadow-[4px_4px_0_0_#F1A512]"
                      : "bg-cream/50 text-wine border-wine/20 hover:border-wine/50 hover:bg-cream"
                  }
                `}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Project cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {filteredProjects.map((project, i) => (
          <Dialog key={project.slug || project.title}>
            <DialogTrigger
              ref={(el) => { cardsRef.current[i] = el; }}
              className={`group outline-none focus-visible:ring-4 focus-visible:ring-mustard rounded-2xl ${i === 0 ? "md:col-span-2" : ""}`}
              aria-label={`View details for ${project.title}`}
            >
              <div
                  className={`
                    relative w-full
                    bg-cream border-4 border-wine rounded-2xl
                    flex flex-col overflow-hidden text-left
                    ${i === 0 ? "aspect-square md:aspect-[16/9]" : "aspect-square md:aspect-[4/3]"}
                    transition-all duration-100 ease-out
                    shadow-[6px_6px_0_0_#8C0027]
                    group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[4px_4px_0_0_#8C0027]
                    group-active:translate-x-[6px] group-active:translate-y-[6px] group-active:shadow-none
                  `}
                >
                  {/* Image area */}
                  <div className="flex-1 relative bg-mint/40 flex items-center justify-center border-b-4 border-wine overflow-hidden">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.imageAlt || `Screenshot of the ${project.title} homepage`}
                        fill
                        className="object-cover object-left-top grayscale sepia-[.5] contrast-125 transition-all duration-150 group-hover:grayscale-0 group-hover:sepia-0 group-hover:contrast-100"
                      />
                    ) : (
                      <span className="text-6xl transition-transform duration-150 group-hover:scale-110">🎞️</span>
                    )}
                  </div>
                  {/* Title strip */}
                  <div className="p-4 flex items-center justify-between bg-cream">
                    <div className="flex items-center gap-3">
                      <h3
                        className="text-xl text-wine"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {project.title}
                      </h3>
                      {project.type && (
                        <span
                          className="px-2 py-1 text-[10px] uppercase tracking-wider bg-mustard text-wine rounded-md border-2 border-wine/20 font-bold"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {project.type}
                        </span>
                      )}
                    </div>
                    {project.year && (
                      <span className="text-wine/60 text-sm font-bold" style={{ fontFamily: "var(--font-body)" }}>
                        {project.year}
                      </span>
                    )}
                  </div>
              </div>
            </DialogTrigger>

            <DialogContent className="bg-wine text-cream border-4 border-mustard rounded-2xl p-6 sm:p-8 max-w-2xl" style={{ boxShadow: "8px 8px 0 0 #F1A512" }}>
              <div className="flex flex-col gap-6">
                <div>
                  <DialogTitle className="text-3xl mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    {project.title}
                  </DialogTitle>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.type && (
                      <span className="px-2 py-1 text-xs uppercase tracking-wider bg-mustard text-wine rounded-md border-2 border-wine/20 font-bold">
                        {project.type}
                      </span>
                    )}
                    {project.year && (
                      <span className="px-2 py-1 text-xs uppercase tracking-wider bg-cream/20 text-cream rounded-md border-2 border-cream/20 font-bold">
                        {project.year}
                      </span>
                    )}
                  </div>
                  <DialogDescription className="text-base leading-relaxed text-cream/90 mb-6" style={{ fontFamily: "var(--font-body)" }}>
                    {project.description}
                  </DialogDescription>
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
                <div className="flex gap-4 pt-4 border-t border-cream/20">
                  {project.liveUrl && project.liveUrl !== "#" && (
                    <a
                      href={project.liveUrl}
                      className="text-sm px-6 py-3 bg-teal text-cream rounded-xl border-2 border-cream/30 transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
                      style={{ fontFamily: "var(--font-display)" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live site
                    </a>
                  )}
                  {project.repoUrl && project.repoUrl !== "#" && (
                    <a
                      href={project.repoUrl}
                      className="text-sm px-6 py-3 bg-cream/20 text-cream rounded-xl border-2 border-cream/30 transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
                      style={{ fontFamily: "var(--font-display)" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Source code
                    </a>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
        </div>
      </div>

      {/* ── Stripe band divider ──────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute z-10 bottom-0 left-0 right-0 stripe-band"
      />
    </section>
  );
}
