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

      {/* ── Hero card (Global Container) ─────────────── */}
      <div
        ref={cardRef}
        className="relative z-30 mx-auto max-w-6xl w-full px-6 md:px-8 flex flex-col gap-10 md:flex-row md:items-center md:gap-16 lg:gap-24 gsap-hero-card"
      >
        {/* Photo placeholder — tilted polaroid frame */}
        <div className="shrink-0 self-start">
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
        </div>

        {/* Text content */}
        <div className="flex flex-col max-w-xl text-left">
          {/* Brand/Kicker */}
          <h1 
            className="text-2xl md:text-3xl tracking-tight text-wine/90"
            style={{ fontFamily: "var(--font-display)" }}
          >
            gab.io
          </h1>

          {/* 1. Headline */}
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-wine leading-[1.1] tracking-tight mt-4 min-h-[4rem] md:min-h-[5rem]"
            style={{ fontFamily: "var(--font-display)" }}
            aria-label="Designing interfaces that move."
          >
            <span ref={introRef} className={hasAnimated ? "" : "typewriter-cursor"}>
              Designing interfaces that move.
            </span>
          </h2>

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
              className="group relative inline-flex items-center justify-center px-6 py-3 bg-wine text-cream rounded-md outline-none focus-visible:ring-4 focus-visible:ring-mustard transition-all duration-100 ease-out"
              style={{
                fontFamily: "var(--font-display)",
                maskImage: "radial-gradient(circle at 0 50%, transparent 6px, black 6.5px) 0 0 / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 6px, black 6.5px) 100% 0 / 51% 100% no-repeat",
                WebkitMaskImage: "radial-gradient(circle at 0 50%, transparent 6px, black 6.5px) 0 0 / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 6px, black 6.5px) 100% 0 / 51% 100% no-repeat",
                filter: "drop-shadow(5px 5px 0px #2BAF90)",
                transform: "translate(0, 0) rotate(0deg)"
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.filter = "drop-shadow(3px 3px 0px #2BAF90)";
                el.style.transform = "translate(2px, 2px) rotate(0.5deg)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.filter = "drop-shadow(5px 5px 0px #2BAF90)";
                el.style.transform = "translate(0, 0) rotate(0deg)";
              }}
              onMouseDown={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transitionDuration = "50ms"; // Snap down faster
                el.style.filter = "drop-shadow(0px 0px 0px #2BAF90)";
                el.style.transform = "translate(5px, 5px) rotate(0deg)";
              }}
              onMouseUp={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transitionDuration = "100ms"; // Normal speed back up
                el.style.filter = "drop-shadow(3px 3px 0px #2BAF90)";
                el.style.transform = "translate(2px, 2px) rotate(0.5deg)";
              }}
            >
              <span className="pr-4 border-r-2 border-dashed border-cream/40 py-1">See my work</span>
              <span className="pl-4 text-xl">→</span>
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
