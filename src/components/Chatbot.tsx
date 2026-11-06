"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { X, Send } from "lucide-react";
import {
  siteConfig,
  projects,
  skillCategories,
  timeline,
  certifications,
  contact,
} from "@/data/content";

/* ───────────────────────────────────────────────────
   Scripted FAQ chatbot: a cartoon version of Gab.
   No API, no cost. All answers are built from @/data/content,
   so editing that file updates the bot too.
   ─────────────────────────────────────────────────── */

type Action =
  | { kind: "ask"; label: string; topic: string }
  | { kind: "scroll"; label: string; sectionId: string }
  | { kind: "link"; label: string; href: string };

interface Reply {
  text: string;
  actions?: Action[];
}

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  actions?: Action[];
}

const MAIN_TOPICS: { topic: string; label: string }[] = [
  { topic: "about", label: "Who are you?" },
  { topic: "projects", label: "Projects" },
  { topic: "skills", label: "Tech stack" },
  { topic: "education", label: "Education" },
  { topic: "contact", label: "Contact" },
];

function projectReply(slug: string): Reply | null {
  const p = projects.find((x) => x.slug === slug);
  if (!p) return null;
  const actions: Action[] = [];
  if (p.liveUrl && p.liveUrl !== "#") actions.push({ kind: "link", label: "Live site", href: p.liveUrl });
  if (p.repoUrl && p.repoUrl !== "#") actions.push({ kind: "link", label: "Source code", href: p.repoUrl });
  actions.push({ kind: "ask", label: "Other projects", topic: "projects" });
  return {
    text: `${p.title}${p.type ? ` (${p.type}${p.year ? `, ${p.year}` : ""})` : ""}: ${p.description} Built with ${p.tech.join(", ")}.`,
    actions,
  };
}

function getReply(topic: string): Reply {
  if (topic.startsWith("project:")) {
    return projectReply(topic.slice("project:".length)) ?? getReply("projects");
  }

  switch (topic) {
    case "greeting":
      return {
        text: `Hi! I'm the cartoon version of ${siteConfig.name.split(" ")[0]}. Ask me about my projects, tech stack, or how to reach me.`,
        actions: MAIN_TOPICS.map((t) => ({ kind: "ask", label: t.label, topic: t.topic })),
      };

    case "about":
      return {
        text: siteConfig.introLine,
        actions: [
          { kind: "ask", label: "Projects", topic: "projects" },
          { kind: "ask", label: "Tech stack", topic: "skills" },
          { kind: "scroll", label: "Go to About", sectionId: "hero" },
        ],
      };

    case "projects":
      return {
        text: `Here's what I've built so far. Tap one for details:`,
        actions: [
          ...projects.map((p): Action => ({ kind: "ask", label: p.title, topic: `project:${p.slug}` })),
          { kind: "scroll", label: "See them on the page", sectionId: "projects" },
        ],
      };

    case "skills":
      return {
        text: skillCategories
          .map((c) => `${c.category}: ${c.skills.map((s) => s.name).join(", ")}`)
          .join("\n"),
        actions: [{ kind: "scroll", label: "Go to Tech Stack", sectionId: "skills" }],
      };

    case "education":
      return {
        text: [
          ...timeline.map((t) => `${t.period}: ${t.title}, ${t.org}`),
          ...certifications.map((c) => `Certificate: ${c.title} (${c.issuer}, ${c.year})`),
        ].join("\n"),
        actions: [{ kind: "scroll", label: "Go to Experience", sectionId: "experience" }],
      };

    case "contact": {
      const links: Action[] = [{ kind: "link", label: "Email me", href: `mailto:${contact.email}` }];
      if (contact.facebook) links.push({ kind: "link", label: "Facebook", href: contact.facebook });
      if (contact.instagram) links.push({ kind: "link", label: "Instagram", href: contact.instagram });
      if (contact.github) links.push({ kind: "link", label: "GitHub", href: contact.github });
      links.push({ kind: "scroll", label: "Use the typewriter", sectionId: "contact" });
      return {
        text: `The easiest way is the typewriter at the bottom of the page, and it lands straight in my inbox. You can also email ${contact.email}.`,
        actions: links,
      };
    }

    case "hire":
      return {
        text: `Interested in working together? Send me a letter on the typewriter with what you have in mind and I'll get back to you.`,
        actions: [
          { kind: "scroll", label: "Go to the typewriter", sectionId: "contact" },
          { kind: "ask", label: "See my projects", topic: "projects" },
        ],
      };

    case "setup":
      return {
        text: `I've got a whole section on my desk setup: monitors, PC parts, and gear.`,
        actions: [{ kind: "scroll", label: "Go to My Setup", sectionId: "setup" }],
      };

    case "github":
      return {
        text: `My recent coding activity is on the page, live from GitHub.`,
        actions: [
          { kind: "scroll", label: "See activity", sectionId: "github-contributions" },
          { kind: "link", label: "Open GitHub", href: contact.github },
        ],
      };

    case "tour":
      return {
        text: `Tap the "Take the tour" button in the bottom-left corner and I'll walk you through the site, section by section.`,
      };

    case "thanks":
      return { text: `Anytime! Ask me something else if you like.`, actions: MAIN_TOPICS.map((t) => ({ kind: "ask", label: t.label, topic: t.topic })) };

    default:
      return {
        text: `Hmm, I'm a simple bot and didn't catch that. Try one of these, or send me a letter on the typewriter and the real me will answer.`,
        actions: [
          ...MAIN_TOPICS.map((t): Action => ({ kind: "ask", label: t.label, topic: t.topic })),
          { kind: "scroll", label: "Typewriter", sectionId: "contact" },
        ],
      };
  }
}

