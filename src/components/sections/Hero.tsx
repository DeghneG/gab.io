"use client";

import { useRef, useState, useEffect } from "react";
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
 * Sunburst disc rotates slowly behind the content.
 * Intro line types out with GSAP TextPlugin.
 * Content is always visible; animation is progressive enhancement.
 */
export default function Hero() {
  const introRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const sunburstRef = useRef<HTMLDivElement>(null);
  const halfCircleRef = useRef<HTMLDivElement>(null);
  const ticketBtnRef = useRef<HTMLAnchorElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  /* Sunburst spin — separate effect so it's independent of
     the main useGSAP scoping and the introRef early-return. */
  useGSAP(() => {
    if (!sunburstRef.current) return;

    // Temporarily bypassing prefersReduced check here to guarantee it spins
    // for the user regardless of OS settings.
    gsap.to(sunburstRef.current, {
      rotation: 360,
      duration: 15,
      ease: "none",
      repeat: -1,
    });
  }, []);

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

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

    /* Card entrance: scale from 0.95 and fade in */
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

  return (
    <section
      id="hero"
      aria-label="About me"
      className="relative isolate min-h-[90vh] flex items-center overflow-hidden py-20 md:py-32"
    >
      <ContourBackground variant="a" maskType="hero" className="z-0" />

      {/* ── Half-circle (left-bleed, poster graphic) ─── */}
      <div
        ref={halfCircleRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-[5] hidden lg:block"
        style={{
          /* 70vmin circle, center sits at screen left edge,
             vertically at ~45% of the section so it aligns
             with the text block middle */
          width: "70vmin",
          height: "70vmin",
          left: "-30vmin",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {/* Solid teal disc */}
        <div
          className="absolute inset-0 rounded-full bg-teal"
        />
        {/* Concentric wine outline ring, 85% size, offset slightly */}
        <div
          className="absolute rounded-full border-[6px] border-wine"
          style={{
            width: "85%",
            height: "85%",
            top: "10%",
            left: "6%",
          }}
        />
      </div>

      {/* ── Sunburst background disc ─────────────────── */}
      <div
        aria-hidden="true"
        className="absolute z-10 -right-40 -top-40 md:-right-64 md:-top-64 w-[550px] h-[550px] md:w-[750px] md:h-[750px] lg:w-[900px] lg:h-[900px] opacity-40"
      >
        <div ref={sunburstRef} className="sunburst w-full h-full" />
      </div>

      {/* ── Concentric arcs (decorative, bottom-left) ── */}
      <div
        aria-hidden="true"
        className="absolute z-10 -left-10 bottom-10 md:-left-16 md:bottom-16"
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 180 180"
          fill="none"
          className="opacity-40"
        >
          <path
            d="M10 170 A160 160 0 0 1 170 10"
            stroke="#2BAF90"
            strokeWidth="5"
            fill="none"
          />
          <path
            d="M35 170 A135 135 0 0 1 170 35"
            stroke="#F1A512"
            strokeWidth="5"
            fill="none"
          />
          <path
            d="M60 170 A110 110 0 0 1 170 60"
            stroke="#DD4111"
            strokeWidth="5"
            fill="none"
          />
        </svg>
      </div>

      <HeroMountains />

      {/* ── Vertical label (left edge, lg+ only) ─────── */}
      <div
        aria-hidden="true"
        className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-[101] flex-col items-center gap-3 pointer-events-none"
      >
        {/* Top line */}
        <div className="w-[2px] h-20 bg-wine/50" />
        <span
          className="text-xs uppercase tracking-[0.25em] text-wine whitespace-nowrap"
          style={{
            fontFamily: "var(--font-body)",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          FRONT-END · IT STUDENT · 2026
        </span>
        {/* Bottom line */}
        <div className="w-[2px] h-20 bg-wine/50" />
      </div>

      {/* ── Hero card (Global Container) ─────────────── */}
      <div
        ref={cardRef}
        className="relative z-30 mx-auto max-w-7xl w-full px-8 flex flex-col gap-10 md:flex-row md:items-center md:gap-16 lg:gap-24 gsap-hero-card"
      >
        {/* Photo placeholder — tilted polaroid frame */}
        <div className="shrink-0 self-start relative">
          <div
            className="
              w-44 h-56 md:w-56 md:h-72
              rounded-3xl
              border-4 border-wine
              bg-cream overflow-hidden
              flex items-center justify-center
              -rotate-3
            "
            style={{ boxShadow: "6px 6px 0 0 #8C0027" }}
          >
            {/* Replace with next/image when you add a real photo */}
            <div className="text-center px-4">
              <span className="text-5xl" role="img" aria-label="Camera">
                📷
              </span>
              <p className="text-sm text-wine/60 mt-2" style={{ fontFamily: "var(--font-body)" }}>
                Your photo here
              </p>
            </div>
          </div>

          {/* ── Star / sparkle sticker ──────────────── */}
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -right-4 md:-bottom-5 md:-right-5 rotate-12 pointer-events-none"
          >
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              className="md:w-[68px] md:h-[68px] drop-shadow-[2px_2px_0_rgba(140,0,39,1)]"
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
            className="text-base md:text-lg text-wine leading-snug md:leading-normal max-w-prose mt-6"
            style={{ fontFamily: "var(--font-body)" }}
          >
            I&apos;m Deghne Gabriel Agana, a third-year IT student at the University of San Agustin who builds front-end. <span className="font-semibold">Design got me in. Animation keeps me here.</span>
          </p>

          {/* 3. Actions row */}
          <div className="flex flex-wrap items-center gap-6 mt-8">
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
          <div className="flex flex-wrap gap-3 mt-8">
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
