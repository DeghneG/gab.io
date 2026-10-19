"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import HeroMountains from "@/components/hero-mountains";
import ContourBackground from "@/components/contour-background";
import { siteConfig } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin);
}

/**
 * Hero / About section.
 *
 * Layout: left-aligned, asymmetric (DESIGN_VARIANCE > 4).
 * Static sunburst disc sits partly behind the mountains.
 * Intro line types out with GSAP TextPlugin.
 * Content is always visible; animation is progressive enhancement.
 *
 * TUNABLES (search these tokens to adjust):
 *   GRAIN_OPACITY     — hero grain overlay opacity (0.07 = 7%)
 *   CONTOUR_OPACITY   — contour lines opacity class (opacity-[0.05] = 5%)
 *   SHADOW_OFFSET     — unified hard shadow "6px 6px 0 0"
 *   RING_WIDTH        — 4px wine outline ring width
 *   SUN_POSITION      — sunburst right/bottom offsets & mountain overlap
 */
export default function Hero() {
  const introRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const halfCircleRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  /* ── Interactive Photo Hover Transition ──────────── */
  const photoFrameRef = useRef<HTMLDivElement>(null);
  const formalPhotoRef = useRef<HTMLDivElement>(null);
  const casualPhotoRef = useRef<HTMLDivElement>(null);
  const starStickerRef = useRef<HTMLDivElement>(null);
  const cloudsRef = useRef<(HTMLDivElement | null)[]>([]);
  const photoTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isCasualActive, setIsCasualActive] = useState(false);

  /* ── No sunburst rotation — fully static ────────── */

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* Setup Photo Hover Slide-Down Timeline */
    if (formalPhotoRef.current && casualPhotoRef.current) {
      // Set initial state for comic cloud puffs
      cloudsRef.current.forEach((cloud) => {
        if (cloud) gsap.set(cloud, { scale: 0, opacity: 0 });
      });

      if (prefersReduced) {
        gsap.set(formalPhotoRef.current, { yPercent: 0 });
        gsap.set(casualPhotoRef.current, { yPercent: 0, opacity: 0 });
        const tl = gsap.timeline({
          paused: true,
          onStart: () => setIsCasualActive(true),
          onReverseComplete: () => setIsCasualActive(false),
        });
        tl.to(formalPhotoRef.current, { opacity: 0, duration: 0.2 }, 0);
        tl.to(casualPhotoRef.current, { opacity: 1, duration: 0.2 }, 0);
        const validClouds = cloudsRef.current.filter(Boolean);
        if (validClouds.length > 0) {
          tl.to(validClouds, { scale: 1, opacity: 1, duration: 0.2 }, 0);
        }
        photoTimelineRef.current = tl;
      } else {
        gsap.set(formalPhotoRef.current, { yPercent: 0 });
        gsap.set(casualPhotoRef.current, { yPercent: -100 });

        const tl = gsap.timeline({
          paused: true,
          onStart: () => setIsCasualActive(true),
          onReverseComplete: () => setIsCasualActive(false),
        });

        // 1. Photo frame cartoon squash & stretch into elevated tilt
        if (photoFrameRef.current) {
          tl.to(
            photoFrameRef.current,
            {
              scaleX: 1.05,
              scaleY: 0.95,
              duration: 0.1,
              ease: "power2.out",
            },
            0
          ).to(
            photoFrameRef.current,
            {
              scaleX: 1,
              scaleY: 1,
              rotate: -1,
              y: -5,
              boxShadow: "8px 8px 0 0 #8C0027",
              duration: 0.4,
              ease: "elastic.out(1.2, 0.4)",
            },
            0.1
          );
        }

        // 2. Retro Comic Cloud Puffs pop out around the frame
        const validClouds = cloudsRef.current.filter(Boolean);
        if (validClouds.length > 0) {
          tl.to(
            validClouds,
            {
              scale: 1,
              opacity: 1,
              duration: 0.45,
              stagger: 0.04,
              ease: "back.out(2.2)",
            },
            0.02
          );
        }

        // 3. Gold star sticker bounces with excitement
        if (starStickerRef.current) {
          tl.to(
            starStickerRef.current,
            {
              rotate: 32,
              scale: 1.25,
              duration: 0.45,
              ease: "back.out(2.5)",
            },
            0.04
          );
        }

        // 4. Formal photo slides down and exits at bottom
        tl.to(
          formalPhotoRef.current,
          {
            yPercent: 100,
            duration: 0.65,
            ease: "power3.inOut",
          },
          0
        );

        // 5. Casual photo slides down into the frame from top
        tl.to(
          casualPhotoRef.current,
          {
            yPercent: 0,
            duration: 0.65,
            ease: "power3.out",
          },
          0
        );

        photoTimelineRef.current = tl;
      }
    }

    if (prefersReduced || !introRef.current) {
      /* Show full text immediately */
      if (introRef.current) {
        introRef.current.textContent = "Designing interfaces that move.";
      }
      setHasAnimated(true);
      return;
    }

    /* Half-circle fade in — synced with the entrance sequence */
    if (halfCircleRef.current) {
      gsap.fromTo(
        halfCircleRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.15,
        }
      );
    }

    /* Card entrance: fade in and slide up */
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.15,
        }
      );
    }

    /* Typewriter effect for the headline */
    if (introRef.current) {
      introRef.current.textContent = "";
      gsap.to(introRef.current, {
        duration: 2.5,
        text: {
          value: "Designing interfaces that move.",
          delimiter: "",
        },
        ease: "none",
        delay: 0.9,
        onComplete: () => setHasAnimated(true),
      });
    }
  }, []);

  const handlePhotoMouseEnter = () => {
    if (photoTimelineRef.current) {
      photoTimelineRef.current.play();
    }
  };

  const handlePhotoMouseLeave = () => {
    if (photoTimelineRef.current) {
      photoTimelineRef.current.reverse();
    }
  };

  const handlePhotoClick = () => {
    if (!photoTimelineRef.current) return;
    if (photoTimelineRef.current.progress() === 0) {
      photoTimelineRef.current.play();
    } else {
      photoTimelineRef.current.reverse();
    }
  };

  return (
    <section
      id="hero"
      aria-label="About me"
      className="relative isolate min-h-[85vh] flex items-center overflow-hidden py-16 md:py-24 lg:py-28"
    >
      {/* ── LAYER 1: Contour lines (very subtle) ─────── */}
      {/* CONTOUR_OPACITY — change the opacity-[…] value to adjust */}
      <ContourBackground variant="a" maskType="hero" className="z-0 opacity-[0.05]" />

      {/* ── LAYER 2: Half-circle wine ring (left-bleed) ─ */}
      {/* RING_WIDTH — 4px wine outline ring (teal fill removed for a calmer feel) */}
      <div
        ref={halfCircleRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-[5] hidden lg:block"
        style={{
          width: "70vmin",
          height: "70vmin",
          left: "-30vmin",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {/* Wine outline ring (4px) with 6px hard shadow — mint background shows through */}
        <div
          className="absolute inset-0 rounded-full border-[4px] border-wine"
          style={{
            boxShadow: "6px 6px 0 0 #8C0027",
          }}
        />
      </div>

      {/* ── LAYER 3: Sunburst (static, 35% smaller, lower ⅓ behind mountains) */}
      {/* SUN_POSITION — 48px+ clear of paragraph text, lower ⅓ behind mountains */}
      <div
        aria-hidden="true"
        className="absolute z-10 w-[360px] h-[360px] md:w-[490px] md:h-[490px] lg:w-[585px] lg:h-[585px] -right-24 md:-right-64 lg:-right-72 xl:-right-44 2xl:-right-24"
        style={{
          bottom: "4vh",
        }}
      >
        <div className="sunburst w-full h-full rounded-full" />
      </div>

      {/* ── LAYER 4: Mountains ───────────────────────── */}
      <HeroMountains />

      {/* ── LAYER 5: Hero grain (above shapes, below content) */}
      {/* GRAIN_OPACITY — change opacity to adjust grain strength */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[25] pointer-events-none"
        style={{
          opacity: 0.07,
          mixBlendMode: "multiply",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── LAYER 6: Hero content ────────────────────── */}
      <div
        ref={cardRef}
        className="relative z-30 mx-auto max-w-7xl w-full px-6 md:px-8 flex flex-col gap-8 md:flex-row md:items-center md:gap-14 lg:gap-16 gsap-hero-card"
      >
        {/* Photo — tilted polaroid frame with interactive hover reveal */}
        <div className="shrink-0 self-start relative select-none">
          {/* ── Retro Comic Cloud Puffs (Pop out on hover) ── */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0">
            {/* Cloud 1: Top-Left (Chunky 4-bubble puff) */}
            <div
              ref={(el) => {
                cloudsRef.current[0] = el;
              }}
              className="absolute -top-7 -left-10 w-20 md:w-24 -rotate-12 origin-bottom-right"
              style={{ filter: "drop-shadow(4px 4px 0 #8C0027)" }}
            >
              <svg viewBox="0 0 100 70" fill="none" className="w-full h-auto">
                <path
                  d="M 22 52 C 10 52, 4 42, 10 30 C 5 18, 18 10, 32 14 C 40 4, 62 4, 72 14 C 84 8, 96 18, 92 32 C 100 42, 92 54, 80 52 C 78 62, 66 68, 52 64 C 40 68, 26 64, 22 52 Z"
                  fill="#F5F0E8"
                  stroke="#8C0027"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 28 34 C 34 28, 44 28, 48 34"
                  fill="none"
                  stroke="#8C0027"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 58 36 C 64 30, 72 32, 76 38"
                  fill="none"
                  stroke="#8C0027"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Cloud 2: Top-Right (Mint pastel accent puff) */}
            <div
              ref={(el) => {
                cloudsRef.current[1] = el;
              }}
              className="absolute -top-7 -right-8 w-18 md:w-22 rotate-8 origin-bottom-left"
              style={{ filter: "drop-shadow(4px 4px 0 #8C0027)" }}
            >
              <svg viewBox="0 0 85 65" fill="none" className="w-full h-auto">
                <path
                  d="M 18 48 C 8 48, 4 36, 12 26 C 8 14, 22 8, 34 12 C 44 4, 64 6, 70 18 C 82 20, 84 34, 76 44 C 78 52, 68 60, 56 58 C 45 62, 30 60, 24 52 C 20 52, 18 50, 18 48 Z"
                  fill="#C8E4CF"
                  stroke="#8C0027"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 30 30 C 36 26, 46 26, 50 32"
                  fill="none"
                  stroke="#8C0027"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Cloud 3: Mid-Left (Side smoke puff) */}
            <div
              ref={(el) => {
                cloudsRef.current[2] = el;
              }}
              className="absolute top-[38%] -left-9 w-14 md:w-16 -rotate-6 origin-right"
              style={{ filter: "drop-shadow(3px 3px 0 #8C0027)" }}
            >
              <svg viewBox="0 0 65 55" fill="none" className="w-full h-auto">
                <path
                  d="M 16 42 C 6 42, 2 30, 10 22 C 8 12, 20 6, 32 10 C 40 4, 54 6, 58 18 C 66 22, 66 34, 56 40 C 52 48, 38 50, 26 46 C 20 46, 18 44, 16 42 Z"
                  fill="#F5F0E8"
                  stroke="#8C0027"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M 24 26 C 28 22, 36 22, 40 26"
                  fill="none"
                  stroke="#8C0027"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Cloud 4: Bottom-Right (Behind the Star sticker) */}
            <div
              ref={(el) => {
                cloudsRef.current[3] = el;
              }}
              className="absolute -bottom-6 -right-7 w-20 md:w-24 rotate-12 origin-top-left"
              style={{ filter: "drop-shadow(4px 4px 0 #8C0027)" }}
            >
              <svg viewBox="0 0 95 70" fill="none" className="w-full h-auto">
                <path
                  d="M 20 50 C 8 50, 4 38, 12 28 C 8 16, 22 8, 36 12 C 46 4, 68 6, 76 16 C 88 12, 98 22, 94 36 C 102 46, 94 58, 82 56 C 80 66, 68 72, 54 68 C 42 72, 28 68, 22 56 C 20 56, 18 54, 20 50 Z"
                  fill="#F5F0E8"
                  stroke="#8C0027"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 32 34 C 38 28, 48 28, 52 34"
                  fill="none"
                  stroke="#8C0027"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M 64 36 C 70 30, 78 32, 82 38"
                  fill="none"
                  stroke="#8C0027"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Sparkle 1: Top Mustard Star */}
            <div
              ref={(el) => {
                cloudsRef.current[4] = el;
              }}
              className="absolute -top-9 left-[40%] w-6 h-6 rotate-12 origin-center"
              style={{ filter: "drop-shadow(2px 2px 0 #8C0027)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                <path
                  d="M 12 2 L 14.5 9.5 L 22 12 L 14.5 14.5 L 12 22 L 9.5 14.5 L 2 12 L 9.5 9.5 Z"
                  fill="#F1A512"
                  stroke="#8C0027"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Sparkle 2: Right Teal Star */}
            <div
              ref={(el) => {
                cloudsRef.current[5] = el;
              }}
              className="absolute top-[26%] -right-7 w-5 h-5 -rotate-12 origin-center"
              style={{ filter: "drop-shadow(2px 2px 0 #8C0027)" }}
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-full h-full">
                <path
                  d="M 10 1.5 L 12 8 L 18.5 10 L 12 12 L 10 18.5 L 8 12 L 1.5 10 L 8 8 Z"
                  fill="#2BAF90"
                  stroke="#8C0027"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Polaroid container */}
          <div
            ref={photoFrameRef}
            onMouseEnter={handlePhotoMouseEnter}
            onMouseLeave={handlePhotoMouseLeave}
            onClick={handlePhotoClick}
            className="
              relative z-10
              w-44 h-56 md:w-56 md:h-72
              rounded-3xl
              border-4 border-wine
              bg-cream overflow-hidden
              -rotate-3 cursor-pointer group
            "
            style={{ boxShadow: "6px 6px 0 0 #8C0027" }}
            aria-label="Portrait photo of Gabriel - hover to reveal casual photo"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handlePhotoClick();
              }
            }}
          >
            {/* 1. Formal Photo Layer (Default view: formal.png) */}
            <div
              ref={formalPhotoRef}
              className="absolute inset-0 w-full h-full will-change-transform z-10"
            >
              <Image
                src={siteConfig.heroPhoto}
                alt={`${siteConfig.name} - Formal`}
                fill
                priority
                sizes="(max-width: 768px) 176px, 224px"
                className="object-cover object-[center_12%]"
              />
            </div>

            {/* 2. Casual Photo Layer (Slides down on hover: DSC03695.JPG) */}
            <div
              ref={casualPhotoRef}
              className="absolute inset-0 w-full h-full will-change-transform z-20"
            >
              <Image
                src={siteConfig.casualPhoto}
                alt={`${siteConfig.name} - Casual`}
                fill
                priority
                sizes="(max-width: 768px) 176px, 224px"
                className="object-cover object-[center_18%]"
              />
              {/* Seam wiper strip attached to the bottom of casual photo that rolls down through the frame */}
              <div
                aria-hidden="true"
                className="absolute top-full left-0 right-0 h-3.5 stripe-band border-y border-wine/40 shadow-[0_3px_8px_rgba(0,0,0,0.4)]"
              />
            </div>


            {/* 4. Subtle hover cue label (bottom pill) */}
            <div
              className={`absolute bottom-2.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-2 py-0.5 rounded-full bg-wine/85 text-cream text-[9px] uppercase font-bold tracking-widest transition-opacity duration-300 ${
                isCasualActive ? "opacity-0" : "opacity-80 group-hover:opacity-100"
              }`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              Hover me ▾
            </div>
          </div>

          {/* ── Star / sparkle sticker ──────────────── */}
          <div
            ref={starStickerRef}
            aria-hidden="true"
            className="absolute -bottom-4 -right-4 md:-bottom-5 md:-right-5 rotate-12 pointer-events-none z-30 will-change-transform"
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              className="md:w-[68px] md:h-[68px] drop-shadow-[6px_6px_0_rgba(140,0,39,1)]"
            >
              {/* 4-pointed star */}
              <path
                d="M28 2 L33.5 20.5 L54 28 L33.5 35.5 L28 54 L22.5 35.5 L2 28 L22.5 20.5 Z"
                fill="#F1A512"
                stroke="#8C0027"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              {/* Inner sparkle dot */}
              <circle cx="28" cy="28" r="4" fill="#8C0027" />
            </svg>
          </div>
        </div>

        {/* Text content */}
        <div className="flex flex-col max-w-xl text-left">
          {/* 1. Headline */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl text-wine leading-[1.1] tracking-tight min-h-[4rem] md:min-h-[5rem]"
            style={{ fontFamily: "var(--font-display)" }}
            aria-label="Designing interfaces that move."
          >
            <span ref={introRef} className={hasAnimated ? "" : "typewriter-cursor"}>
              Designing interfaces that move.
            </span>
          </h1>

          {/* 2. Intro paragraph */}
          <p
            className="text-base md:text-lg text-wine leading-snug md:leading-normal max-w-prose mt-5 md:mt-6"
            style={{ fontFamily: "var(--font-body)" }}
          >
            I&apos;m Deghne Gabriel Agana, a third-year IT student at the University of San Agustin who builds front-end. <span className="font-semibold">Design got me in. Animation keeps me here.</span>
          </p>

          {/* 3. Actions row */}
          <div className="flex flex-wrap items-center gap-6 mt-7 md:mt-8">
            <a
              href="#projects"
              className="group relative inline-flex items-center justify-center px-6 py-3 bg-wine text-cream rounded-md outline-none focus-visible:ring-4 focus-visible:ring-mustard transition-transform active:scale-[0.97]"
              style={{
                fontFamily: "var(--font-display)",
                maskImage: "radial-gradient(circle at 0 50%, transparent 6px, black 6.5px) 0 0 / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 6px, black 6.5px) 100% 0 / 51% 100% no-repeat",
                WebkitMaskImage: "radial-gradient(circle at 0 50%, transparent 6px, black 6.5px) 0 0 / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 6px, black 6.5px) 100% 0 / 51% 100% no-repeat",
                filter: "drop-shadow(4px 4px 0px #2BAF90)",
              }}
            >
              <div className="relative overflow-hidden h-[28px]">
                <div className="flex flex-col transition-transform duration-200 ease-out group-hover:-translate-y-1/2">
                  {/* Frame 1 */}
                  <div className="flex items-center h-[28px]">
                    <span className="pr-4 border-r-2 border-dashed border-cream/40">See my work</span>
                    <span className="pl-4 text-xl leading-none">→</span>
                  </div>
                  {/* Frame 2 */}
                  <div className="flex items-center h-[28px] text-mustard">
                    <span className="pr-4 border-r-2 border-dashed border-mustard/40">See my work</span>
                    <span className="pl-4 text-xl leading-none">→</span>
                  </div>
                </div>
              </div>
            </a>

            <a
              href="#contact"
              className="group inline-flex items-center gap-2 text-wine font-bold text-lg outline-none focus-visible:ring-4 focus-visible:ring-mustard rounded-sm"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span className="border-b-4 border-orange pb-0.5">Get in touch</span>
              <svg
                width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            </a>
          </div>

          {/* 4. Meta row */}
          <div className="flex flex-wrap gap-3 mt-7 md:mt-8">
            {/* Location stamp */}
            <div
              className="inline-flex items-center justify-center px-3 py-1.5 border-2 border-wine border-double rounded-sm -rotate-2 bg-cream text-wine text-xs uppercase font-bold tracking-wider"
              style={{ fontFamily: "var(--font-body)" }}
            >
              ILOILO CITY, PHILIPPINES
            </div>
            
            {/* Availability badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-wine bg-cream text-wine text-xs uppercase font-bold tracking-wider"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mustard opacity-75 motion-reduce:hidden"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mustard"></span>
              </span>
              Open to projects and collaborations
            </div>
          </div>
        </div>
      </div>

      {/* ── Stripe band at the bottom ────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 stripe-band"
      />
    </section>
  );
}
