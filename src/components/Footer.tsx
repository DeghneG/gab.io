"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contact } from "@/data/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FOOTER_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#hero" },
  { label: "Contact", href: "#contact" },
] as const;

const LETTERS = [
  { char: "g", isDot: false },
  { char: "a", isDot: false },
  { char: "b", isDot: false },
  { char: ".", isDot: true },
  { char: "i", isDot: false },
  { char: "o", isDot: false },
] as const;

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width="20"
      height="20"
      aria-hidden="true"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width="20"
      height="20"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.76v8.37H6.46v-8.37M7.84 6.2a1.61 1.61 0 0 0-1.61 1.61 1.61 1.61 0 0 0 1.61 1.61 1.61 1.61 0 0 0 1.61-1.61A1.61 1.61 0 0 0 7.84 6.2Z" />
    </svg>
  );
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const currentYear = new Date().getFullYear();

  useGSAP(
    () => {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        letterRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 });
        });
        return;
      }

      const validLetters = letterRefs.current.filter(Boolean);
      if (validLetters.length > 0) {
        gsap.fromTo(
          validLetters,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    },
    { scope: footerRef }
  );

  const handleBackToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "instant" : "smooth",
    });

    const target = document.getElementById("hero") || document.body;
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };

  const hasLinkedIn =
    Boolean((contact as Record<string, unknown>).linkedin) &&
    typeof (contact as Record<string, unknown>).linkedin === "string";

  return (
    <footer
      ref={footerRef}
      className="relative bg-wine overflow-hidden select-none"
      aria-label="Site footer"
    >
      {/* ── 1. Stripe band along top edge ────────────── */}
      <div aria-hidden="true" className="w-full stripe-band" />

      {/* ── 2. Container ─────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16 flex flex-col">
        {/* ── 3. Top row ─────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12">
          {/* Left: Heading */}
          <div>
            <h2
              className="text-5xl md:text-6xl text-cream leading-tight tracking-normal"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Say hello.
            </h2>
          </div>

          {/* Right: Ticket email button & availability pill */}
          <div className="flex flex-col items-start md:items-end gap-3.5">
            <a
              href={`mailto:${contact.email}`}
              className="group relative inline-flex items-center justify-center px-6 py-3 bg-mustard text-wine rounded-md outline-none focus-visible:ring-4 focus-visible:ring-teal transition-transform active:scale-[0.97]"
              style={{
                fontFamily: "var(--font-body)",
                maskImage:
                  "radial-gradient(circle at 0 50%, transparent 6px, black 6.5px) 0 0 / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 6px, black 6.5px) 100% 0 / 51% 100% no-repeat",
                WebkitMaskImage:
                  "radial-gradient(circle at 0 50%, transparent 6px, black 6.5px) 0 0 / 51% 100% no-repeat, radial-gradient(circle at 100% 50%, transparent 6px, black 6.5px) 100% 0 / 51% 100% no-repeat",
                filter: "drop-shadow(4px 4px 0px #DD4111)",
              }}
            >
              <span className="font-bold tracking-wide text-sm md:text-base border-r-2 border-dashed border-wine/40 pr-3 mr-3">
                {contact.email}
              </span>
              <span
                className="text-lg leading-none transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              >
                ✉
              </span>
            </a>

            {/* Pulsing availability pill */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-wine bg-cream text-wine text-xs uppercase font-bold tracking-wider"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mustard opacity-75 motion-reduce:hidden" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mustard" />
              </span>
              Open to projects and collaborations
            </div>
          </div>
        </div>

        {/* ── 4. Divider ─────────────────────────────── */}
        <div
          className="w-full h-[2px] bg-cream/25 mt-12 md:mt-16"
          aria-hidden="true"
        />

        {/* ── 5. Middle row ──────────────────────────── */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
          {/* Left: Nav links */}
          <nav
            className="flex flex-wrap items-center gap-6 md:gap-8"
            aria-label="Footer navigation"
          >
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link relative text-sm md:text-base text-cream uppercase tracking-wide font-medium py-1 outline-none focus-visible:ring-2 focus-visible:ring-mustard rounded-sm"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Round icon buttons */}
          <div className="flex items-center gap-3 md:gap-4">
            {contact.github && (
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="w-10 h-10 rounded-full border-[3px] border-cream bg-transparent text-cream flex items-center justify-center transition-all duration-200 hover:bg-mustard hover:border-mustard hover:text-wine hover:-translate-y-0.5 outline-none focus-visible:ring-2 focus-visible:ring-mustard"
              >
                <GitHubIcon className="w-5 h-5 fill-current" />
              </a>
            )}

            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                aria-label="Send an email"
                className="w-10 h-10 rounded-full border-[3px] border-cream bg-transparent text-cream flex items-center justify-center transition-all duration-200 hover:bg-mustard hover:border-mustard hover:text-wine hover:-translate-y-0.5 outline-none focus-visible:ring-2 focus-visible:ring-mustard"
              >
                <MailIcon className="w-5 h-5" />
              </a>
            )}

            {hasLinkedIn && (
              <a
                href={(contact as Record<string, unknown>).linkedin as string}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="w-10 h-10 rounded-full border-[3px] border-cream bg-transparent text-cream flex items-center justify-center transition-all duration-200 hover:bg-mustard hover:border-mustard hover:text-wine hover:-translate-y-0.5 outline-none focus-visible:ring-2 focus-visible:ring-mustard"
              >
                <LinkedInIcon className="w-5 h-5 fill-current" />
              </a>
            )}

            <button
              type="button"
              onClick={handleBackToTop}
              aria-label="Back to top"
              className="w-10 h-10 rounded-full border-[3px] border-cream bg-transparent text-cream flex items-center justify-center transition-all duration-200 hover:bg-mustard hover:border-mustard hover:text-wine hover:-translate-y-0.5 outline-none focus-visible:ring-2 focus-visible:ring-mustard cursor-pointer"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── 7. Small copyright line ────────────────── */}
        <div
          className="mt-12 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-cream/70"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <span>© {currentYear} Deghne Gabriel Agana</span>
          <span>Built with Next.js and GSAP</span>
        </div>
      </div>

      {/* ── 6. Giant wordmark spanning edge to edge ──── */}
      <div
        aria-hidden="true"
        className="w-full overflow-hidden flex justify-center pointer-events-none select-none translate-y-[15%] pt-6 md:pt-8"
      >
        <div
          className="text-center whitespace-nowrap leading-[0.8] tracking-tight font-normal"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(4.5rem, 26vw, 22rem)",
          }}
        >
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
              className={`inline-block ${
                letter.isDot ? "text-mustard" : "text-[#A3153F]"
              }`}
            >
              {letter.char}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
