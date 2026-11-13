"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * The tour, the scroll-progress dots and the chatbot are not needed for the first paint, so they
 * load as separate chunks once the browser is idle. This keeps the initial load fast on phones.
 */
const SiteTour = dynamic(() => import("@/components/SiteTour"), { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), { ssr: false });
const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });

export default function LazyExtras() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setReady(true), { timeout: 3500 });
    else timeoutId = setTimeout(() => setReady(true), 2000);
    return () => {
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;
  return (
    <>
      <SiteTour />
      <ScrollProgress />
      <Chatbot />
    </>
  );
}
