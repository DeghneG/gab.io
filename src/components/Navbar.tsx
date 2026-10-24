"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { contact } from "@/data/content";

/* ───────────────────────────────────────────────────
   NAV LINKS — includes About and Setup routes
   ─────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "About", href: "/#hero", sectionId: "hero" },
  { label: "Setup", href: "/#setup", sectionId: "setup" },
  { label: "Projects", href: "/#projects", sectionId: "projects" },
  { label: "Tech Stack", href: "/#skills", sectionId: "skills" },
  { label: "Experience", href: "/#experience", sectionId: "experience" },
  { label: "Contact", href: "/#contact", sectionId: "contact" },
] as const;

/* ───────────────────────────────────────────────────
   INLINE SVG ICONS (no extra deps)
   ─────────────────────────────────────────────────── */
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
      strokeWidth="2"
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

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width="22"
      height="22"
      aria-hidden="true"
    >
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width="22"
      height="22"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

/* ───────────────────────────────────────────────────
   SOCIAL ICON BUTTON
   ─────────────────────────────────────────────────── */
function SocialButton({
  href,
  label,
  hoverColor,
  children,
  external = true,
}: {
  href: string;
  label: string;
  hoverColor: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="group/social inline-flex items-center justify-center w-10 h-10 rounded-full border-[3px] border-wine bg-mint text-wine transition-all duration-200 outline-none focus-visible:ring-4 focus-visible:ring-teal focus-visible:ring-offset-2"
      style={{
        /* hover lift handled in CSS below via group utility */
      }}
    >
      <span
        className="transition-colors duration-200"
        style={{
          /* Per-icon hover color applied with inline var */
          ["--social-hover" as string]: hoverColor,
        }}
      >
        <span className="group-hover/social:text-[var(--social-hover)] transition-colors duration-200">
          {children}
        </span>
      </span>
    </a>
  );
}

/* ───────────────────────────────────────────────────
   NAVBAR
   ─────────────────────────────────────────────────── */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /* Track scroll position for bar background */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); // initialise
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Track which section is in view for active state */
  useEffect(() => {
    const sectionIds = ["hero", "projects", "skills", "experience", "setup", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHash(entry.target.id === "hero" ? "/#hero" : `/#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [pathname]);

  /* Close mobile menu on Escape */
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  /* Close mobile menu on outside click */
  useEffect(() => {
    if (!mobileOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [mobileOpen]);

  const handleLinkClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const isLinkActive = (href: string) => {
    return activeHash === href || (href === "/#hero" && (activeHash === "#hero" || activeHash === "/#hero")) || (href === "/#setup" && (activeHash === "#setup" || activeHash === "/#setup"));
  };

  /* Build social icons array — skip missing URLs */
  const socials = [
    contact.github
      ? {
          href: contact.github,
          label: "GitHub profile",
          hoverColor: "#F1A512",
          icon: <GitHubIcon />,
        }
      : null,
    contact.email
      ? {
          href: `mailto:${contact.email}`,
          label: "Send an email",
          hoverColor: "#DD4111",
          external: false,
          icon: <MailIcon />,
        }
      : null,
  ].filter(Boolean) as {
    href: string;
    label: string;
    hoverColor: string;
    external?: boolean;
    icon: React.ReactNode;
  }[];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-mint/85 backdrop-blur-md border-b-[3px] border-wine"
          : "bg-transparent border-b-[3px] border-transparent"
      }`}
    >
      <nav
        className="mx-auto max-w-7xl w-full px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* ── Wordmark ─────────────────────────────── */}
        <Link
          href={pathname === "/" ? "#hero" : "/"}
          className="text-xl text-wine outline-none focus-visible:ring-4 focus-visible:ring-teal rounded-sm"
          style={{ fontFamily: "var(--font-display)" }}
        >
          gab.io
        </Link>

        {/* ── Desktop links ────────────────────────── */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={`relative text-sm uppercase tracking-[0.15em] text-wine outline-none focus-visible:ring-4 focus-visible:ring-teal rounded-sm py-1 transition-colors duration-200 ${
                  active ? "nav-link-active" : "nav-link"
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Social icons — desktop */}
          <div className="flex items-center gap-2 ml-2 pl-4 border-l-[3px] border-wine/20">
            {socials.map((s) => (
              <SocialButton
                key={s.label}
                href={s.href}
                label={s.label}
                hoverColor={s.hoverColor}
                external={s.external !== false}
              >
                {s.icon}
              </SocialButton>
            ))}
          </div>
        </div>

        {/* ── Mobile menu button ───────────────────── */}
        <button
          ref={buttonRef}
          type="button"
          className="md:hidden inline-flex items-center justify-center w-11 h-11 border-[3px] border-wine rounded-md bg-transparent text-wine outline-none focus-visible:ring-4 focus-visible:ring-teal transition-colors duration-200"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </nav>

      {/* ── Mobile menu panel ─────────────────────── */}
      <div
        ref={menuRef}
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
        role="menu"
      >
        <div
          className={`mx-auto max-w-7xl px-8 pb-6 pt-2 flex flex-col gap-1 ${
            scrolled
              ? "bg-mint/85 backdrop-blur-md"
              : "bg-mint/85 backdrop-blur-md"
          }`}
        >
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={handleLinkClick}
                className={`block text-sm uppercase tracking-[0.15em] text-wine py-3 px-2 min-h-[44px] flex items-center rounded-md outline-none focus-visible:ring-4 focus-visible:ring-teal transition-colors duration-200 hover:bg-wine/5 ${
                  active ? "border-l-[3px] border-orange pl-4 font-bold" : ""
                }`}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Social icons — mobile */}
          <div className="flex items-center gap-3 mt-3 pt-4 border-t-[3px] border-wine/20">
            {socials.map((s) => (
              <SocialButton
                key={s.label}
                href={s.href}
                label={s.label}
                hoverColor={s.hoverColor}
                external={s.external !== false}
              >
                {s.icon}
              </SocialButton>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
