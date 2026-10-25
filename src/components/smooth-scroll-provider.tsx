"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      syncTouch: true,
      respectReducedMotion: false,
      autoRaf: true,
    });

    lenisRef.current = lenis;
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // Synchronize Lenis scroll updates directly with GSAP ScrollTrigger
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Smoothly intercept in-page anchor links (e.g., #setup, /#setup, #projects, etc.)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;

      const hash = href.startsWith("/#") ? href.slice(1) : href.startsWith("#") ? href : null;
      if (hash && hash.length > 1) {
        try {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            e.preventDefault();
            lenis.scrollTo(targetElement as HTMLElement, {
              offset: -80, // account for 64px fixed navbar + breathing room
              duration: 1.2,
            });
            window.history.pushState(null, "", hash);
          }
        } catch {
          // ignore invalid query selector
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    // Smoothly scroll to initial hash on page load if present
    if (window.location.hash) {
      setTimeout(() => {
        try {
          const initialEl = document.querySelector(window.location.hash);
          if (initialEl) {
            lenis.scrollTo(initialEl as HTMLElement, {
              offset: -80,
              duration: 1.0,
            });
          }
        } catch {
          // ignore
        }
      }, 200);
    }

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
