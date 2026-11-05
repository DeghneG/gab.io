"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Compass, X } from "lucide-react";

interface TourStep {
  sectionId: string;
  title: string;
  summary: string;
  details: string[];
}

/** One stop per section, in the same order they appear on the page (top to bottom). */
const STEPS: TourStep[] = [
  {
    sectionId: "hero",
    title: "About me",
    summary: "Start here: who I am and what I do.",
    details: [
      "A quick intro to Deghne Gabriel Agana, a front-end developer.",
      "Use the navigation bar at the top to jump to any section at any time.",
    ],
  },
  {
    sectionId: "projects",
    title: "Featured Projects",
    summary: "Websites and apps I've built.",
    details: [
      "Use the filter pills (All, Personal, Web Dev, E-Commerce, Educational) to sort the projects.",
      "Click any card to open its details: description, tech used, and links.",
      "The Source code button opens the GitHub repository.",
    ],
  },
  {
    sectionId: "skills",
    title: "Tech Stack",
    summary: "The tools and languages I work with.",
    details: [
      "Grouped by category: Frontend, Backend, Developer Tools, and AIs.",
      "Hover over the skills to see them react.",
    ],
  },
  {
    sectionId: "experience",
    title: "Experience",
    summary: "My education, timeline, and certifications.",
    details: [
      "Read my education from junior high school to my current BS Information Technology.",
      "Certifications are listed below, and some can be opened as a PDF.",
    ],
  },
  {
    sectionId: "github-contributions",
    title: "GitHub Activity",
    summary: "My recent coding activity, live from GitHub.",
    details: [
      "Each square is a day. A darker square means more contributions that day.",
    ],
  },
  {
    sectionId: "setup",
    title: "My Setup",
    summary: "The gear I use every day.",
    details: [
      "An interactive look at my desk, monitors, and PC parts.",
      "Move your mouse around to explore it.",
    ],
  },
  {
    sectionId: "contact",
    title: "Get in touch",
    summary: "Send me a message on the typewriter.",
    details: [
      "Type on your keyboard or click the on-screen keys.",
      "Fill in order: your email, subject, message, then your name. Press Enter to move to the next line.",
      "Press SEND to mail the letter. It arrives straight in my inbox.",
    ],
  },
];

const STORAGE_KEY = "site_tour_seen";
const PAD = 12;

type Mode = "closed" | "welcome" | "touring";
type Box = { top: number; left: number; width: number; height: number };

