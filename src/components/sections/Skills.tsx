"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills, type Skill } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Color map: data token → real hex for inline styles */
const colorHex: Record<Skill["color"], string> = {
  teal: "#2BAF90",
  mustard: "#F1A512",
  orange: "#DD4111",
  wine: "#8C0027",
};

/**
 * Skills section — "record collection."
 * Each skill is a vinyl disc that spins on hover.
 */
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const discsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    discsRef.current.forEach((disc, i) => {
      if (!disc) return;
      gsap.fromTo(
        disc,
        { opacity: 0, y: 40, rotate: -15 },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 0.5,
          delay: i * 0.06,
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
      id="skills"
      aria-label="Skills"
      className="relative py-20 md:py-32 bg-wine"
    >
      <div className="mx-auto max-w-6xl w-full px-6 md:px-8">
        <h2 className="text-3xl md:text-5xl text-cream mb-2">Skills</h2>
        <p
          className="text-cream/70 mb-8 md:mb-10 max-w-2xl text-sm md:text-base"
          style={{ fontFamily: "var(--font-body)" }}
        >
          My record collection of tools and technologies.
        </p>

        {/* Vinyl disc grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 lg:gap-8">
        {skills.map((skill, i) => (
          <div
            key={skill.name}
            ref={(el) => { discsRef.current[i] = el; }}
            className="flex flex-col items-center gap-3 group"
          >
            {/* Vinyl disc */}
            <div
              className="
                relative w-14 h-14 md:w-16 md:h-16
                rounded-full
                border-2 md:border-[3px]
                flex items-center justify-center
                transition-transform duration-500
                group-hover:rotate-[360deg]
              "
              style={{
                borderColor: colorHex[skill.color],
                background: `radial-gradient(circle at center, ${colorHex[skill.color]} 0%, ${colorHex[skill.color]} 18%, #1a1a1a 19%, #1a1a1a 22%, ${colorHex[skill.color]}33 23%, #2a2a2a 40%, #1a1a1a 60%, ${colorHex[skill.color]}44 80%, #2a2a2a 100%)`,
                boxShadow: `2px 2px 0 0 ${colorHex[skill.color]}`,
                transitionTimingFunction: "var(--ease-in-out)",
              }}
              aria-hidden="true"
            >
              {/* Center label hole */}
              <div
                className="
                  w-5 h-5 md:w-6 md:h-6
                  rounded-full bg-cream
                  border-[1px] md:border-2
                  flex items-center justify-center
                "
                style={{ borderColor: colorHex[skill.color] }}
              >
                <div
                  className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
                  style={{ backgroundColor: colorHex[skill.color] }}
                />
              </div>

              {/* Groove lines (subtle rings on the vinyl) */}
              <div
                className="absolute inset-1.5 md:inset-2 rounded-full border border-white/5 pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute inset-3 md:inset-4 rounded-full border border-white/5 pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute inset-[18px] md:inset-6 rounded-full border border-white/5 pointer-events-none"
                aria-hidden="true"
              />
            </div>

            {/* Skill name */}
            <span
              className="text-sm text-cream text-center"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {skill.name}
            </span>
          </div>
        ))}
        </div>
      </div>

      {/* Stripe band */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 stripe-band"
      />
    </section>
  );
}
