"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

const WORDS = ["Designing", "interfaces", "that", "move."];

/**
 * Hero headline with GSAP:
 *  1. letters get slapped onto the page one by one (drop, tilt, bounce)
 *  8. the word "move." actually moves: it slides and springs back every few seconds
 *  5. letters jump and wiggle when the cursor passes over them
 * 14. a hand-drawn squiggle draws itself under "interfaces"
 * Decorative motion is kept even if the system asks for reduced motion (the site owner asked for it).
 */
export default function HeroHeadline() {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const letters = gsap.utils.toArray<HTMLElement>("[data-l]", root);
      const moveLetters = gsap.utils.toArray<HTMLElement>('[data-w="move."] [data-l]', root);
      const squiggle = root.querySelector<SVGPathElement>("[data-squiggle]")?.ownerSVGElement ?? null;

      gsap.set(letters, { opacity: 0 });
      if (squiggle) gsap.set(squiggle, { clipPath: "inset(-30% 100% -30% 0%)" });

      let stopped = false;
      let loopCall: gsap.core.Tween | null = null;
      let nudgeTl: gsap.core.Timeline | null = null;

      /* 8: "move." slides along and springs back, then waits a few seconds */
      const schedule = () => {
        if (stopped) return;
        loopCall = gsap.delayedCall(4.5, () => {
          if (stopped) return;
          nudgeTl = gsap
            .timeline({ onComplete: schedule })
            .to(moveLetters, { x: 22, rotation: 5, duration: 0.3, ease: "power2.out", stagger: 0.045 })
            .to(moveLetters, { x: 0, rotation: 0, duration: 1, ease: "elastic.out(1, 0.35)", stagger: 0.045 }, ">-0.05");
        });
      };

      /* 1 + 14: entrance, then the squiggle */
      const enter = () => gsap
        .timeline({ delay: 0.15 })
        .fromTo(
          letters,
          { y: -70, rotation: () => gsap.utils.random(-28, 28), scale: 1.7, opacity: 0, transformOrigin: "50% 80%" },
          { y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.55, ease: "back.out(2.4)", stagger: 0.04 }
        )
        .to(squiggle, { clipPath: "inset(-30% 0% -30% 0%)", duration: 0.9, ease: "power2.inOut" }, "-=0.2")
        .call(schedule);

      // wait for the loader's shutters to open (if it is showing)
      let started = false;
      let entrance: gsap.core.Timeline | null = null;
      const start = () => {
        if (started) return;
        started = true;
        entrance = enter();
      };
      const loaderUp = !!document.querySelector('[aria-label="Loading portfolio"]');
      const fallback = setTimeout(start, 6000);
      if (loaderUp) window.addEventListener("loader:open", start, { once: true });
      else start();

      /* 5: hover wiggle on whichever letter the cursor touches */
      const onOver = (e: PointerEvent) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>("[data-l]");
        if (!el || el.dataset.wig === "1") return;
        el.dataset.wig = "1";
        gsap
          .timeline({ onComplete: () => delete el.dataset.wig })
          .to(el, { y: -16, rotation: gsap.utils.random(-14, 14), scale: 1.12, duration: 0.14, ease: "power2.out", transformOrigin: "50% 80%" })
          .to(el, { y: 0, rotation: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.4)" });
      };
      root.addEventListener("pointerover", onOver);

      return () => {
        stopped = true;
        clearTimeout(fallback);
        window.removeEventListener("loader:open", start);
        entrance?.kill();
        loopCall?.kill();
        nudgeTl?.kill();
        root.removeEventListener("pointerover", onOver);
      };
    },
    { scope: ref }
  );

  return (
    <h1
      ref={ref}
      className="text-4xl md:text-5xl lg:text-6xl text-wine leading-[1.1] tracking-tight min-h-[4rem] md:min-h-[5rem]"
      style={{ fontFamily: "var(--font-display)" }}
      aria-label="Designing interfaces that move."
    >
      {WORDS.map((word, wi) => (
        <span key={word}>
          <span data-w={word} aria-hidden="true" className="relative inline-block whitespace-nowrap">
            {Array.from(word).map((ch, ci) => (
              <span key={ci} data-l="" className="inline-block will-change-transform cursor-default">
                {ch}
              </span>
            ))}
            {word === "interfaces" && (
              <svg
                aria-hidden="true"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                fill="none"
                className="absolute left-0 w-full pointer-events-none overflow-visible"
                style={{ bottom: "-0.14em", height: "0.3em" }}
              >
                <path
                  data-squiggle=""
                  d="M2 7 Q8 0 14 7 T26 7 T38 7 T50 7 T62 7 T74 7 T86 7 T98 7"
                  strokeWidth="4"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{ stroke: "var(--color-orange)" }}
                />
              </svg>
            )}
          </span>
          {wi < WORDS.length - 1 ? " " : null}
        </span>
      ))}
    </h1>
  );
}
