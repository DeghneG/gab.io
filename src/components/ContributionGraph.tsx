import { getGitHubContributions, type ContributionCalendarData } from "@/lib/github-contributions";
import ContributionGraphClient from "@/components/ContributionGraphClient";

/**
 * Generates realistic deterministic contribution data for local development preview
 * when GITHUB_TOKEN has not been added to .env.local yet.
 */
function getDevPreviewData(): ContributionCalendarData {
  const weeks = [];
  const now = new Date();
  const totalDays = 53 * 7;
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - totalDays + (6 - now.getDay()));

  let totalContributions = 0;
  for (let w = 0; w < 53; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + w * 7 + d);
      const isPast = currentDate <= now;
      const isWeekend = d === 0 || d === 6;

      let count = 0;
      if (isPast) {
        // Pseudo-random deterministic distribution based on date hash
        const seed = (w * 7 + d + 42) * 12.9898;
        const rand = Math.abs(Math.sin(seed) * 43758.5453) % 1;
        if (rand > 0.4) {
          count = Math.floor(rand * (isWeekend ? 5 : 9));
        }
      }
      totalContributions += count;
      days.push({
        date: currentDate.toISOString().split("T")[0],
        contributionCount: count,
        weekday: d,
      });
    }
    weeks.push({ contributionDays: days });
  }

  return { totalContributions, weeks };
}

/**
 * Server component that renders the GitHub Contributions section below Experience.
 * - Fetches real GraphQL calendar data if GITHUB_TOKEN is present.
 * - In development without a token: displays a preview so the design can be inspected.
 * - In production without a token: returns null.
 */
export default async function ContributionGraph() {
  const liveData = await getGitHubContributions();
  const isDev = process.env.NODE_ENV === "development";

  // If live fetch returned nothing
  if (!liveData) {
    if (!isDev) {
      // Production: clean fallback
      return null;
    }
  }

  const data = liveData || getDevPreviewData();
  const isPreview = !liveData && isDev;

  return (
    <section
      id="github-contributions"
      aria-label="GitHub Contributions"
      className="relative z-30 mx-auto max-w-6xl w-full px-6 md:px-8 py-10 md:py-16"
    >
      <div className="w-full bg-cream border-4 border-wine rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_0_#8C0027] text-wine">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-6">
          <div>
            <h2
              className="text-3xl md:text-5xl text-wine leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              GitHub Contributions
            </h2>
            <p
              className="text-base md:text-lg text-wine/80 mt-1"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {data.totalContributions.toLocaleString()} contributions in the last year
            </p>
          </div>

          {isPreview && (
            <span
              className="self-start sm:self-auto text-[10px] md:text-xs px-2.5 py-1 rounded-full border border-wine/30 bg-mustard/20 text-wine/80 font-mono"
              title="Add GITHUB_TOKEN to .env.local to load live GitHub data"
            >
              Preview Mode (add GITHUB_TOKEN for live)
            </span>
          )}
        </div>

        {/* Animated Heatmap Grid */}
        <ContributionGraphClient data={data} />
      </div>
    </section>
  );
}
