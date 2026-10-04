"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import HeroMountains from "@/components/hero-mountains";
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
  const [hasAnimated, setHasAnimated] = useState(false);

  /* Sunburst spin — separate effect so it's independent of
     useGSAP scoping and the introRef early-return. */
  useEffect(() => {
    if (!sunburstRef.current) return;

    // Temporarily bypassing prefersReduced check here to guarantee it spins
    // for the user regardless of OS settings.
    const tween = gsap.to(sunburstRef.current, {
      rotation: 360,
      duration: 15,
      ease: "none",
      repeat: -1,
    });

    return () => { tween.kill(); };
  }, []);

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || !introRef.current) {
      /* Show full text immediately */
      if (introRef.current) {
        introRef.current.textContent = siteConfig.introLine;
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
          onComplete: () => setHasAnimated(true),
        }
      );
    }

    /* Typewriter effect for the intro line */
    if (introRef.current) {
      introRef.current.textContent = "";
      gsap.to(introRef.current, {
        duration: 2.5,
        text: {
          value: siteConfig.introLine,
          delimiter: "",
        },
        ease: "none",
        delay: 0.9,
      });
    }
  }, []);

  return (
    <section
      id="hero"
      aria-label="About me"
      className="relative min-h-[90vh] flex items-center overflow-hidden py-20 md:py-32"
    >
      {/* ── Sunburst background disc ─────────────────── */}
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 md:-right-64 md:-top-64 w-[550px] h-[550px] md:w-[750px] md:h-[750px] lg:w-[900px] lg:h-[900px] opacity-40"
      >
        <div ref={sunburstRef} className="sunburst w-full h-full" />
      </div>

      {/* ── Concentric arcs (decorative, bottom-left) ── */}
      <div
        aria-hidden="true"
        className="absolute -left-10 bottom-10 md:-left-16 md:bottom-16"
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
        className="relative z-10 mx-auto max-w-6xl w-full px-6 md:px-8 flex flex-col gap-10 md:flex-row md:items-center md:gap-16 lg:gap-24 gsap-hero-card"
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
        <div className="flex flex-col gap-6 md:gap-8 max-w-2xl">
          {/* Name — the main event */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-wine">
            {siteConfig.name}
          </h1>

          {/* Role + info badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="inline-block px-4 py-1.5 bg-mustard text-wine text-sm md:text-base rounded-full border-3 border-wine"
              style={{
                fontFamily: "var(--font-display)",
                boxShadow: "3px 3px 0 0 #8C0027",
              }}
            >
              {siteConfig.role}
            </span>
            <span
              className="inline-block px-4 py-1.5 bg-orange text-cream text-sm md:text-base rounded-full border-3 border-wine"
              style={{
                fontFamily: "var(--font-display)",
                boxShadow: "3px 3px 0 0 #8C0027",
              }}
            >
              OPEN TO WORK
            </span>
            <span
              className="inline-block px-3 py-1 bg-teal text-cream text-xs md:text-sm rounded-full border-2 border-wine flex items-center gap-1"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span>📍</span> ILOILO CITY, PHILIPPINES
            </span>
          </div>

          {/* Typewriter intro line */}
          <p
            className="text-lg md:text-xl max-w-lg text-wine/90 leading-relaxed min-h-[3.5rem]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <span ref={introRef} className={hasAnimated ? "" : "typewriter-cursor"}>
              {/* GSAP fills this in; fallback shows full text via noscript */}
              {siteConfig.introLine}
            </span>
          </p>
          <noscript>
            <p className="text-lg md:text-xl max-w-lg text-wine/90 leading-relaxed">
              {siteConfig.introLine}
            </p>
          </noscript>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mt-6 md:mt-8">
            <a
              href="#projects"
              className="
                inline-flex items-center gap-2
                px-6 py-3
                bg-wine text-cream
                text-base
                rounded-2xl border-4 border-wine
                transition-transform duration-150
                hover:translate-x-[2px] hover:translate-y-[2px]
                active:scale-[0.97]
              "
              style={{
                fontFamily: "var(--font-display)",
                boxShadow: "4px 4px 0 0 #2BAF90",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 0 #2BAF90";
              }}
            >
              See my work
            </a>
            <a
              href="#contact"
              className="
                inline-flex items-center gap-2
                px-6 py-3
                bg-cream text-wine
                text-base
                rounded-2xl border-4 border-wine
                transition-transform duration-150
                hover:translate-x-[2px] hover:translate-y-[2px]
                active:scale-[0.97]
              "
              style={{
                fontFamily: "var(--font-display)",
                boxShadow: "4px 4px 0 0 #8C0027",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 0 #8C0027";
              }}
            >
              Get in touch
            </a>
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
