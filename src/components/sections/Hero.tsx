"use client";

import { useRef, useState } from "react";
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

  /* ── No sunburst rotation — fully static ────────── */

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

  return (
    <section
      id="hero"
      aria-label="About me"
      className="relative isolate min-h-[90vh] flex items-center overflow-hidden py-20 md:py-32"
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
        className="relative z-30 mx-auto max-w-7xl w-full px-8 flex flex-col gap-10 md:flex-row md:items-center md:gap-16 lg:gap-24 gsap-hero-card"
      >
        {/* Photo placeholder — tilted polaroid frame */}
        <div className="shrink-0 self-start relative">
          {/* SHADOW_OFFSET — 6px 6px hard wine shadow (already correct) */}
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
          {/* SHADOW_OFFSET — 6px 6px to match unified direction */}
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -right-4 md:-bottom-5 md:-right-5 rotate-12 pointer-events-none"
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