/** Keyword matching for typed questions. First matching topic wins, in this order. */
const KEYWORDS: { topic: string; words: string[] }[] = [
  { topic: "greeting", words: ["hi", "hello", "hey", "yo", "sup", "good morning", "good afternoon", "good evening"] },
  { topic: "thanks", words: ["thanks", "thank you", "ty", "salamat"] },
  { topic: "hire", words: ["hire", "hiring", "available", "availability", "freelance", "work with", "job", "commission", "collab", "rate", "quote"] },
  { topic: "contact", words: ["contact", "email", "mail", "reach", "message", "phone", "number", "facebook", "instagram", "fb", "ig", "social"] },
  { topic: "projects", words: ["project", "portfolio", "built", "build", "made", "work", "website", "app"] },
  { topic: "skills", words: ["skill", "tech", "stack", "react", "next", "typescript", "tailwind", "gsap", "three", "language", "tool", "framework", "know"] },
  { topic: "education", words: ["education", "school", "study", "university", "college", "course", "degree", "certificate", "certification", "experience", "usa", "agustin"] },
  { topic: "setup", words: ["setup", "set up", "pc", "desk", "monitor", "keyboard", "mouse", "gear", "gpu", "cpu"] },
  { topic: "github", words: ["github", "commit", "contribution", "repo", "code"] },
  { topic: "tour", words: ["tour", "guide", "onboarding", "help", "how to use"] },
  { topic: "about", words: ["who", "about", "yourself", "you", "name", "gab", "deghne", "simpson", "cartoon"] },
];

function matchTopic(input: string): string {
  const text = ` ${input.toLowerCase().replace(/[^a-z0-9\s]/g, " ")} `;
  // A project mentioned by name beats everything else.
  for (const p of projects) {
    if (text.includes(` ${p.title.toLowerCase().replace(/[^a-z0-9\s]/g, " ")} `)) return `project:${p.slug}`;
  }
  for (const { topic, words } of KEYWORDS) {
    if (words.some((w) => text.includes(` ${w} `) || (w.length > 3 && text.includes(w)))) return topic;
  }
  return "fallback";
}

type LenisLike = { scrollTo: (target: HTMLElement, opts?: object) => void };

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
  if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.2 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const CHARACTER = { src: "/picture/gab-simpson.png", width: 438, height: 1414 };

/**
 * How big the full-body character is. Height scales with the screen between MIN and MAX
 * (in px / dvh); width follows the image ratio. Raise MAX_PX to make him bigger.
 */
