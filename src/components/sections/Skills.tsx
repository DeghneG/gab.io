"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillCategories, type Skill } from "@/data/content";

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
 * Individual Vinyl Record Skill Item with GSAP Turntable Spin-Up and Coast-to-Stop.
 */
function VinylSkillItem({
  skill,
  rowRef,
}: {
  skill: Skill;
  rowRef: (el: HTMLDivElement | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);

  const handleMouseEnter = () => {
    if (!discRef.current) return;

    // Stop any existing tweens on the disc and label
    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
    }
    gsap.killTweensOf([discRef.current, labelRef.current]);

    // 1. Continuous turntable spin (approx 33-45 RPM feel: 1 rotation every 1.2s)
    spinTweenRef.current = gsap.to(discRef.current, {
      rotation: "+=360",
      duration: 1.2,
      repeat: -1,
      ease: "none",
    });

    // 2. Disc lifts & expands colored shadow
    gsap.to(discRef.current, {
      scale: 1.1,
      boxShadow: `4px 4px 0 0 ${colorHex[skill.color]}`,
      duration: 0.25,
      ease: "power2.out",
    });

    // 3. Label shifts right and brightens
    if (labelRef.current) {
      gsap.to(labelRef.current, {
        x: 6,
        color: "#FFFFFF",
        duration: 0.25,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (!discRef.current) return;

    // Stop continuous loop and coast forward to a natural inertia stop
    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
      spinTweenRef.current = null;
    }
    gsap.killTweensOf([discRef.current, labelRef.current]);

    // Coast to stop: continues rotating forward by 120deg while decelerating
    gsap.to(discRef.current, {
      rotation: "+=120",
      scale: 1,
      boxShadow: `3px 3px 0 0 ${colorHex[skill.color]}`,
      duration: 0.7,
      ease: "power2.out",
    });

    if (labelRef.current) {
      gsap.to(labelRef.current, {
        x: 0,
        color: "rgba(245, 240, 232, 0.9)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        rowRef(el);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      className="flex flex-row items-center gap-3 cursor-pointer py-2 px-2 xl:px-2.5 rounded-xl transition-colors duration-150 hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-mustard select-none"
    >
      {/* Vinyl disc */}
      <div
        ref={discRef}
        className="
          relative w-10 h-10 xl:w-11 xl:h-11 shrink-0
          rounded-full
          border-2
          flex items-center justify-center
          select-none
        "
        style={{
          borderColor: colorHex[skill.color],
          background: `radial-gradient(circle at center, ${colorHex[skill.color]} 0%, ${colorHex[skill.color]} 18%, #1a1a1a 19%, #1a1a1a 22%, ${colorHex[skill.color]}33 23%, #2a2a2a 40%, #1a1a1a 60%, ${colorHex[skill.color]}44 80%, #2a2a2a 100%)`,
          boxShadow: `3px 3px 0 0 ${colorHex[skill.color]}`,
          willChange: "transform",
        }}
        aria-hidden="true"
      >
        {/* Center label hole */}
        <div
          className="
            w-3.5 h-3.5 xl:w-4 xl:h-4
            rounded-full bg-cream
            border-[1.5px]
            flex items-center justify-center
          "
          style={{ borderColor: colorHex[skill.color] }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: colorHex[skill.color] }}
          />
        </div>

        {/* Groove lines */}
        <div
          className="absolute inset-[3px] rounded-full border border-white/5 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-[6px] rounded-full border border-white/5 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-[9px] rounded-full border border-white/5 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Skill name */}
      <span
        ref={labelRef}
        className="text-sm font-medium text-cream/90 select-none transition-colors duration-150"
        style={{ fontFamily: "var(--font-body)", willChange: "transform" }}
      >
        {skill.name}
      </span>
    </div>
  );
}

/**
 * Skills section — "record collection."
 * Each skill is a vinyl disc that spins on hover.
 */
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const discsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    discsRef.current.forEach((disc, i) => {
      if (!disc) return;
      gsap.fromTo(
        disc,
        { opacity: 0, y: 35, rotate: -12 },
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          duration: 0.5,
          delay: i * 0.05,
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
      className="relative py-24 md:py-36 lg:py-40 bg-wine"
    >
      <div className="mx-auto max-w-6xl w-full px-6 md:px-10 lg:px-12">
        <h2 className="text-3xl md:text-5xl text-cream mb-3">Skills</h2>
        <p
          className="text-cream/70 mb-12 md:mb-16 max-w-2xl text-sm md:text-base"
          style={{ fontFamily: "var(--font-body)" }}
        >
          My record collection of tools and technologies.
        </p>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-6 xl:gap-7 items-stretch">
          {(() => {
            let discCounter = 0;
            return skillCategories.map((category) => (
              <div
                key={category.category}
                className="bg-white/5 border-[3px] rounded-2xl xl:rounded-3xl p-5 xl:p-6 flex flex-col relative overflow-hidden last:sm:col-span-2 last:lg:col-span-1 last:sm:max-w-md last:sm:mx-auto last:sm:w-full last:lg:max-w-none"
                style={{
                  borderColor: colorHex[category.accent],
                  boxShadow: `5px 5px 0 0 ${colorHex[category.accent]}`,
                }}
              >
                {/* Card Header */}
                <div className="mb-5 relative z-10">
                  <h3
                    className="text-lg xl:text-xl text-cream"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {category.category}
                  </h3>
                  {/* Decorative stripe under heading */}
                  <div className="h-1.5 w-12 mt-2 rounded-full flex overflow-hidden">
                    <div className="flex-1" style={{ backgroundColor: colorHex.teal }}></div>
                    <div className="flex-1" style={{ backgroundColor: colorHex.mustard }}></div>
                    <div className="flex-1" style={{ backgroundColor: colorHex.orange }}></div>
                    <div className="flex-1" style={{ backgroundColor: colorHex.wine }}></div>
                  </div>
                </div>

                {/* Skills Inner List */}
                <div className="flex flex-col gap-3.5 relative z-10">
                  {category.skills.map((skill) => {
                    const i = discCounter++;
                    return (
                      <VinylSkillItem
                        key={skill.name}
                        skill={skill}
                        rowRef={(el) => {
                          discsRef.current[i] = el;
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            ));
          })()}
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
