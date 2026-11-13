"use client";

import { useRef, useState } from "react";
import { isLowPower } from "@/lib/device";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

/**
 * A small flock of hand-drawn ink birds (brush-stroke gull silhouettes) gliding across the hero.
 * Each wing is a tapered brush stroke along a two-segment arm: the outer part lags behind the inner
 * part, the downstroke is faster than the upstroke, and birds flap in bursts then glide, like real ones.
 */

const INK = "#1a0810";
/** Overall bird size (1 = the original, much larger look) */
const SCALE = 0.62;

/** Asymmetric wave: faster downstroke, slower upstroke. Output -1 (down) .. 1 (up). */
export const stroke = (phase: number) => Math.sin(phase - 0.4 * Math.sin(phase));

type P = [number, number];

/** Outline of one tapered wing. `up` is the inner-arm angle, `tip` the outer-arm angle (radians, 0 = level). */
function wing(side: number, up: number, tip: number, len: number) {
  const L1 = 26 * len;
  const L2 = 36 * len;
  const c: P = [side * Math.cos(up) * L1, -Math.sin(up) * L1];
  const t: P = [c[0] + side * Math.cos(tip) * L2, c[1] - Math.sin(tip) * L2];
  const N = 14;
  const pts: P[] = [];
  const nrm: P[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const x = 2 * (1 - u) * u * c[0] + u * u * t[0];
    const y = 2 * (1 - u) * u * c[1] + u * u * t[1];
    const dx = 2 * (1 - u) * c[0] + 2 * u * (t[0] - c[0]);
    const dy = 2 * (1 - u) * c[1] + 2 * u * (t[1] - c[1]);
    const d = Math.hypot(dx, dy) || 1;
    pts.push([x, y]);
    nrm.push([-dy / d, dx / d]);
  }
  const thick = (u: number) => 0.8 + 6.4 * Math.pow(1 - u, 0.9); // fat at the shoulder, fine at the tip
  const top: P[] = [];
  const bot: P[] = [];
  pts.forEach(([x, y], i) => {
    const th = thick(i / N);
    const n = nrm[i];
    top.push([x - n[0] * th * side, y - n[1] * th * side]);
    bot.push([x + n[0] * th * 0.7 * side, y + n[1] * th * 0.7 * side]);
  });
  const f = (q: P) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  const d = `M${top.map(f).join("L")}L${[...bot].reverse().map(f).join("L")}Z`;
  return { d, top, bot };
}

