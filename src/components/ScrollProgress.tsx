"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Tech Stack" },
  { id: "experience", label: "Experience" },
  { id: "github-contributions", label: "GitHub" },
  { id: "setup", label: "Setup" },
  { id: "contact", label: "Contact" },
];

type LenisLike = { scrollTo: (target: HTMLElement | number, opts?: object) => void };

function goToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
  if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.2 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Scroll progress indicator that replaces the native scrollbar (hidden in globals.css).
 * Desktop: a rail of section dots on the right (current = mustard, passed = wine,
 * upcoming = cream). Click a dot to jump; hover shows its name.
 * Phones: no room for the rail, so a thin progress line runs along the top instead.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0); // 0..1
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0);

      // Active section = last one whose top has passed the middle of the viewport
      let active = 0;
      SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.5) active = i;
      });
      setActiveSection(active);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <>
      {/* Phones only: thin top line */}
      <div
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="sm:hidden fixed top-0 left-0 right-0 h-1.5 z-[110] bg-wine/25 pointer-events-none"
      >
        <div
          className="h-full bg-mustard border-r-2 border-wine"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Desktop: section dots */}
      <nav
        aria-label="Page sections"
        className="fixed right-3 top-1/2 -translate-y-1/2 z-[80] hidden sm:flex flex-col items-end gap-3"
      >
        {SECTIONS.map((s, i) => {
          const reached = i <= activeSection;
          const current = i === activeSection;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => goToSection(s.id)}
              aria-label={`Go to ${s.label}`}
              aria-current={current ? "true" : undefined}
              className="group flex items-center gap-2 cursor-pointer"
            >
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-wine text-cream transition-opacity ${
                  current ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {s.label}
              </span>
              <span
                className={`block rounded-full border-2 border-wine transition-all ${
                  current ? "w-4 h-4 bg-mustard" : reached ? "w-3 h-3 bg-wine" : "w-3 h-3 bg-cream/60"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
}
