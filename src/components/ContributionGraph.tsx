import { getGitHubContributions } from "@/lib/github-contributions";
import ContributionGraphClient from "@/components/ContributionGraphClient";
import GiantContributionSquares from "@/components/giant-contribution-squares";

/**
 * Server component that renders the GitHub Contributions section below Experience.
 * Fetches real calendar data from GitHub (GraphQL with GITHUB_TOKEN or public profile fallback).
 */
export default async function ContributionGraph() {
  const data = await getGitHubContributions();

  if (!data) {
    if (process.env.NODE_ENV === "development") {
      return (
        <section
          id="github-contributions"
          className="relative z-30 mx-auto max-w-6xl w-full px-6 md:px-8 py-8"
        >
          <div
            className="w-full p-4 rounded-xl border-2 border-dashed border-wine/30 text-center text-xs text-wine/60"
            style={{ fontFamily: "var(--font-body)" }}
          >
            GitHub Contributions unavailable
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section
      id="github-contributions"
      aria-label="GitHub Contributions"
      className="relative z-30 w-full px-6 md:px-8 pt-10 pb-2 md:pt-16 md:pb-3 overflow-x-clip"
    >
      {/* Giant Contribution Squares in margins (1024px+) */}
      <GiantContributionSquares />

      <div className="relative mx-auto max-w-6xl w-full">
        {/* Flat teal offset block behind the card */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-teal rounded-3xl translate-x-[10px] translate-y-[10px] md:translate-x-4 md:translate-y-4 pointer-events-none -z-10"
        />

        {/* The Card */}
        <div className="relative z-10 w-full bg-cream border-4 border-wine rounded-3xl p-6 md:p-8 shadow-[6px_6px_0_0_#8C0027] text-wine">
          {/* Header */}
          <div className="mb-6">
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

          {/* Animated Heatmap Grid */}
          <ContributionGraphClient data={data} />
        </div>
      </div>
    </section>
  );
}