/** Convex hull (monotone chain) so the shoulder area can be filled solid. */
function hull(points: P[]): P[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: P, a: P, b: P) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: P[] = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  const upper: P[] = [];
  for (const q of [...p].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

/** Both wings for a flap phase and amplitude (amp 0 = gliding, 1 = full flapping). */
function wings(phase: number, amp: number) {
  const glideUp = 0.95; // gliding: arms swept up, hands drooping (classic gull shape)
  const glideTip = -0.55;
  const rUp = glideUp + amp * (0.2 + 0.95 * stroke(phase) - glideUp);
  const rTip = glideTip + amp * (0.05 + 1.1 * stroke(phase - 0.75) - glideTip);
  // the far wing is a touch shorter and a hair behind (perspective)
  const lUp = glideUp + amp * (0.2 + 0.9 * stroke(phase - 0.18) - glideUp);
  const lTip = glideTip + amp * (0.05 + 1.0 * stroke(phase - 0.93) - glideTip);
  return { r: wing(1, rUp, rTip, 1), l: wing(-1, lUp, lTip, 0.86) };
}

export function birdPath(phase: number, amp: number) {
  const { r, l } = wings(phase, amp);
  return `${r.d} ${l.d}`;
}

/** Solid filler between the two wing roots, so no gap shows at the shoulders however the wings are held. */
export function birdBridge(phase: number, amp: number) {
  const { r, l } = wings(phase, amp);
  const h = hull([...r.top.slice(0, 5), ...l.top.slice(0, 5), ...r.bot.slice(0, 4), ...l.bot.slice(0, 4)]);
  return `M${h.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join("L")}Z`;
}

/** [distance behind the leader, height offset, size] */
const FLOCK: [number, number, number][] = [
  [0, 0, 1.15],
  [115, 42, 0.88],
  [160, -38, 0.76],
  [255, 14, 0.6],
  [295, 72, 0.5],
  [380, -8, 0.44],
];

export default function BirdFlock() {
  const ref = useRef<HTMLDivElement>(null);
  // phones and slow devices: fewer birds, no blur/roughen filter, flapping drawn at half rate
  const [lite] = useState(() => isLowPower());
  const flockList = lite ? FLOCK.slice(0, 3) : FLOCK;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const flock = root.querySelector<HTMLElement>("[data-flock]")!;
      const birds = gsap.utils.toArray<HTMLElement>("[data-bird]", root);
      let dead = false;
      let onScreen = true;
      let frame = 0;
      const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
      io.observe(root);

      /* flapping: one little state machine per bird (flap a few beats, then glide) */
      const states = birds.map((el, i) => ({
        path: el.querySelector<SVGPathElement>("[data-wings]")!,
        bridge: el.querySelector<SVGPathElement>("[data-bridge]")!,
        phase: Math.random() * 6.28,
        amp: 1,
        flapping: true,
        timer: 0,
        beats: 3 + Math.random() * 4,
        rate: 6.5 + (i % 3) * 0.9 - i * 0.35, // radians per second (~1 flap/s for the big ones, a little quicker for small)
      }));
      const paint = (s: (typeof states)[number]) => {
        s.path.setAttribute("d", birdPath(s.phase, s.amp));
        s.bridge.setAttribute("d", birdBridge(s.phase, s.amp));
      };
      states.forEach(paint);

      const tick = () => {
        if (!onScreen || document.hidden) return; // nothing to draw while the hero is off-screen
        frame++;
        if (lite && frame % 2) return;
        const dt = Math.min(0.05, (gsap.ticker.deltaRatio(60) / 60) * (lite ? 2 : 1));
        for (const s of states) {
          s.timer += dt;
          if (s.flapping) {
            s.phase += dt * s.rate;
            if (s.timer * s.rate > s.beats * 6.283) {
              s.flapping = false;
              s.timer = 0;
              s.beats = 1.1 + Math.random() * 2.2; // glide length in seconds
            }
          } else if (s.timer > s.beats) {
            s.flapping = true;
            s.timer = 0;
            s.beats = 3 + Math.random() * 4; // number of flaps
          }
          // ease between flapping and gliding so the wings never snap
          s.amp += ((s.flapping ? 1 : 0) - s.amp) * Math.min(1, dt * 5);
          paint(s);
        }
      };
      gsap.ticker.add(tick);

      /* each bird bobs and banks a little on its own rhythm */
      birds.forEach((el) => {
        gsap.to(el.firstElementChild, {
          y: gsap.utils.random(6, 14),
          rotation: gsap.utils.random(-5, 5),
          duration: gsap.utils.random(1.4, 2.2),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      /* the flock crosses the sky, pauses, then comes back the other way */
      let ltr = true;
      const fly = () => {
        if (dead) return;
        const w = window.innerWidth;
        const dur = gsap.utils.random(22, 30);
        gsap.set(flock, { top: `${gsap.utils.random(9, 22)}%`, scaleX: ltr ? 1 : -1 });
        gsap.fromTo(
          flock,
          { x: ltr ? -200 : w + 200 },
          {
            x: ltr ? w + 700 : -700,
            duration: dur,
            ease: "none",
            onComplete: () => {
              ltr = !ltr;
              gsap.delayedCall(gsap.utils.random(3, 7), fly);
            },
          }
        );
        gsap.fromTo(flock, { y: 0 }, { y: gsap.utils.random(-30, 30), duration: dur, ease: "sine.inOut", yoyo: true, repeat: 1 });
      };
      // wait for the loader's shutters (if it is showing), then take off
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        gsap.delayedCall(1.2, fly);
      };
      const fallback = setTimeout(start, 6000);
      if (document.querySelector('[aria-label="Loading portfolio"]')) window.addEventListener("loader:open", start, { once: true });
      else start();

      return () => {
        dead = true;
        clearTimeout(fallback);
        window.removeEventListener("loader:open", start);
        io.disconnect();
        gsap.ticker.remove(tick);
      };
    },
    { scope: ref, dependencies: [lite] }
  );

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[30] overflow-hidden">
      {/* slightly rough, brushy edges */}
      <svg width="0" height="0" className="absolute">
        <filter id="brush-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" />
        </filter>
      </svg>
      <div data-flock="" className="absolute left-0 will-change-transform" style={{ top: "10%" }}>
        {flockList.map(([back, dy, size], i) => (
          <div
            key={i}
            data-bird=""
            className="absolute"
            style={{ left: -back, top: dy, width: 130 * size * SCALE, height: 90 * size * SCALE, marginLeft: -65 * size * SCALE, marginTop: -55 * size * SCALE }}
          >
            <div className="w-full h-full will-change-transform">
              <svg viewBox="-65 -60 130 90" className="w-full h-full overflow-visible" style={lite ? undefined : { filter: "url(#brush-rough)" }}>
                <ellipse cx="0" cy="3" rx="6.5" ry="6" fill={INK} />
                <circle cx="0" cy="-0.5" r="6.5" fill={INK} />
                <path data-bridge="" d={birdBridge(0, 0)} fill={INK} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
                <path data-wings="" d={birdPath(0, 0)} fill={INK} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
