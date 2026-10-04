"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export default function HeroMountains() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(SVGPathElement | null)[]>([]);

  useGSAP(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    
    if (prefersReduced) {
      // Ensure they are visible if reduced motion is preferred
      gsap.set(layersRef.current, { opacity: 1, y: 0 });
      return;
    }

    // Mountains animate in shortly after the intro text starts typing (intro text starts at 0.9s delay)
    gsap.fromTo(
      layersRef.current,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12, // back layer first
        ease: "power2.out",
        delay: 1.2,
      }
    );
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 bottom-[-1px] pointer-events-none z-20"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        focusable="false"
        className="w-full block h-[16vh] md:h-[24vh]"
      >
        {/* Layer 1: Back (Teal) - Lightest, highest in distance */}
        <path
          ref={(el) => { layersRef.current[0] = el; }}
          style={{ fill: "var(--color-teal)" }}
          d="M0 220 L120 180 L250 240 L450 120 L600 200 L850 80 L1100 220 L1300 150 L1440 210 L1440 400 L0 400 Z"
          className="opacity-0"
        />
        {/* Layer 2: Mustard */}
        <path
          ref={(el) => { layersRef.current[1] = el; }}
          style={{ fill: "var(--color-mustard)" }}
          d="M0 260 L180 200 L320 280 L550 180 L750 260 L950 140 L1150 270 L1380 200 L1440 230 L1440 400 L0 400 Z"
          className="opacity-0"
        />
        {/* Layer 3: Orange */}
        <path
          ref={(el) => { layersRef.current[2] = el; }}
          style={{ fill: "var(--color-orange)" }}
          d="M0 300 L150 340 L350 240 L650 320 L850 220 L1050 340 L1250 250 L1440 310 L1440 400 L0 400 Z"
          className="opacity-0"
        />
        {/* Layer 4: Front (Wine) - Darkest, tallest at edges */}
        <path
          ref={(el) => { layersRef.current[3] = el; }}
          style={{ fill: "var(--color-wine)" }}
          d="M0 150 L150 280 L350 360 L550 320 L720 390 L900 340 L1100 370 L1300 300 L1440 180 L1440 400 L0 400 Z"
          className="opacity-0"
        />
      </svg>
    </div>
  );
}
