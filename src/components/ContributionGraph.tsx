import { getGitHubContributions } from "@/lib/github-contributions";
import ContributionGraphClient from "@/components/ContributionGraphClient";

/**
 * Server component that fetches GitHub contribution calendar data
 * and renders a retro-styled card.
 *
 * If data is unavailable:
 * - In development: renders a small discreet notice.
 * - In production: returns null (renders nothing).
 */
export default async function ContributionGraph() {
  const data = await getGitHubContributions();

  // If token is missing or API failed
  if (!data) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div
          className="w-full mt-16 p-4 rounded-xl border-2 border-dashed border-wine/30 text-center text-xs text-wine/60"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Contributions unavailable (add GITHUB_TOKEN to .env.local to preview)
        </div>
      );
    }
    return null;
  }

  return (
    <section
      aria-label="GitHub Contributions"
      className="w-full mt-16 bg-cream border-4 border-wine rounded-3xl p-6 shadow-[6px_6px_0_0_#8C0027] text-wine"
    >
      {/* Header */}
      <div className="mb-6">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl leading-tight text-wine"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Contributions
        </h2>
        <p
          className="text-sm md:text-base text-wine/80 mt-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {data.totalContributions.toLocaleString()} contributions in the last year
        </p>
      </div>

      {/* Animated Heatmap Grid */}
      <ContributionGraphClient data={data} />
    </section>
  );
}
