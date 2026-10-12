"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { projects, type Project } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Single project card with GSAP rubber-band squash & stretch + badge jiggle hover effects.
 */
function ProjectCardItem({
  project,
  isFeatured,
}: {
  project: Project;
  isFeatured: boolean;
}) {
  const cardInnerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = () => {
    if (!cardInnerRef.current) return;
    gsap.killTweensOf([cardInnerRef.current, badgeRef.current, imgRef.current]);

    // 1. Rubber-band squash and stretch timeline on card container
    gsap
      .timeline()
      .to(cardInnerRef.current, {
        scaleX: 1.05,
        scaleY: 0.95,
        y: -8,
        boxShadow: "10px 12px 0 0 #8C0027",
        duration: 0.12,
        ease: "power2.out",
      })
      .to(cardInnerRef.current, {
        scaleX: 0.96,
        scaleY: 1.04,
        duration: 0.14,
        ease: "power1.inOut",
      })
      .to(cardInnerRef.current, {
        scaleX: 1.02,
        scaleY: 0.99,
        duration: 0.12,
        ease: "power1.inOut",
      })
      .to(cardInnerRef.current, {
        scaleX: 1,
        scaleY: 1,
        y: -8,
        duration: 0.4,
        ease: "elastic.out(1.4, 0.35)",
      });

    // 2. Playful jiggle on category badge
    if (badgeRef.current) {
      gsap
        .timeline({ delay: 0.04 })
        .to(badgeRef.current, {
          rotation: -10,
          scale: 1.15,
          duration: 0.1,
          ease: "power2.out",
        })
        .to(badgeRef.current, {
          rotation: 8,
          duration: 0.12,
          ease: "power1.inOut",
        })
        .to(badgeRef.current, {
          rotation: -5,
          duration: 0.1,
          ease: "power1.inOut",
        })
        .to(badgeRef.current, {
          rotation: 0,
          scale: 1.05,
          duration: 0.35,
          ease: "elastic.out(1.5, 0.3)",
        });
    }

    // 3. Smooth image scale
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        scale: 1.06,
        duration: 0.35,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (!cardInnerRef.current) return;
    gsap.killTweensOf([cardInnerRef.current, badgeRef.current, imgRef.current]);

    gsap.to(cardInnerRef.current, {
      scaleX: 1,
      scaleY: 1,
      y: 0,
      boxShadow: "6px 6px 0 0 #8C0027",
      duration: 0.3,
      ease: "power3.out",
    });

    if (badgeRef.current) {
      gsap.to(badgeRef.current, {
        rotation: 0,
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
      });
    }

    if (imgRef.current) {
      gsap.to(imgRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseDown = () => {
    if (!cardInnerRef.current) return;
    gsap.to(cardInnerRef.current, {
      scaleX: 0.97,
      scaleY: 0.97,
      y: 3,
      boxShadow: "2px 2px 0 0 #8C0027",
      duration: 0.08,
      ease: "power2.out",
    });
  };

  const handleMouseUp = () => {
    if (!cardInnerRef.current) return;
    gsap.to(cardInnerRef.current, {
      scaleX: 1,
      scaleY: 1,
      y: -8,
      boxShadow: "10px 12px 0 0 #8C0027",
      duration: 0.25,
      ease: "elastic.out(1.2, 0.4)",
    });
  };

  return (
    <div
      ref={cardInnerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      className={`
        relative w-full
        bg-cream border-4 border-wine rounded-2xl
        flex flex-col overflow-hidden text-left cursor-pointer
        ${isFeatured ? "aspect-square md:aspect-[16/9]" : "aspect-square md:aspect-[4/3]"}
        shadow-[6px_6px_0_0_#8C0027]
      `}
      style={{ willChange: "transform, box-shadow" }}
    >
      {/* Image area */}
      <div className="flex-1 relative bg-mint/40 flex items-center justify-center border-b-4 border-wine overflow-hidden">
        {project.image ? (
          <Image
            ref={imgRef}
            src={project.image}
            alt={project.imageAlt || `Screenshot of the ${project.title} homepage`}
            fill
            className={`object-cover ${project.imagePosition || "object-center"}`}
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
              ref={badgeRef}
              className="inline-block px-2 py-1 text-[10px] uppercase tracking-wider bg-mustard text-wine rounded-md border-2 border-wine/20 font-bold origin-center"
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
  );
}

/**
 * Subtle hand-drawn contour hill cluster behind the projects grid.
 * Concentric irregular rings centered behind the cards, extending into margins and gaps.
 */
function ProjectsContourHill() {
  return (
    <div
      aria-hidden="true"
      className="hidden md:block pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[1400px] max-w-none h-[900px] z-0 overflow-hidden"
      style={{
        maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
      }}
    >
      <svg
        viewBox="0 0 1400 900"
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full"
      >
        {/* Ring 1 (innermost) — Wine 8% */}
        <path
          d="M700,380 C745,378 780,412 775,455 C770,498 740,530 698,528 C656,526 625,492 628,450 C631,408 658,382 700,380 Z"
          stroke="#8C0027"
          strokeOpacity="0.08"
        />
        {/* Ring 2 — Wine 8% */}
        <path
          d="M700,320 C775,316 835,376 830,455 C825,534 765,585 695,582 C625,579 568,524 572,448 C576,372 624,324 700,320 Z"
          stroke="#8C0027"
          strokeOpacity="0.08"
        />
        {/* Ring 3 — Single Accent: Mustard 35% */}
        <path
          d="M702,250 C815,245 905,340 900,455 C895,570 805,650 692,648 C578,646 498,560 502,445 C506,330 590,255 702,250 Z"
          stroke="#F1A512"
          strokeOpacity="0.35"
        />
        {/* Ring 4 — Wine 8% */}
        <path
          d="M698,175 C855,170 985,295 980,455 C975,615 855,730 690,725 C525,720 415,600 420,442 C425,285 540,180 698,175 Z"
          stroke="#8C0027"
          strokeOpacity="0.08"
        />
        {/* Ring 5 — Wine 8% */}
        <path
          d="M705,100 C900,95 1065,255 1060,455 C1055,655 895,815 688,810 C480,805 332,648 338,445 C344,242 510,105 705,100 Z"
          stroke="#8C0027"
          strokeOpacity="0.08"
        />
        {/* Ring 6 — Wine 8% */}
        <path
          d="M700,20 C945,15 1150,215 1145,455 C1140,695 935,895 685,890 C435,885 248,690 255,445 C262,200 455,25 700,20 Z"
          stroke="#8C0027"
          strokeOpacity="0.08"
        />
        {/* Ring 7 (outermost) — Wine 8% */}
        <path
          d="M695,-60 C990,-65 1235,175 1230,455 C1225,735 975,980 680,975 C385,970 160,735 168,445 C175,155 400,-55 695,-60 Z"
          stroke="#8C0027"
          strokeOpacity="0.08"
        />
      </svg>
    </div>
  );
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
      {/* ── 3. Top stripe band divider (14px tall) ───── */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 z-20 stripe-band"
        style={{ height: "14px" }}
      />

      {/* ── 2. Contour hill cluster behind the grid ───── */}
      <ProjectsContourHill />

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-10 lg:gap-y-12">
          {filteredProjects.map((project, i) => {
            const isFeatured = i === 0;
            return (
              <div
                key={project.slug || project.title}
                className={`relative z-10 ${isFeatured ? "md:col-span-2" : ""}`}
              >
                {/* ── 1. Offset teal block behind featured card ── */}
                {isFeatured && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-[1] rounded-2xl bg-teal translate-x-2.5 translate-y-2.5 md:translate-x-4 md:translate-y-4"
                  />
                )}

                <Dialog>
                  <DialogTrigger
                    ref={(el) => {
                      cardsRef.current[i] = el;
                    }}
                    className="group outline-none focus-visible:ring-4 focus-visible:ring-mustard rounded-2xl w-full block text-left cursor-pointer"
                    aria-label={`View details for ${project.title}`}
                  >
                    <ProjectCardItem project={project} isFeatured={isFeatured} />
                  </DialogTrigger>

                  <DialogContent
                    className="bg-wine text-cream border-4 border-mustard rounded-2xl p-6 sm:p-8 max-w-2xl"
                    style={{ boxShadow: "8px 8px 0 0 #F1A512" }}
                  >
                    <div className="flex flex-col gap-6">
                      <div>
                        <DialogTitle
                          className="text-3xl mb-2"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
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
                        <DialogDescription
                          className="text-base leading-relaxed text-cream/90 mb-6"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
