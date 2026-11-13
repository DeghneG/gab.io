/**
 * Rough "is this a small or slow device?" check, used to scale back decorative animation
 * (fewer birds, fewer puffs, no expensive filters) instead of removing it.
 * Client-only: returns false on the server.
 */
export function isLowPower(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const smallScreen = window.matchMedia("(max-width: 767px)").matches;
  const fewCores = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  return smallScreen || fewCores || lowMemory;
}
