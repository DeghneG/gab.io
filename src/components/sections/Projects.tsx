"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
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
            sizes={
              isFeatured
                ? "(max-width: 768px) 100vw, 1100px"
                : "(max-width: 768px) 100vw, 550px"
            }
            className={`object-cover ${project.imagePosition || "object-center"}`}
          />
        ) : (
          <span className="text-6xl transition-transform duration-150 group-hover:scale-110">🎞️</span>
        )}
      </div>
      {/* Title strip */}
      <div className="p-4 md:p-5 flex items-center justify-between bg-cream">
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
 * Animated Project Details Modal featuring GSAP Bouncy Pop & Staggered Cascade
 */
function ProjectDetailModal({ project }: { project: Project }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (!modalRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // 1. Initial starting state (bouncy squash origin)
      gsap.set(modalRef.current, {
        scale: 0.72,
        y: 40,
        rotation: -2,
        opacity: 0,
        boxShadow: "0px 0px 0 0 #F1A512",
        transformOrigin: "center center",
      });

      // 2. Energetic Pop & Spring on the main modal card
      tl.to(modalRef.current, {
        scale: 1,
        y: 0,
        rotation: 0,
        opacity: 1,
        boxShadow: "8px 8px 0 0 #F1A512",
        duration: 0.52,
        ease: "back.out(1.8)",
      })

      // 3. Close button pop & spin
      .fromTo(
        closeBtnRef.current,
        { scale: 0, rotation: -120, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.38, ease: "back.out(2.2)" },
        "-=0.36"
      )

      // 4. Title roll-up with playful skew
      .fromTo(
        titleRef.current,
        { y: 24, opacity: 0, skewX: -4 },
        { y: 0, opacity: 1, skewX: 0, duration: 0.36, ease: "power3.out" },
        "-=0.32"
      )

      // 5. Category & Year badges drop in with rubber stamp bounce
      .fromTo(
        ".modal-badge",
        { scale: 1.4, y: -12, opacity: 0, rotation: -6 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: 0.34,
          stagger: 0.08,
          ease: "elastic.out(1.3, 0.45)",
        },
        "-=0.28"
      )

      // 6. Description body fades and slides up smoothly
      .fromTo(
        descRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.34, ease: "power2.out" },
        "-=0.22"
      )

      // 7. Tech pills cascade in like pop pebbles
      .fromTo(
        ".modal-tech-tag",
        { scale: 0, y: 10, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.3, stagger: 0.04, ease: "back.out(2.5)" },
        "-=0.2"
      )

      // 8. Action buttons bounce up ready for click
      .fromTo(
        ".modal-action-btn",
        { scale: 0.85, y: 15, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.35,
          stagger: 0.08,
          ease: "elastic.out(1.2, 0.45)",
        },
        "-=0.15"
      );
    },
    { scope: modalRef }
  );

  const handleCloseMouseEnter = () => {
    if (closeBtnRef.current) {
      gsap.to(closeBtnRef.current, {
        rotation: 90,
        scale: 1.15,
        duration: 0.22,
        ease: "back.out(2)",
      });
    }
  };

  const handleCloseMouseLeave = () => {
    if (closeBtnRef.current) {
      gsap.to(closeBtnRef.current, {
        rotation: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      ref={modalRef}
      className="pointer-events-auto relative w-full max-w-2xl bg-wine text-cream border-4 border-mustard rounded-2xl p-6 sm:p-8"
      style={{ willChange: "transform, opacity, box-shadow" }}
    >
      {/* Playful Close Button */}
      <DialogClose
        ref={closeBtnRef}
        onMouseEnter={handleCloseMouseEnter}
        onMouseLeave={handleCloseMouseLeave}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-cream/15 hover:bg-mustard hover:text-wine text-cream flex items-center justify-center transition-colors border-2 border-cream/20 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-mustard"
        aria-label="Close dialog"
      >
        <X className="w-5 h-5 stroke-[2.5]" />
      </DialogClose>

      <div className="flex flex-col gap-6 pr-6 sm:pr-8">
        <div>
          <DialogTitle
            ref={titleRef}
            className="text-3xl sm:text-4xl mb-3 leading-tight text-cream"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </DialogTitle>

          <div className="flex flex-wrap gap-2.5 mb-6">
            {project.type && (
              <span
                className="modal-badge inline-block px-3 py-1 text-xs uppercase tracking-wider bg-mustard text-wine rounded-md border-2 border-wine/20 font-bold shadow-[2px_2px_0_0_#8C0027]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {project.type}
              </span>
            )}
            {project.year && (
              <span
                className="modal-badge inline-block px-3 py-1 text-xs uppercase tracking-wider bg-cream/20 text-cream rounded-md border-2 border-cream/20 font-bold"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {project.year}
              </span>
            )}
          </div>

          <DialogDescription
            ref={descRef}
            className="text-base sm:text-lg leading-relaxed text-cream/90 mb-6"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {project.description}
          </DialogDescription>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="modal-tech-tag inline-block text-xs sm:text-sm px-3 py-1 bg-mustard text-wine rounded-full border-2 border-cream/30 font-bold transition-transform hover:-translate-y-0.5"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-cream/20">
          {project.liveUrl && project.liveUrl !== "#" && (
            <a
              href={project.liveUrl}
              className="modal-action-btn inline-flex items-center justify-center text-sm sm:text-base px-6 py-3 bg-teal text-cream rounded-xl border-2 border-cream/30 font-bold shadow-[3px_3px_0_0_#F5F0E8] transition-transform duration-150 hover:scale-[1.04] active:scale-[0.96]"
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
              className="modal-action-btn inline-flex items-center justify-center text-sm sm:text-base px-6 py-3 bg-cream/20 hover:bg-cream/30 text-cream rounded-xl border-2 border-cream/30 font-bold shadow-[3px_3px_0_0_#F1A512] transition-transform duration-150 hover:scale-[1.04] active:scale-[0.96]"
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
  );
}

/**
 * ───────────────────────────────────────────────────────────
 * LARGE MARGIN SHAPES CONFIGURATION
 * ───────────────────────────────────────────────────────────
 */
export const MARGIN_SHAPES_CONFIG = {
  leftCircleWidth: 460, // Width in px
  leftCropPercent: 60, // ~60% cropped by left screen edge
  tealOpacity: 0.22, // 22% teal opacity
  ringBorderWidth: 4, // 4px ring
  ringOpacity: 0.18, // 18% wine ring opacity
  ringOffset: 18, // Offset 18px right and down

  rightMaxRadius: 380, // Outermost radius in px
  bandThickness: 28, // 28px thickness per band
  arcOpacity: 0.22, // 22% opacity each (teal, mustard, orange)
};

/**
 * ───────────────────────────────────────────────────────────
 * CONTACT-SHEET FRAMES CONFIGURATION
 * ───────────────────────────────────────────────────────────
 */
export const CONTACT_FRAMES_CONFIG = {
  borderWidth: 3, // 3px border
  borderColor: "rgba(140, 0, 39, 0.14)", // 14% wine border
  borderRadius: 10, // 10px rounded corners
  frames: [
    // Frame 1: Left margin lower area, tilted -8deg
    { width: 120, height: 160, rotate: -8, bottom: "10%", left: "1.5vw" },
    // Frame 2: Right margin upper area, tilted 5deg
    { width: 160, height: 110, rotate: 5, top: "28%", right: "1.5vw" },
    // Frame 3: Right margin lower area, tilted -4deg
    { width: 110, height: 150, rotate: -4, bottom: "12%", right: "1.5vw" },
  ],
};

/**
 * ───────────────────────────────────────────────────────────
 * REGISTRATION MARKS CONFIGURATION
 * ───────────────────────────────────────────────────────────
 */
export const REGISTRATION_MARKS_CONFIG = {
  size: 16, // 16px marks
  strokeWidth: 1.5, // 1.5px strokes
  opacity: 0.2, // 20% wine opacity
  inset: 24, // 24px inset from corners
};

/**
 * Large margin shapes:
 * - Left: 460px teal circle (~60% cropped) + offset 4px wine ring.
 * - Right: 3 concentric arc bands (teal, mustard, orange) entering from top-right corner.
 * Scaled to 70% at 1280px-1440px and clamped so they never overlap the content container.
 */
function LargeMarginShapes() {
  const {
    leftCircleWidth,
    leftCropPercent,
    tealOpacity,
    ringBorderWidth,
    ringOpacity,
    ringOffset,
    rightMaxRadius,
    bandThickness,
    arcOpacity,
  } = MARGIN_SHAPES_CONFIG;

  const leftOffsetPx = (leftCircleWidth * leftCropPercent) / 100;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] hidden xl:block select-none"
    >
      {/* ── Left Shape: Teal Circle & Offset Wine Ring ── */}
      <div
        className="absolute top-1/2 -translate-y-1/2 scale-70 2xl:scale-100 origin-left transition-transform duration-300"
        style={{
          left: `-${leftOffsetPx}px`,
          width: `${leftCircleWidth + ringOffset + ringBorderWidth}px`,
          height: `${leftCircleWidth + ringOffset + ringBorderWidth}px`,
        }}
      >
        {/* Solid Teal Circle */}
        <div
          className="absolute rounded-full"
          style={{
            width: `${leftCircleWidth}px`,
            height: `${leftCircleWidth}px`,
            backgroundColor: "#2BAF90",
            opacity: tealOpacity,
          }}
        />

        {/* 4px Wine Ring, offset 18px right and 18px down */}
        <div
          className="absolute rounded-full"
          style={{
            width: `${leftCircleWidth}px`,
            height: `${leftCircleWidth}px`,
            border: `${ringBorderWidth}px solid #8C0027`,
            opacity: ringOpacity,
            transform: `translate(${ringOffset}px, ${ringOffset}px)`,
          }}
        />
      </div>

      {/* ── Right Shape: Three Concentric Arc Bands entering from top-right corner ── */}
      <div
        className="absolute top-0 right-0 scale-70 2xl:scale-100 origin-top-right transition-transform duration-300"
        style={{
          width: `${rightMaxRadius}px`,
          height: `${rightMaxRadius}px`,
        }}
      >
        <svg
          className="w-full h-full"
          width={rightMaxRadius}
          height={rightMaxRadius}
          viewBox={`0 0 ${rightMaxRadius} ${rightMaxRadius}`}
        >
          {/* Outer arc: Teal */}
          <circle
            cx={rightMaxRadius}
            cy="0"
            r={rightMaxRadius - bandThickness / 2}
            stroke="#2BAF90"
            strokeOpacity={arcOpacity}
            strokeWidth={bandThickness}
            fill="none"
          />
          {/* Middle arc: Mustard */}
          <circle
            cx={rightMaxRadius}
            cy="0"
            r={rightMaxRadius - bandThickness * 1.5}
            stroke="#F1A512"
            strokeOpacity={arcOpacity}
            strokeWidth={bandThickness}
            fill="none"
          />
          {/* Inner arc: Orange */}
          <circle
            cx={rightMaxRadius}
            cy="0"
            r={rightMaxRadius - bandThickness * 2.5}
            stroke="#DD4111"
            strokeOpacity={arcOpacity}
            strokeWidth={bandThickness}
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * Contact-Sheet Frames: 3 empty tilted rectangles in the outer margins.
 * Visible at >= 1440px (2xl:block) where margin width exceeds frame dimensions.
 */
function ContactSheetFrames() {
  const { borderWidth, borderColor, borderRadius, frames } =
    CONTACT_FRAMES_CONFIG;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[3] hidden 2xl:block select-none"
    >
      {frames.map((frame, idx) => (
        <div
          key={idx}
          className="absolute"
          style={{
            width: `${frame.width}px`,
            height: `${frame.height}px`,
            border: `${borderWidth}px solid ${borderColor}`,
            borderRadius: `${borderRadius}px`,
            transform: `rotate(${frame.rotate}deg)`,
            top: frame.top,
            bottom: frame.bottom,
            left: frame.left,
            right: frame.right,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Registration Marks: Small crosshair-in-circle marks in the 4 corners of the section.
 */
function RegistrationMarks() {
  const { size, strokeWidth, opacity, inset } = REGISTRATION_MARKS_CONFIG;
  const half = size / 2;
  const radius = half - 2;

  const corners = [
    { style: { top: `${inset}px`, left: `${inset}px` } },
    { style: { top: `${inset}px`, right: `${inset}px` } },
    { style: { bottom: `${inset}px`, left: `${inset}px` } },
    { style: { bottom: `${inset}px`, right: `${inset}px` } },
  ];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[12] hidden xl:block select-none"
    >
      {corners.map((corner, idx) => (
        <svg
          key={idx}
          className="absolute"
          style={{ width: `${size}px`, height: `${size}px`, ...corner.style }}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={half}
            cy={half}
            r={radius}
            stroke="#8C0027"
            strokeOpacity={opacity}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <line
            x1="1"
            y1={half}
            x2={size - 1}
            y2={half}
            stroke="#8C0027"
            strokeOpacity={opacity}
            strokeWidth={strokeWidth}
          />
          <line
            x1={half}
            y1="1"
            x2={half}
            y2={size - 1}
            stroke="#8C0027"
            strokeOpacity={opacity}
            strokeWidth={strokeWidth}
          />
        </svg>
      ))}
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
      className="relative isolate overflow-x-clip py-16 md:py-24 lg:py-28"
    >
      {/* ── 3. Top stripe band divider (14px tall) ───── */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 z-20 stripe-band"
        style={{ height: "14px" }}
      />

      {/* ── 1. Large margin shapes (z-[2]) ────────── */}
      <LargeMarginShapes />

      {/* ── 2. Contact-sheet frames (z-[3]) ───────── */}
      <ContactSheetFrames />

      {/* ── 3. Registration marks (z-[12]) ────────── */}
      <RegistrationMarks />

      <div className="relative z-30 mx-auto max-w-6xl w-full px-6 md:px-8">
        {/* Section heading */}
        <div className="mb-8 md:mb-10">
          <h2 className="text-3xl md:text-5xl text-wine mb-6 md:mb-8">Featured Projects</h2>

          {/* Sorter Pills */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
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
                    disableAnimation
                    showCloseButton={false}
                    className="w-full max-w-2xl p-4 sm:p-6 flex items-center justify-center pointer-events-none"
                  >
                    <ProjectDetailModal project={project} />
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
