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
  hobbies,
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
  { topic: "hobbies", label: "Hobbies" },
  { topic: "contact", label: "Contact" },
];

type Outfit = "suit" | "chef" | "sport" | "gamer" | "series" | "anime" | "dogs";

/** Topics that change the character's outfit when asked (with a cloud burst). */
const TOPIC_OUTFIT: Record<string, Outfit> = {
  dishes: "chef",
  sport: "sport",
  games: "gamer",
  series: "series",
  anime: "anime",
  dogs: "dogs",
  "suit-back": "suit",
};

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

    case "hobbies": {
      const names = hobbies.map((h) => h.name.toLowerCase());
      const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0] ?? "";
      const actions: Action[] = [];
      if (hobbies.find((h) => h.slug === "cooking")?.favorites?.length) {
        actions.push({ kind: "ask", label: "Dishes", topic: "dishes" });
      }
      if (hobbies.some((h) => h.slug === "basketball")) {
        actions.push({ kind: "ask", label: "Sport", topic: "sport" });
      }
      if (hobbies.find((h) => h.slug === "gaming")?.favorites?.length) {
        actions.push({ kind: "ask", label: "Games", topic: "games" });
      }
      if (hobbies.find((h) => h.slug === "series")?.favorites?.length) {
        actions.push({ kind: "ask", label: "Series", topic: "series" });
      }
      if (hobbies.find((h) => h.slug === "anime")?.favorites?.length) {
        actions.push({ kind: "ask", label: "Anime", topic: "anime" });
      }
      if (hobbies.some((h) => h.slug === "dogs")) {
        actions.push({ kind: "ask", label: "Dogs", topic: "dogs" });
      }
      return { text: `Outside of coding, I love ${list}! Tap one to see my favorites.`, actions };
    }

    case "dishes": {
      const cooking = hobbies.find((h) => h.slug === "cooking");
      const list = cooking?.favorites ?? [];
      return {
        text: list.length
          ? `Chef Gab at your service! My favorite dishes to cook:\n${list.map((d) => `• ${d}`).join("\n")}`
          : `I love cooking, but I haven't written down my favorites yet.`,
        actions: [
          { kind: "ask", label: "Back to suit", topic: "suit-back" },
          { kind: "ask", label: "Sport", topic: "sport" },
          { kind: "ask", label: "Games", topic: "games" },
          { kind: "ask", label: "Series", topic: "series" },
        ],
      };
    }

    case "sport": {
      const bb = hobbies.find((h) => h.slug === "basketball");
      return {
        text: bb
          ? `Basketball all the way, and I'm a ${bb.note ?? "big fan"}!`
          : `Basketball is my favorite sport!`,
        actions: [
          { kind: "ask", label: "Back to suit", topic: "suit-back" },
          { kind: "ask", label: "Dishes", topic: "dishes" },
          { kind: "ask", label: "Games", topic: "games" },
          { kind: "ask", label: "Series", topic: "series" },
        ],
      };
    }

    case "games": {
      const list = hobbies.find((h) => h.slug === "gaming")?.favorites ?? [];
      return {
        text: list.length
          ? `Gamer mode on! My favorite games:\n${list.map((g) => `• ${g}`).join("\n")}`
          : `I love gaming, but I haven't written down my favorites yet.`,
        actions: [
          { kind: "ask", label: "Back to suit", topic: "suit-back" },
          { kind: "ask", label: "Dishes", topic: "dishes" },
          { kind: "ask", label: "Sport", topic: "sport" },
          { kind: "ask", label: "Series", topic: "series" },
        ],
      };
    }

    case "series": {
      const list = hobbies.find((h) => h.slug === "series")?.favorites ?? [];
      return {
        text: list.length
          ? `Winter is coming... My favorite series:\n${list.map((t) => `• ${t}`).join("\n")}`
          : `I love binge-watching series, but I haven't written down my favorites yet.`,
        actions: [
          { kind: "ask", label: "Back to suit", topic: "suit-back" },
          { kind: "ask", label: "Dishes", topic: "dishes" },
          { kind: "ask", label: "Games", topic: "games" },
        ],
      };
    }

    case "anime": {
      const list = hobbies.find((h) => h.slug === "anime")?.favorites ?? [];
      return {
        text: list.length
          ? `Believe it! My favorite anime:\n${list.map((t) => `• ${t}`).join("\n")}`
          : `I love anime, but I haven't written down my favorites yet.`,
        actions: [
          { kind: "ask", label: "Back to suit", topic: "suit-back" },
          { kind: "ask", label: "Dogs", topic: "dogs" },
          { kind: "ask", label: "Series", topic: "series" },
        ],
      };
    }

    case "dogs":
      return {
        text: `These are my dogs, and yes, I'm a total dog lover! They're the best part of my day.`,
        actions: [
          { kind: "ask", label: "Back to suit", topic: "suit-back" },
          { kind: "ask", label: "Anime", topic: "anime" },
          { kind: "ask", label: "Dishes", topic: "dishes" },
        ],
      };

    case "menu":
      return {
        text: `Sure! What would you like to know?`,
        actions: MAIN_TOPICS.map((t) => ({ kind: "ask", label: t.label, topic: t.topic })),
      };

    case "suit-back":
      return {
        text: `Suit back on! What else would you like to know?`,
        actions: MAIN_TOPICS.map((t) => ({ kind: "ask", label: t.label, topic: t.topic })),
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
  { topic: "dishes", words: ["dish", "dishes", "recipe", "recipes", "food", "chef", "bangus", "sinabawang", "fried chicken", "favorite food"] },
  { topic: "sport", words: ["sport", "sports", "basketball", "warriors", "nba", "golden state", "curry", "hoops", "jersey", "baller"] },
  { topic: "games", words: ["game", "games", "gaming", "gamer", "valorant", "mobile legends", "mlbb", "gta", "gta v", "play"] },
  { topic: "series", words: ["series", "show", "shows", "tv", "netflix", "watch", "the 100", "game of thrones", "got", "walking dead", "alice in borderland", "borderland", "binge"] },
  { topic: "anime", words: ["anime", "naruto", "black clover", "one piece", "onepiece", "manga", "luffy"] },
  { topic: "dogs", words: ["dog", "dogs", "puppy", "puppies", "pet", "pets", "doggo", "pup"] },
  { topic: "hobbies", words: ["hobby", "hobbies", "free time", "cook", "cooking", "outside of coding", "interests"] },
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

const CHARACTERS = {
  suit: { src: "/picture/gab-simpson.png", head: "/picture/gab-simpson-head.png", width: 438, height: 1414 },
  chef: { src: "/picture/gab-chef.png", head: "/picture/gab-chef-head.png", width: 675, height: 1349 },
  sport: { src: "/picture/gab-sport.png", head: "/picture/gab-sport-head.png", width: 565, height: 1416 },
  series: { src: "/picture/gab-series.png", head: "/picture/gab-series-head.png", width: 860, height: 1422 },
  anime: { src: "/picture/gab-anime.png", head: "/picture/gab-anime-head.png", width: 702, height: 1416 },
  dogs: { src: "/picture/gab-dogs.png", head: "/picture/gab-dogs-head.png", width: 1215, height: 1208 },
  gamer: { src: "/picture/gab-gamer.png", head: "/picture/gab-gamer-head.png", width: 561, height: 1414 },
} as const;

/** The character box is as wide as the widest outfit (the chef holds props). */
const BOX_ASPECT = Math.max(...Object.values(CHARACTERS).map((c) => c.width / c.height));

/**
 * Comic cloud puffs for the outfit-change burst (same look as the hero clouds:
 * cream fill, wine outline, hard wine shadow, swirl marks).
 * [x%, y%, width % of the character box, shape 0|1, tilt in degrees]
 */
const PUFFS: [number, number, number, 0 | 1, number][] = [
  [50, 8, 105, 0, -6], [18, 16, 95, 1, 10], [82, 16, 100, 0, -12], [50, 30, 115, 1, 5],
  [14, 42, 100, 0, -8], [86, 42, 105, 1, 9], [50, 52, 120, 0, -4], [16, 64, 100, 1, 12],
  [84, 64, 100, 0, -10], [50, 74, 115, 1, 6], [20, 88, 100, 0, -9], [80, 88, 105, 1, 8], [50, 96, 110, 0, 3],
];

const PUFF_SHAPES = [
  {
    viewBox: "0 0 100 70",
    body: "M 22 52 C 10 52, 4 42, 10 30 C 5 18, 18 10, 32 14 C 40 4, 62 4, 72 14 C 84 8, 96 18, 92 32 C 100 42, 92 54, 80 52 C 78 62, 66 68, 52 64 C 40 68, 26 64, 22 52 Z",
    swirls: ["M 28 34 C 34 28, 44 28, 48 34", "M 58 36 C 64 30, 72 32, 76 38"],
  },
  {
    viewBox: "0 0 85 65",
    body: "M 18 48 C 8 48, 4 36, 12 26 C 8 14, 22 8, 34 12 C 44 4, 64 6, 70 18 C 82 20, 84 34, 76 44 C 78 52, 68 60, 56 58 C 45 62, 30 60, 24 52 C 20 52, 18 50, 18 48 Z",
    swirls: ["M 30 30 C 36 26, 46 26, 50 32"],
  },
] as const;

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
  const cloudRef = useRef<HTMLDivElement>(null);
  const bursting = useRef(false);
  const burstTl = useRef<gsap.core.Timeline | null>(null);
  const [outfit, setOutfit] = useState<Outfit>("suit");
  const head = CHARACTERS[outfit].head;

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

  /**
   * Cloud burst outfit change: puffs pop up over the whole character, the outfit swaps while
   * he is hidden, then the puffs fade out fast to reveal the new look.
   */
  const changeOutfit = (to: Outfit) => {
    const box = cloudRef.current;
    const puffs = gsap.utils.toArray<HTMLElement>(".cloud-puff", box ?? undefined);
    if (!box || !puffs.length) {
      setOutfit(to);
      return;
    }
    if (bursting.current) return;
    bursting.current = true;
    gsap.killTweensOf(puffs);

    // Each puff starts at the middle of the character and is thrown out to its spot.
    const { width: W, height: H } = box.getBoundingClientRect();
    const spots = PUFFS.map(([x, y]) => ({ dx: ((x - 50) / 100) * W, dy: ((y - 50) / 100) * H }));
    gsap.set(puffs, {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      scale: 0.05,
      opacity: 1,
      rotation: (i) => PUFFS[i][4] + gsap.utils.random(-40, 40),
    });

    burstTl.current = gsap
      .timeline({
        onComplete: () => {
          bursting.current = false;
          gsap.set(puffs, { opacity: 0 });
        },
      })
      // BOOM: the smoke explodes outward from the middle, fast, with overshoot
      .to(puffs, {
        x: (i) => spots[i].dx,
        y: (i) => spots[i].dy,
        scale: 1.15,
        rotation: (i) => PUFFS[i][4],
        duration: 0.22,
        ease: "power3.out",
        stagger: { each: 0.006, from: "center" },
      })
      // swap outfits while the smoke hides him
      .call(() => setOutfit(to))
      // smoke billows and drifts up for a beat
      .to(puffs, {
        scale: 1.28,
        y: (i) => spots[i].dy - 8,
        duration: 0.22,
        ease: "sine.out",
      })
      // then thins out fast, rising and growing as it fades
      .to(puffs, {
        opacity: 0,
        scale: 1.6,
        y: (i) => spots[i].dy - 26,
        duration: 0.3,
        ease: "power2.in",
        stagger: { each: 0.012, from: "edges" },
      });
  };

  /* Speech bubble nudge a few seconds after load, only until first open. */
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 4000);
    return () => clearTimeout(t);
  }, []);

  /* Clear pending bot replies on unmount. */
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      burstTl.current?.kill();
    };
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

  const botSay = useCallback((topic: string, delay = 550) => {
    setTyping(true);
    const t = setTimeout(() => {
      const reply = getReply(topic);
      // Every reply gets a way back to the menu unless it already offers one.
      const acts = reply.actions ?? [];
      const hasMenu = acts.some((a) => a.kind === "ask" && (a.topic === "menu" || a.topic === "suit-back")) || acts.length >= MAIN_TOPICS.length;
      if (!hasMenu) reply.actions = [...acts, { kind: "ask", label: "← Menu", topic: "menu" }];
      setMessages((m) => [...m, { id: ++idRef.current, from: "bot", text: reply.text, actions: reply.actions }]);
      setTyping(false);
    }, delay);
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
    const to = TOPIC_OUTFIT[topic];
    if (to && to !== outfit) {
      changeOutfit(to);
      botSay(topic, 1000); // reply lands just after the cloud clears
    } else {
      botSay(topic);
    }
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
          "--char-w": `calc(var(--char-h) * ${BOX_ASPECT})`,
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
              <Image src={head} alt="" fill sizes="44px" className="object-cover" />
            </div>
            <div className="leading-tight">
              <div className="font-bold" style={{ fontFamily: "var(--font-display)" }}>
                Gab
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
                    <Image src={head} alt="" fill sizes="32px" className="object-cover" />
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
                  <Image src={head} alt="" fill sizes="32px" className="object-cover" />
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
          {(Object.keys(CHARACTERS) as Outfit[]).map((o) => (
            <Image
              key={o}
              src={CHARACTERS[o].src}
              alt=""
              width={CHARACTERS[o].width}
              height={CHARACTERS[o].height}
              sizes="100px"
              priority={o === "suit"}
              className="absolute inset-0 w-full h-full object-contain object-bottom drop-shadow-[3px_3px_0_rgba(140,0,39,0.45)]"
              style={{ opacity: outfit === o ? 1 : 0 }}
            />
          ))}

          {/* Comic cloud puffs for the outfit-change burst */}
          <div ref={cloudRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
            {PUFFS.map(([x, y, w, shape], i) => {
              const sh = PUFF_SHAPES[shape];
              return (
                <div
                  key={i}
                  className="cloud-puff absolute opacity-0 will-change-transform"
                  style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, filter: "drop-shadow(3px 3px 0 #8C0027)" }}
                >
                  <svg viewBox={sh.viewBox} fill="none" className="w-full h-auto">
                    <path d={sh.body} fill="#F5F0E8" stroke="#8C0027" strokeWidth="3.5" strokeLinejoin="round" />
                    {sh.swirls.map((d) => (
                      <path key={d} d={d} fill="none" stroke="#8C0027" strokeWidth="2.5" strokeLinecap="round" />
                    ))}
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </button>
    </div>
  );
}
