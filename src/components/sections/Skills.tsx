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

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function ReactIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-11.5 -10.23 23 20.46"
      className={className}
      width="14"
      height="14"
      aria-hidden="true"
    >
      <circle cx="0" cy="0" r="2.2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function NextjsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
    </svg>
  );
}

function TypeScriptIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
    </svg>
  );
}

function TailwindIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
    </svg>
  );
}

function PythonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path d="M11.914 0C5.82 0 6.188 2.643 6.188 2.643l.006 2.738h5.836v.834H3.854S0 5.754 0 11.885c0 6.13 3.36 5.922 3.36 5.922h2.004v-2.805s-.108-3.36 3.308-3.36h5.707s3.2 0 3.2-3.145V2.643S18.01 0 11.914 0zm-3.25 1.706a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1zM12.086 24c6.094 0 5.726-2.643 5.726-2.643l-.006-2.738H11.97v-.834h8.176S24 18.246 24 12.115c0-6.13-3.36-5.922-3.36-5.922h-2.004v2.805s.108 3.36-3.308 3.36H9.62s-3.2 0-3.2 3.145v5.852S5.99 24 12.086 24zm3.25-1.706a1.05 1.05 0 1 1 0-2.1 1.05 1.05 0 0 1 0 2.1z" />
    </svg>
  );
}

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
        {/* Center label hole: GitHub/React logo, or standard center dot for other skills */}
        {skill.name.toLowerCase() === "github" ? (
          <div
            className="
              w-5 h-5 xl:w-5.5 xl:h-5.5
              rounded-full bg-cream
              border-[1.5px]
              flex items-center justify-center
              text-wine shadow-xs
            "
            style={{ borderColor: colorHex[skill.color] }}
          >
            <GitHubIcon className="w-3 h-3 xl:w-3.5 xl:h-3.5 fill-current" />
          </div>
        ) : skill.name.toLowerCase() === "react" ? (
          <div
            className="
              w-5 h-5 xl:w-5.5 xl:h-5.5
              rounded-full bg-cream
              border-[1.5px]
              flex items-center justify-center
              text-teal shadow-xs
            "
            style={{ borderColor: colorHex[skill.color] }}
          >
            <ReactIcon className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-teal" />
          </div>
        ) : skill.name.toLowerCase() === "next.js" ? (
          <div
            className="
              w-5 h-5 xl:w-5.5 xl:h-5.5
              rounded-full bg-cream
              border-[1.5px]
              flex items-center justify-center
              text-wine shadow-xs
            "
            style={{ borderColor: colorHex[skill.color] }}
          >
            <NextjsIcon className="w-3.5 h-3.5 xl:w-4 xl:h-4 fill-current" />
          </div>
        ) : skill.name.toLowerCase() === "typescript" ? (
          <div
            className="
              w-5 h-5 xl:w-5.5 xl:h-5.5
              rounded-full bg-cream
              border-[1.5px]
              flex items-center justify-center
              text-orange shadow-xs
            "
            style={{ borderColor: colorHex[skill.color] }}
          >
            <TypeScriptIcon className="w-3 h-3 xl:w-3.5 xl:h-3.5 fill-current" />
          </div>
        ) : skill.name.toLowerCase() === "tailwind css" ? (
          <div
            className="
              w-5 h-5 xl:w-5.5 xl:h-5.5
              rounded-full bg-cream
              border-[1.5px]
              flex items-center justify-center
              text-teal shadow-xs
            "
            style={{ borderColor: colorHex[skill.color] }}
          >
            <TailwindIcon className="w-3.5 h-3.5 xl:w-4 xl:h-4 fill-current" />
          </div>
        ) : skill.name.toLowerCase() === "python" ? (
          <div
            className="
              w-5 h-5 xl:w-5.5 xl:h-5.5
              rounded-full bg-cream
              border-[1.5px]
              flex items-center justify-center
              text-wine shadow-xs
            "
            style={{ borderColor: colorHex[skill.color] }}
          >
            <PythonIcon className="w-3.5 h-3.5 xl:w-4 xl:h-4 fill-current" />
          </div>
        ) : (
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
        )}

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
      aria-label="Technology Stack"
      className="relative py-16 md:py-24 bg-wine"
    >
      <div className="mx-auto max-w-6xl w-full px-6 md:px-8">
        <h2 className="text-3xl md:text-5xl text-cream mb-8 md:mb-10">Technology Stack</h2>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 xl:gap-5 items-stretch">
          {(() => {
            let discCounter = 0;
            return skillCategories.map((category) => (
              <div
                key={category.category}
                className="bg-white/5 border-[3px] rounded-2xl xl:rounded-3xl p-4 xl:p-5 flex flex-col relative overflow-hidden last:sm:col-span-2 last:lg:col-span-1 last:sm:max-w-md last:sm:mx-auto last:sm:w-full last:lg:max-w-none"
                style={{
                  borderColor: colorHex[category.accent],
                  boxShadow: `5px 5px 0 0 ${colorHex[category.accent]}`,
                }}
              >
                {/* Card Header */}
                <div className="mb-4 relative z-10">
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