/** The part of a section we spotlight: the block that holds its heading, else the section itself. */
function getTarget(sectionId: string): HTMLElement | null {
  const section = document.getElementById(sectionId);
  if (!section) return null;
  const heading = section.querySelector("h1, h2");
  return (heading?.parentElement as HTMLElement | null) ?? section;
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (
    window as unknown as {
      lenis?: { scrollTo: (el: HTMLElement, opts?: object) => void };
    }
  ).lenis;
  if (lenis) {
    lenis.scrollTo(el, { offset: -80, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/**
 * Site-wide onboarding.
 * First visit: asks whether to take the tour or browse alone.
 * Tour: walks through each section top to bottom, scrolling to it and
 * spotlighting it on screen while a card explains it.
 */
export default function SiteTour() {
  const [mode, setMode] = useState<Mode>("closed");
  const [index, setIndex] = useState(0);
  const [isNew, setIsNew] = useState(false);
  const [box, setBox] = useState<Box | null>(null);
  const indexRef = useRef(0);

  const markSeen = useCallback(() => {
    setIsNew(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {}
  }, []);

  /* First visit: wait for the intro loader to finish, then offer the tour. */
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(STORAGE_KEY) === "true";
    } catch {}
    if (seen) return;

    const newTimer = setTimeout(() => setIsNew(true), 0);
    let waited = 0;
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    const poll = setInterval(() => {
      waited += 300;
      const loaderGone = !document.querySelector(".z-\\[9999\\]");
      if (loaderGone || waited > 15000) {
        clearInterval(poll);
        showTimer = setTimeout(() => setMode((m) => (m === "closed" ? "welcome" : m)), 600);
      }
    }, 300);

    return () => {
      clearTimeout(newTimer);
      clearInterval(poll);
      if (showTimer) clearTimeout(showTimer);
    };
  }, []);

  const goTo = useCallback((i: number) => {
    indexRef.current = i;
    setIndex(i);
    scrollToSection(STEPS[i].sectionId);
  }, []);

  const startTour = useCallback(() => {
    markSeen();
    setMode("touring");
    goTo(0);
  }, [markSeen, goTo]);

  const dismiss = useCallback(() => {
    setMode("closed");
    setBox(null);
    markSeen();
  }, [markSeen]);

  /* Escape closes the welcome prompt or the tour. */
  useEffect(() => {
    if (mode === "closed") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, dismiss]);

  /* Keep the spotlight locked onto the current section while the page scrolls. */
  useEffect(() => {
    if (mode !== "touring") return;
    let raf = 0;
    const update = () => {
      const target = getTarget(STEPS[indexRef.current].sectionId);
      if (target) {
        const r = target.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const top = Math.max(r.top - PAD, 8);
        const left = Math.max(r.left - PAD, 8);
        const bottom = Math.min(r.bottom + PAD, vh - 8);
        const right = Math.min(r.right + PAD, vw - 8);
        const visible = bottom > top && right > left;
        setBox((prev) => {
          const next = visible
            ? { top, left, width: right - left, height: bottom - top }
            : null;
          if (
            prev &&
            next &&
            prev.top === next.top &&
            prev.left === next.left &&
            prev.width === next.width &&
            prev.height === next.height
          ) {
            return prev;
          }
          return next;
        });
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  const step = STEPS[index];
  const isFirst = index === 0;
  const isLast = index === STEPS.length - 1;

  return (
    <>
      {/* ── Spotlight: dims everything except the section being explained ── */}
      {mode === "touring" && (
        <div aria-hidden="true" className="fixed inset-0 z-[85] pointer-events-none">
          {box ? (
            <div
              className="absolute rounded-2xl border-4 border-mustard"
              style={{
                top: box.top,
                left: box.left,
                width: box.width,
                height: box.height,
                boxShadow: "0 0 0 9999px rgba(58, 21, 32, 0.72), 0 0 24px 4px rgba(241,165,18,0.55)",
              }}
            />
          ) : (
            <div className="absolute inset-0" style={{ background: "rgba(58, 21, 32, 0.72)" }} />
          )}
        </div>
      )}

      {/* ── Welcome prompt: take the tour or browse alone ── */}
      {mode === "welcome" && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-ink/70"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-welcome-title"
            className="w-full max-w-md bg-wine text-cream border-4 border-mustard rounded-2xl p-6 sm:p-8 shadow-[8px_8px_0_0_#F1A512]"
          >
            <Compass className="w-8 h-8 text-mustard mb-3" aria-hidden="true" />
            <h2
              id="tour-welcome-title"
              className="text-3xl leading-tight mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Welcome!
            </h2>
            <p className="text-base text-cream/85 mb-6">
              Want a quick guided tour? I&apos;ll walk you through the site from top to
              bottom and highlight each section as we go. It takes about a minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={startTour}
                autoFocus
                className="flex-1 px-5 py-3 rounded-xl bg-mustard text-wine border-2 border-cream/30 font-bold cursor-pointer transition-transform hover:scale-[1.03] active:scale-95"
              >
                Take the tour
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="flex-1 px-5 py-3 rounded-xl border-2 border-cream/40 font-bold cursor-pointer hover:bg-cream/15"
              >
                I&apos;ll browse alone
              </button>
            </div>
            <p className="text-xs text-cream/60 mt-4">
              You can start the tour any time with the button in the bottom-left corner.
            </p>
          </div>
        </div>
      )}

      {/* ── Launcher + tour card ── */}
      <div
        className="fixed bottom-4 left-4 right-4 sm:right-auto z-[90]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {mode === "closed" && (
          <button
            type="button"
            onClick={startTour}
            className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-wine text-cream border-2 border-mustard font-bold text-sm uppercase tracking-wider shadow-[4px_4px_0_0_#F1A512] cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-95 outline-none focus-visible:ring-4 focus-visible:ring-mustard"
            aria-label="Take a tour of the website"
          >
            <Compass className="w-4 h-4" />
            Take the tour
            {isNew && (
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange animate-ping"
              />
            )}
          </button>
        )}

        {mode === "touring" && (
          <div
            role="dialog"
            aria-label="Website tour"
            className="w-full sm:w-[360px] bg-wine text-cream border-4 border-mustard rounded-2xl p-5 shadow-[6px_6px_0_0_#F1A512]"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="text-[11px] uppercase tracking-wider text-mustard font-bold">
                Step {index + 1} of {STEPS.length}
              </span>
              <button
                type="button"
                onClick={dismiss}
                aria-label="End tour"
                className="w-7 h-7 -mt-1 -mr-1 rounded-full bg-cream/15 hover:bg-mustard hover:text-wine flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <h3
              className="text-2xl leading-tight mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {step.title}
            </h3>
            <p className="text-sm text-cream/90 mb-3">{step.summary}</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-cream/75 mb-4">
              {step.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            {/* Progress dots: click to jump to a section */}
            <div className="flex gap-1.5 mb-4" role="tablist" aria-label="Tour progress">
              {STEPS.map((s, i) => (
                <button
                  key={s.sectionId}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to ${s.title}`}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full cursor-pointer transition-all ${
                    i === index ? "w-6 bg-mustard" : "w-2 bg-cream/30 hover:bg-cream/60"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                disabled={isFirst}
                className="px-4 py-2 rounded-lg border-2 border-cream/30 text-sm font-bold cursor-pointer hover:bg-cream/15 disabled:opacity-30 disabled:cursor-default disabled:hover:bg-transparent"
              >
                Back
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="text-xs underline text-cream/60 hover:text-cream cursor-pointer"
              >
                Skip tour
              </button>
              <button
                type="button"
                onClick={isLast ? dismiss : () => goTo(index + 1)}
                className="px-5 py-2 rounded-lg bg-mustard text-wine border-2 border-cream/30 text-sm font-bold cursor-pointer transition-transform hover:scale-[1.04] active:scale-95"
              >
                {isLast ? "Done" : "Next"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
