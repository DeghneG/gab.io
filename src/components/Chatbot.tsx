"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { X, Send } from "lucide-react";
import SuitRig from "@/components/SuitRig";
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
 * One big comic cloud for the outfit-change burst (same look as the hero clouds: cream fill,
 * wine outline, hard wine shadow, swirl marks). The outline is a ring of round bumps around an
 * ellipse, so it can be made any size: just big enough to hide the whole character.
 */
function cloudShape(w: number, h: number) {
  const r = Math.min(w, h) * 0.2; // bump size
  const rx = w / 2 - r * 0.75;
  const ry = h / 2 - r * 0.75;
  const n = Math.max(9, Math.round((Math.PI * (rx + ry)) / (r * 1.55)));
  const cx = w / 2;
  const cy = h / 2;
  const pt = (i: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  };
  const start = pt(0);
  let body = `M ${start[0].toFixed(1)} ${start[1].toFixed(1)}`;
  for (let i = 1; i <= n; i++) {
    const q = pt(i % n);
    body += ` A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  }
  body += " Z";
  // little curved swirl marks inside, like the hero clouds
  const sw = (x: number, y: number, k: number) =>
    `M ${(cx + x * w).toFixed(1)} ${(cy + y * h).toFixed(1)} q ${(0.06 * w * k).toFixed(1)} ${(-0.045 * h).toFixed(1)} ${(0.13 * w * k).toFixed(1)} 0`;
  const swirls = [sw(-0.2, -0.16, 1), sw(0.04, -0.02, 1), sw(-0.16, 0.2, 0.9), sw(0.06, 0.28, 0.8)];
  return { body, swirls };
}

/**
 * How big the full-body character is. Height scales with the screen between MIN and MAX
 * (in px / dvh); width follows the image ratio. Raise MAX_PX to make him bigger.
 */

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [showBubble, setShowBubble] = useState(false);

  const idRef = useRef(0);
  const greeted = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const bursting = useRef(false);
  const burstTl = useRef<gsap.core.Timeline | null>(null);
  const [outfit, setOutfit] = useState<Outfit>("suit");
  const [everOpened, setEverOpened] = useState(false);

  /* Draggable character. The offset lives in a ref and is written straight to the DOM,
     so dragging never re-renders the chat (smooth, no snapping back). */
  const rootRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [place, setPlace] = useState({ below: false, left: false });
  const drag = useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const justDragged = useRef(false);

  const applyPos = useCallback((x: number, y: number) => {
    const el = rootRef.current;
    if (!el) return;
    const btn = el.querySelector<HTMLElement>("[data-char]");
    if (btn) {
      // keep the whole character on screen
      const r = btn.getBoundingClientRect();
      const baseL = r.left - posRef.current.x;
      const baseT = r.top - posRef.current.y;
      x = Math.min(window.innerWidth - r.width - baseL - 4, Math.max(-baseL + 4, x));
      y = Math.min(window.innerHeight - r.height - baseT - 4, Math.max(-baseT + 4, y));
    }
    posRef.current = { x, y };
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  /** Open the chat window / bubble on whichever side has room. */
  const updatePlace = useCallback(() => {
    const btn = rootRef.current?.querySelector<HTMLElement>("[data-char]");
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const small = window.innerWidth < 640;
    const chatH = small ? Math.min(400, window.innerHeight - 64 - r.height) : 480;
    const chatW = small ? 300 : 360;
    const below = r.top < chatH + 16 && window.innerHeight - r.bottom > r.top;
    const left = r.right < chatW + 16;
    setPlace((p) => (p.below === below && p.left === left ? p : { below, left }));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    drag.current = { sx: e.clientX, sy: e.clientY, ox: posRef.current.x, oy: posRef.current.y, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 6) return;
    if (!d.moved) {
      d.moved = true;
      setDragging(true);
    }
    applyPos(d.ox + dx, d.oy + dy);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (d?.moved) {
      justDragged.current = true;
      setTimeout(() => (justDragged.current = false), 0);
      setDragging(false);
      updatePlace();
      try {
        localStorage.setItem("gab-chat-pos", JSON.stringify(posRef.current));
      } catch {}
    }
  };

  /* Restore the saved spot once; keep the character on screen when the window resizes. */
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem("gab-chat-pos");
        if (raw) {
          const v = JSON.parse(raw) as { x: number; y: number };
          if (Number.isFinite(v.x) && Number.isFinite(v.y)) applyPos(v.x, v.y);
        }
      } catch {}
      updatePlace();
    }, 0);
    const onResize = () => {
      applyPos(posRef.current.x, posRef.current.y);
      updatePlace();
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, [applyPos, updatePlace]);
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
    const cloud = box?.querySelector<SVGSVGElement>("[data-cloud]");
    if (!box || !cloud) {
      setOutfit(to);
      return;
    }
    if (bursting.current) return;
    bursting.current = true;
    gsap.killTweensOf(cloud);

    // size the cloud to hide the widest of the two outfits, with a little margin
    const { height: H } = box.getBoundingClientRect();
    const aspect = (o: Outfit) => CHARACTERS[o].width / CHARACTERS[o].height;
    const w = Math.max(H * 0.72, Math.max(aspect(outfit), aspect(to)) * H * 1.2);
    const h = H * 1.22;
    const base = H * 0.04; // sit a little low so the shoes are covered too
    const { body, swirls } = cloudShape(w, h);
    cloud.setAttribute("width", String(w));
    cloud.setAttribute("height", String(h));
    cloud.setAttribute("viewBox", `0 0 ${w} ${h}`);
    cloud.querySelector("[data-body]")?.setAttribute("d", body);
    cloud.querySelectorAll("[data-swirl]").forEach((el, i) => el.setAttribute("d", swirls[i] ?? ""));

    gsap.set(cloud, { xPercent: -50, yPercent: -50, x: 0, y: base, scale: 0.08, rotation: gsap.utils.random(-6, 6), opacity: 1 });

    burstTl.current = gsap
      .timeline({
        onComplete: () => {
          bursting.current = false;
          gsap.set(cloud, { opacity: 0 });
        },
      })
      // POOF: the cloud bursts out of the middle and covers him
      .to(cloud, { scale: 1.06, rotation: 0, duration: 0.22, ease: "back.out(2.2)" })
      // swap outfits while the cloud hides him
      .call(() => setOutfit(to))
      // it puffs up and drifts for a beat
      .to(cloud, { scale: 1.1, y: base - 6, duration: 0.2, ease: "sine.out" })
      // then thins out fast, rising and growing as it fades
      .to(cloud, { opacity: 0, scale: 1.3, y: base - 22, duration: 0.3, ease: "power2.in" });
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
    // side effects live outside the state updater (React runs updaters twice in dev, which doubled the greeting)
    const next = !open;
    setOpen(next);
    if (next) setEverOpened(true);
    if (next && !greeted.current && messages.length === 0) {
      greeted.current = true;
      botSay("greeting");
    }
    if (next) setTimeout(() => inputRef.current?.focus(), 50);
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

  const visW = `(var(--char-h) * ${CHARACTERS[outfit].width / CHARACTERS[outfit].height})`;

  const actionClass =
    "px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border-2 border-wine bg-cream text-wine text-[11px] sm:text-xs font-bold cursor-pointer transition-transform hover:-translate-y-0.5 hover:bg-mustard active:scale-95";

  return (
    <div
      ref={rootRef}
      className="chat-root fixed bottom-0 right-3 sm:right-5 z-[88]"
      style={
        {
          fontFamily: "var(--font-body)",
          "--char-w": `calc(var(--char-h) * ${BOX_ASPECT})`,
        } as React.CSSProperties
      }
    >
      {/* ── Chat window ── */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Gab"
          style={{
            ...(place.below ? { top: "calc(var(--char-h) + 4px)" } : { bottom: "calc(var(--char-h) + 4px)" }),
            ...(place.left ? { left: 0 } : { right: 0 }),
            height: "var(--chat-h)",
          }}
          className="absolute w-[var(--chat-w)] flex flex-col bg-cream text-wine border-4 border-wine rounded-2xl overflow-hidden shadow-[6px_6px_0_0_#F1A512]"
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3 bg-wine text-cream">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-mustard border-2 border-cream overflow-hidden shrink-0">
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
            className="flex-1 overflow-y-auto px-2.5 py-2.5 sm:px-3 sm:py-3 space-y-2.5 sm:space-y-3 bg-mint/40"
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
                    className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl text-[13px] sm:text-sm leading-snug whitespace-pre-line border-2 ${
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
              className="flex-1 min-w-0 px-3 py-2 rounded-full border-2 border-wine/40 bg-white/70 text-base sm:text-sm text-wine placeholder:text-wine/50 outline-none focus:border-wine"
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
        <div style={{ ...(place.left ? { left: `calc((var(--char-w) + ${visW}) / 2 + 6px)` } : { right: `calc((var(--char-w) + ${visW}) / 2 + 6px)` }), bottom: "calc(var(--char-h) - 56px)" }} className={`absolute px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl ${place.left ? "rounded-bl-sm" : "rounded-br-sm"} bg-cream text-wine border-2 border-wine text-xs sm:text-sm font-bold shadow-[3px_3px_0_0_#8C0027] whitespace-nowrap animate-fadeIn pointer-events-none`}>
          Ask me anything!
        </div>
      )}

      {/* ── The character: full body, so props in future outfits stay visible ── */}
      <button
        type="button"
        data-char
        onClick={() => {
          if (justDragged.current) return;
          toggle();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        aria-label={open ? "Close chat" : "Chat with Gab"}
        aria-expanded={open}
        title="Drag me anywhere!"
        className={`relative block outline-none focus-visible:ring-4 focus-visible:ring-mustard rounded-2xl touch-none select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{ height: "var(--char-h)", width: "var(--char-w)" }}
      >
        <div ref={characterRef} className="absolute inset-0 will-change-transform">
          {/* Formal suit: layered, so he can wave and fix his tie */}
          <div className="absolute inset-0" style={{ opacity: outfit === "suit" ? 1 : 0 }}>
            <SuitRig active={outfit === "suit"} />
          </div>
          {(Object.keys(CHARACTERS) as Outfit[]).filter((o) => o !== "suit" && (everOpened || outfit === o)).map((o) => (
            <Image
              key={o}
              src={CHARACTERS[o].src}
              alt=""
              width={CHARACTERS[o].width}
              height={CHARACTERS[o].height}
              sizes="100px"
              draggable={false}
              className="absolute inset-0 w-full h-full object-contain object-bottom drop-shadow-[3px_3px_0_rgba(140,0,39,0.45)]"
              style={{ opacity: outfit === o ? 1 : 0 }}
            />
          ))}

          {/* The comic cloud for the outfit-change burst (sized and drawn when it fires) */}
          <div ref={cloudRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
            <svg
              data-cloud=""
              fill="none"
              className="absolute left-1/2 top-1/2 overflow-visible opacity-0 will-change-transform"
              style={{ filter: "drop-shadow(3px 3px 0 #8C0027)" }}
            >
              <path data-body="" fill="#F5F0E8" stroke="#8C0027" strokeWidth="3.5" strokeLinejoin="round" />
              {[0, 1, 2, 3].map((i) => (
                <path key={i} data-swirl="" fill="none" stroke="#8C0027" strokeWidth="2.5" strokeLinecap="round" />
              ))}
            </svg>
          </div>
        </div>
      </button>
    </div>
  );
}
