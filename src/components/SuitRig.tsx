"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

/**
 * The formal-suit character, split into layers (body, both arms, tie) so GSAP can
 * move the parts: every so often he waves, or the tie goes crooked and he fixes it.
 * While a gesture runs, the flat arm image is swapped for a drawn "rubber hose" arm
 * (two-bone IK) in the same navy / black-outline style, with a cartoon hand.
 */

const W = 438;
const H = 1414;
const SLEEVE = "#181f39";
const SKIN = "#FDCB2C";

type Pt = { x: number; y: number };

const ARMS = {
  r: { shoulder: { x: 372, y: 350 }, rest: { x: 352, y: 745 }, bend: 1 },
  l: { shoulder: { x: 50, y: 350 }, rest: { x: 38, y: 745 }, bend: 1 },
} as const;
const BONE = 200; // upper arm and forearm length

/** Two-bone IK: where the elbow goes so the wrist reaches `w`. */
function solve(s: Pt, w: Pt, side: number) {
  let dx = w.x - s.x;
  let dy = w.y - s.y;
  let d = Math.hypot(dx, dy);
  const max = BONE * 2 - 1;
  if (d > max) {
    dx = (dx / d) * max;
    dy = (dy / d) * max;
    d = max;
    w = { x: s.x + dx, y: s.y + dy };
  }
  const ux = dx / d;
  const uy = dy / d;
  const h = Math.sqrt(Math.max(0, BONE * BONE - (d / 2) * (d / 2)));
  // perpendicular, flipped by `side`
  const e = { x: s.x + dx / 2 - uy * h * side, y: s.y + dy / 2 + ux * h * side };
  return { e, w };
}

