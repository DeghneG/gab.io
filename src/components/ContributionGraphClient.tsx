"use client";

import { useRef, useEffect, useMemo } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ContributionCalendarData } from "@/lib/github-contributions";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ContributionGraphClientProps {
  data: ContributionCalendarData;
}

const PALETTE = {
  level0: "#94C3A3", // #A1D4B1 darkened ~8% (mint tinted)
  level1: "#5CCBB3", // light teal
  level2: "#2BAF90", // retro teal
  level3: "#F1A512", // retro mustard
  level4: "#DD4111", // retro orange
};

function getCellColor(count: number, maxCount: number): string {
  if (count <= 0) return PALETTE.level0;
  const ratio = count / Math.max(maxCount, 1);
  if (ratio <= 0.25) return PALETTE.level1;
  if (ratio <= 0.5) return PALETTE.level2;
  if (ratio <= 0.75) return PALETTE.level3;
  return PALETTE.level4;
}

export default function ContributionGraphClient({ data }: ContributionGraphClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the rightmost (most recent) column on narrow screens
  useEffect(() => {
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.scrollLeft = scrollWrapperRef.current.scrollWidth;
    }
  }, []);

  // Compute maximum contribution count for relative color scaling
  const maxCount = useMemo(() => {
    let max = 1;
    data.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        if (day.contributionCount > max) {
          max = day.contributionCount;
        }
      });
    });
    return max;
  }, [data]);

  // Extract month labels positioned above starting week columns
  const monthLabels = useMemo(() => {
    const labels: { index: number; label: string }[] = [];
    let lastMonth = -1;

    data.weeks.forEach((week, i) => {
      const firstDay = week.contributionDays[0];
      if (firstDay) {
        const d = new Date(firstDay.date);
        const month = d.getUTCMonth();
        // Place month label when month changes and isn't cramped
        if (month !== lastMonth && (i === 0 || i - (labels[labels.length - 1]?.index ?? -10) >= 3)) {
          labels.push({
            index: i,
            label: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
          });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [data]);

  // Entrance motion: fade in column by column when scrolled into view
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced || !containerRef.current) return;

      const columns = containerRef.current.querySelectorAll(".contrib-col");
      if (!columns.length) return;

      gsap.fromTo(
        columns,
        { opacity: 0, y: 6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          stagger: 0.01, // 0.01s * 53 cols = ~0.53s total
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full">
      {/* Scrollable grid container (never makes page scroll sideways) */}
      <div
        ref={scrollWrapperRef}
        className="overflow-x-auto pb-2 pt-1 -mx-2 px-2 scrollbar-thin"
        tabIndex={0}
        aria-label="Scrollable contributions calendar"
      >
        <div className="inline-flex flex-col min-w-max">
          {/* Month labels header */}
          <div className="flex text-xs text-wine pl-0 md:pl-8 mb-1.5 select-none" style={{ fontFamily: "var(--font-body)" }}>
            <div className="flex gap-1">
              {data.weeks.map((_, weekIdx) => {
                const labelObj = monthLabels.find((m) => m.index === weekIdx);
                return (
                  <div
                    key={`m-${weekIdx}`}
                    className="w-[9px] sm:w-[11px] md:w-[12px] h-4 relative text-[10px] md:text-xs font-semibold leading-none"
                  >
                    {labelObj && (
                      <span className="absolute left-0 top-0 whitespace-nowrap">
                        {labelObj.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Grid: Weekday labels on left (desktop) + 53 Columns */}
          <div
            className="flex items-start gap-2"
            role="img"
            aria-label={`GitHub contribution graph showing ${data.totalContributions} contributions in the last year`}
          >
            {/* Weekday labels (desktop only: Mon, Wed, Fri) */}
            <div
              className="hidden md:grid grid-rows-7 h-[108px] w-6 shrink-0 text-[10px] text-wine/80 font-bold select-none gap-1"
              style={{ fontFamily: "var(--font-body)" }}
              aria-hidden="true"
            >
              <div />
              <div className="flex items-center leading-none">Mon</div>
              <div />
              <div className="flex items-center leading-none">Wed</div>
              <div />
              <div className="flex items-center leading-none">Fri</div>
              <div />
            </div>

            {/* 53 Columns */}
            <div className="flex gap-1">
              {data.weeks.map((week, weekIdx) => {
                // Map days by weekday (0 = Sun, ..., 6 = Sat)
                const dayMap = new Map<number, (typeof week.contributionDays)[0]>();
                week.contributionDays.forEach((d) => dayMap.set(d.weekday, d));

                return (
                  <div
                    key={`col-${weekIdx}`}
                    className="contrib-col flex flex-col gap-1 will-change-transform"
                    aria-hidden="true"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((weekday) => {
                      const day = dayMap.get(weekday);
                      if (!day) {
                        return (
                          <div
                            key={`empty-${weekIdx}-${weekday}`}
                            className="w-[9px] h-[9px] sm:w-[11px] sm:h-[11px] md:w-[12px] md:h-[12px] opacity-0 pointer-events-none"
                          />
                        );
                      }

                      const dateObj = new Date(day.date);
                      const formattedDate = dateObj.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      });

                      const tooltip = `${day.contributionCount} contribution${
                        day.contributionCount === 1 ? "" : "s"
                      } on ${formattedDate}`;

                      const color = getCellColor(day.contributionCount, maxCount);

                      return (
                        <div
                          key={day.date}
                          title={tooltip}
                          className="w-[9px] h-[9px] sm:w-[11px] sm:h-[11px] md:w-[12px] md:h-[12px] rounded-[2px] transition-transform hover:scale-125 cursor-pointer shadow-[0_1px_1px_rgba(0,0,0,0.12)] border border-wine/10"
                          style={{ backgroundColor: color }}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend in bottom-right */}
      <div
        className="flex items-center justify-end gap-2 mt-4 text-xs text-wine select-none"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <span className="opacity-80">Less</span>
        <div className="flex items-center gap-1">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] border border-wine/10"
            style={{ backgroundColor: PALETTE.level0 }}
            title="0 contributions"
          />
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] border border-wine/10"
            style={{ backgroundColor: PALETTE.level1 }}
            title="Low contributions"
          />
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] border border-wine/10"
            style={{ backgroundColor: PALETTE.level2 }}
            title="Medium contributions"
          />
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] border border-wine/10"
            style={{ backgroundColor: PALETTE.level3 }}
            title="High contributions"
          />
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[2px] border border-wine/10"
            style={{ backgroundColor: PALETTE.level4 }}
            title="Highest contributions"
          />
        </div>
        <span className="opacity-80">More</span>
      </div>
    </div>
  );
}