const CHAR_SIZE = { minPx: 130, vh: 24, maxPx: 200 };

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [showBubble, setShowBubble] = useState(false);

  const idRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);

  const nextId = () => ++idRef.current;

  /* Gentle idle bob for the character while the chat is closed. */
  useGSAP(
    () => {
      const el = characterRef.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (open) {
        gsap.to(el, { y: 0, duration: 0.2 });
        return;
      }
      gsap.to(el, { y: -6, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
    },
    { dependencies: [open] }
  );

  /* Speech bubble nudge a few seconds after load, only until first open. */
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 4000);
    return () => clearTimeout(t);
  }, []);

  /* Clear pending bot replies on unmount. */
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  /* Keep the newest message in view. */
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing, open]);

  /* Escape closes the chat. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const botSay = useCallback((topic: string) => {
    setTyping(true);
    const t = setTimeout(() => {
      const reply = getReply(topic);
      setMessages((m) => [...m, { id: ++idRef.current, from: "bot", text: reply.text, actions: reply.actions }]);
      setTyping(false);
    }, 550);
    timersRef.current.push(t);
  }, []);

  const toggle = () => {
    setShowBubble(false);
    setOpen((o) => {
      const next = !o;
      if (next && messages.length === 0) botSay("greeting");
      if (next) setTimeout(() => inputRef.current?.focus(), 50);
      return next;
    });
  };

  const ask = (label: string, topic: string) => {
    setMessages((m) => [...m, { id: nextId(), from: "user", text: label }]);
    botSay(topic);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    ask(text, matchTopic(text));
  };

  const runAction = (a: Action) => {
    if (a.kind === "ask") ask(a.label, a.topic);
    else if (a.kind === "scroll") scrollToSection(a.sectionId);
    // links are real <a> elements and handled by the browser
  };

  const actionClass =
    "px-3 py-1.5 rounded-full border-2 border-wine bg-cream text-wine text-xs font-bold cursor-pointer transition-transform hover:-translate-y-0.5 hover:bg-mustard active:scale-95";

  return (
    <div
      className="fixed bottom-0 right-3 sm:right-5 z-[88]"
      style={
        {
          fontFamily: "var(--font-body)",
          "--char-h": `clamp(${CHAR_SIZE.minPx}px, ${CHAR_SIZE.vh}dvh, ${CHAR_SIZE.maxPx}px)`,
          "--char-w": `calc(var(--char-h) * ${CHARACTER.width} / ${CHARACTER.height})`,
        } as React.CSSProperties
      }
    >
      {/* ── Chat window ── */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Gab"
          style={{ bottom: "calc(var(--char-h) + 4px)", height: "min(480px, calc(100dvh - var(--char-h) - 72px))" }}
          className="absolute right-0 w-[min(360px,calc(100vw-1.5rem))] flex flex-col bg-cream text-wine border-4 border-wine rounded-2xl overflow-hidden shadow-[6px_6px_0_0_#F1A512]"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-wine text-cream">
            <div className="relative w-11 h-11 rounded-full bg-mustard border-2 border-cream overflow-hidden shrink-0">
              <Image src="/picture/gab-simpson-head.png" alt="" fill sizes="44px" className="object-cover" />
            </div>
            <div className="leading-tight">
              <div className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Gab (cartoon edition)
              </div>
              <div className="text-[11px] text-cream/70">Quick answers about me and this site</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="ml-auto w-8 h-8 rounded-full bg-cream/15 hover:bg-mustard hover:text-wine flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={listRef}
            role="log"
            aria-live="polite"
            className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-mint/40"
            data-lenis-prevent
          >
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"} gap-2`}>
                {m.from === "bot" && (
                  <div className="relative w-8 h-8 rounded-full bg-mustard border-2 border-wine overflow-hidden shrink-0 mt-0.5">
                    <Image src="/picture/gab-simpson-head.png" alt="" fill sizes="32px" className="object-cover" />
                  </div>
                )}
                <div className={`max-w-[80%] ${m.from === "user" ? "" : "space-y-2"}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-snug whitespace-pre-line border-2 ${
                      m.from === "user"
                        ? "bg-wine text-cream border-wine rounded-br-sm"
                        : "bg-cream text-wine border-wine/30 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.actions && m.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.actions.map((a) =>
                        a.kind === "link" ? (
                          <a
                            key={a.label + a.href}
                            href={a.href}
                            target={a.href.startsWith("mailto:") ? undefined : "_blank"}
                            rel="noopener noreferrer"
                            className={actionClass}
                          >
                            {a.label} ↗
                          </a>
                        ) : (
                          <button key={a.label} type="button" onClick={() => runAction(a)} className={actionClass}>
                            {a.label}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-center gap-2" aria-label="Typing">
                <div className="relative w-8 h-8 rounded-full bg-mustard border-2 border-wine overflow-hidden shrink-0">
                  <Image src="/picture/gab-simpson-head.png" alt="" fill sizes="32px" className="object-cover" />
                </div>
                <div className="px-3 py-2.5 rounded-2xl rounded-bl-sm bg-cream border-2 border-wine/30 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-wine/60 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 px-3 py-2.5 border-t-2 border-wine bg-cream">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my work…"
              maxLength={200}
              aria-label="Type your question"
              className="flex-1 min-w-0 px-3 py-2 rounded-full border-2 border-wine/40 bg-white/70 text-sm text-wine placeholder:text-wine/50 outline-none focus:border-wine"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              aria-label="Send question"
              className="w-9 h-9 rounded-full bg-mustard text-wine border-2 border-wine flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ── Speech bubble nudge ── */}
      {!open && showBubble && (
        <div style={{ right: "calc(var(--char-w) + 6px)", bottom: "calc(var(--char-h) - 56px)" }} className="absolute px-3 py-2 rounded-2xl rounded-br-sm bg-cream text-wine border-2 border-wine text-sm font-bold shadow-[3px_3px_0_0_#8C0027] whitespace-nowrap animate-fadeIn pointer-events-none">
          Ask me anything!
        </div>
      )}

      {/* ── The character: full body, so props in future outfits stay visible ── */}
      <button
        type="button"
        onClick={toggle}
        aria-label={open ? "Close chat" : "Chat with Gab"}
        aria-expanded={open}
        className="relative block cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-mustard rounded-2xl"
        style={{ height: "var(--char-h)", width: "var(--char-w)" }}
      >
        <div ref={characterRef} className="absolute inset-0 will-change-transform">
          <Image
            src={CHARACTER.src}
            alt=""
            width={CHARACTER.width}
            height={CHARACTER.height}
            sizes="70px"
            className="w-full h-full object-contain object-bottom drop-shadow-[3px_3px_0_rgba(140,0,39,0.45)]"
          />
        </div>
      </button>
    </div>
  );
}