export default function SuitRig({ active }: { active: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !active) return;

    const q = <T extends Element>(sel: string) => root.querySelector<T>(sel);
    const armImg = { r: q<HTMLElement>('[data-part="armR"]'), l: q<HTMLElement>('[data-part="armL"]') };
    const hose = { r: q<SVGGElement>('[data-hose="r"]'), l: q<SVGGElement>('[data-hose="l"]') };
    const tie = q<HTMLElement>('[data-part="tie"]');
    if (!armImg.r || !armImg.l || !hose.r || !hose.l || !tie) return;

    const wrist = { r: { ...ARMS.r.rest }, l: { ...ARMS.l.rest } };

    const draw = (k: "r" | "l") => {
      const a = ARMS[k];
      const { e, w } = solve(a.shoulder, wrist[k], a.bend);
      const d = `M${a.shoulder.x} ${a.shoulder.y} L${e.x} ${e.y} L${w.x} ${w.y}`;
      hose[k]!.querySelectorAll("path[data-sleeve]").forEach((p) => p.setAttribute("d", d));
      const dir = { x: w.x - e.x, y: w.y - e.y };
      const ang = (Math.atan2(dir.x, -dir.y) * 180) / Math.PI;
      hose[k]!.querySelector("[data-hand]")!.setAttribute("transform", `translate(${w.x} ${w.y}) rotate(${ang}) scale(1.35)`);
    };

    const rest = () => {
      gsap.set(armImg.r, { opacity: 1 });
      gsap.set(armImg.l, { opacity: 1 });
      gsap.set(hose.r, { opacity: 0 });
      gsap.set(hose.l, { opacity: 0 });
      gsap.set(tie, { rotation: 0, x: 0 });
      Object.assign(wrist.r, ARMS.r.rest);
      Object.assign(wrist.l, ARMS.l.rest);
    };
    rest();
    draw("r");
    draw("l");

    /** Swap the photo arm for the drawn one (and back). */
    const takeArm = (k: "r" | "l") => {
      draw(k);
      gsap.set(hose[k], { opacity: 1 });
      gsap.set(armImg[k], { opacity: 0 });
    };
    const returnArm = (k: "r" | "l") => {
      Object.assign(wrist[k], ARMS[k].rest);
      draw(k);
      gsap.set(armImg[k], { opacity: 1 });
      gsap.set(hose[k], { opacity: 0 });
    };
    const moveWrist = (k: "r" | "l", to: Pt, duration: number, ease = "power2.inOut") =>
      gsap.to(wrist[k], { ...to, duration, ease, onUpdate: () => draw(k) });

    /* ── Gesture 1: wave hello ── */
    const wave = (done: () => void) => {
      const tl = gsap.timeline({ onComplete: () => { returnArm("r"); done(); } });
      tl.call(() => takeArm("r"));
      tl.add(moveWrist("r", { x: 500, y: 250 }, 0.55, "back.out(1.4)"));
      for (let i = 0; i < 4; i++) {
        tl.add(moveWrist("r", { x: 545, y: 240 }, 0.2, "sine.inOut"));
        tl.add(moveWrist("r", { x: 470, y: 250 }, 0.2, "sine.inOut"));
      }
      tl.add(moveWrist("r", { x: 500, y: 250 }, 0.15));
      tl.add(moveWrist("r", { ...ARMS.r.rest }, 0.6, "power2.inOut"));
      return tl;
    };

    /* ── Gesture 2: the tie goes crooked, he straightens it ── */
    const fixTie = (done: () => void) => {
      const tl = gsap.timeline({ onComplete: () => { returnArm("l"); gsap.set(tie, { rotation: 0, x: 0 }); done(); } });
      // a little gust: the tie swings, then hangs crooked
      tl.to(tie, { rotation: 9, duration: 0.25, ease: "sine.inOut", transformOrigin: "38% 23%" });
      tl.to(tie, { rotation: -6, duration: 0.3, ease: "sine.inOut" });
      tl.to(tie, { rotation: -20, x: -5, duration: 0.35, ease: "back.out(2)" });
      tl.to({}, { duration: 0.45 }); // beat: it's crooked
      // hand comes up to the tie
      tl.call(() => takeArm("l"));
      tl.add(moveWrist("l", { x: 98, y: 482 }, 0.6, "power2.out"));
      // tug it straight in two pulls
      tl.add(moveWrist("l", { x: 102, y: 506 }, 0.18, "power1.in"));
      tl.to(tie, { rotation: -8, x: -2, duration: 0.18, ease: "power1.out" }, "<");
      tl.add(moveWrist("l", { x: 98, y: 466 }, 0.2, "power1.out"));
      tl.add(moveWrist("l", { x: 102, y: 510 }, 0.18, "power1.in"));
      tl.to(tie, { rotation: 0, x: 0, duration: 0.4, ease: "elastic.out(1.1, 0.4)" }, "<");
      // smooth it down, then lower the arm
      tl.add(moveWrist("l", { x: 104, y: 452 }, 0.3, "sine.inOut"));
      tl.add(moveWrist("l", { x: 104, y: 502 }, 0.3, "sine.inOut"));
      tl.add(moveWrist("l", { ...ARMS.l.rest }, 0.65, "power2.inOut"));
      return tl;
    };

    /* ── Scheduler: a gesture about every 7s (pause after each one), alternating ── */
    let current: gsap.core.Timeline | null = null;
    let timer: ReturnType<typeof setTimeout>;
    let next = 0;
    const schedule = (first = false) => {
      timer = setTimeout(() => {
        const done = () => {
          current = null;
          schedule();
        };
        current = (next++ % 2 === 0 ? wave : fixTie)(done);
      }, first ? 2500 : gsap.utils.random(3000, 4200));
    };
    schedule(true);

    return () => {
      clearTimeout(timer);
      current?.kill();
      gsap.killTweensOf([wrist.r, wrist.l, tie]);
      rest();
    };
  }, [active]);

  const hand = (
    <g data-hand="">
      {/* fingers */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-22 + i * 11} y={-84 + (i === 0 || i === 3 ? 8 : i === 2 ? 3 : 0)} width="11" height="44" rx="5.5" fill={SKIN} stroke="#000" strokeWidth="3" />
      ))}
      {/* thumb */}
      <rect x="-30" y="-38" width="13" height="32" rx="6.5" fill={SKIN} stroke="#000" strokeWidth="3" transform="rotate(-38 -24 -10)" />
      {/* palm */}
      <rect x="-22" y="-58" width="44" height="52" rx="14" fill={SKIN} stroke="#000" strokeWidth="3" />
      {/* cover the inner finger outlines on the palm */}
      <rect x="-19" y="-60" width="38" height="20" fill={SKIN} />
      {/* shirt cuff */}
      <rect x="-30" y="-8" width="60" height="24" rx="6" fill="#fff" stroke="#000" strokeWidth="3.5" />
    </g>
  );

  const hoseArm = (k: "r" | "l") => (
    <g data-hose={k} style={{ opacity: 0 }}>
      <path data-sleeve="" fill="none" stroke="#000" strokeWidth="78" strokeLinecap="round" strokeLinejoin="round" />
      <path data-sleeve="" fill="none" stroke={SLEEVE} strokeWidth="70" strokeLinecap="round" strokeLinejoin="round" />
      {hand}
    </g>
  );

  const part = (name: string, extra?: React.CSSProperties) => (
    <Image
      src={`/picture/suit/${name}.png`}
      alt=""
      width={W}
      height={H}
      sizes="100px"
      draggable={false}
      data-part={name}
      priority={name === "base"}
      className="absolute inset-0 w-full h-full"
      style={extra}
    />
  );

  return (
    <div
      ref={rootRef}
      className="absolute bottom-0 left-1/2 h-full -translate-x-1/2 drop-shadow-[3px_3px_0_rgba(140,0,39,0.45)]"
      style={{ aspectRatio: `${W} / ${H}` }}
    >
      {part("base")}
      {part("armR")}
      {part("armL")}
      {part("tie", { transformOrigin: "38% 23%" })}
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" aria-hidden="true">
        {hoseArm("r")}
        {hoseArm("l")}
      </svg>
    </div>
  );
}
