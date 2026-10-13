import { GITHUB_USERNAME } from "@/data/content";

export interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
  level?: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendarData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              weekday
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

/**
 * Parses public GitHub contributions HTML fragment for GITHUB_USERNAME.
 * Used as fallback when GITHUB_TOKEN is not configured, providing 100% accurate
 * real activity without requiring authentication.
 */
async function fetchPublicGitHubContributions(): Promise<ContributionCalendarData | null> {
  try {
    const res = await fetch(`https://github.com/users/${GITHUB_USERNAME}/contributions`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!res.ok) return null;
    const html = await res.text();

    // Map tooltips by element ID to extract exact contribution counts
    const tooltips = new Map<string, number>();
    const ttRegex = /<tool-tip[^>]+for="([^"]+)"[^>]*>([^<]+)<\/tool-tip>/g;
    let tm;
    while ((tm = ttRegex.exec(html)) !== null) {
      const id = tm[1];
      const text = tm[2].trim();
      const countMatch = text.match(/^(\d+)\s+contribution/);
      tooltips.set(id, countMatch ? parseInt(countMatch[1], 10) : 0);
    }

    // Extract table day cells
    const tdRegex = /<td[^>]+data-date="([^"]+)"[^>]+id="([^"]+)"[^>]*data-level="([^"]+)"/g;
    let tdm;
    const days: ContributionDay[] = [];
    let calculatedTotal = 0;

    while ((tdm = tdRegex.exec(html)) !== null) {
      const date = tdm[1];
      const id = tdm[2];
      const level = parseInt(tdm[3], 10);
      const count = tooltips.get(id) || 0;
      calculatedTotal += count;
      days.push({
        date,
        contributionCount: count,
        weekday: new Date(date + "T00:00:00Z").getUTCDay(),
        level: isNaN(level) ? undefined : level,
      });
    }

    if (days.length === 0) return null;

    // Sort chronologically
    days.sort((a, b) => a.date.localeCompare(b.date));

    // Group into 53 standard Sunday-to-Saturday weeks
    const weeks: ContributionWeek[] = [];
    let currentWeek: ContributionDay[] = [];

    for (const day of days) {
      if (day.weekday === 0 && currentWeek.length > 0) {
        weeks.push({ contributionDays: currentWeek });
        currentWeek = [];
      }
      currentWeek.push(day);
    }
    if (currentWeek.length > 0) {
      weeks.push({ contributionDays: currentWeek });
    }

    // Check header for total, or use calculated total
    const totalMatch = html.match(/(\d+)\s+contributions\s+in\s+the\s+last\s+year/i);
    const totalContributions = totalMatch ? parseInt(totalMatch[1], 10) : calculatedTotal;

    return {
      totalContributions,
      weeks,
    };
  } catch {
    return null;
  }
}

/**
 * Server-side function to fetch GitHub contributions.
 * 1. If GITHUB_TOKEN is present: calls GitHub GraphQL API (supports private contributions).
 * 2. If token is missing: fetches and parses public GitHub profile contributions directly.
 * Cached with 1-hour revalidation (3600s).
 */
export async function getGitHubContributions(): Promise<ContributionCalendarData | null> {
  const token = process.env.GITHUB_TOKEN;

  // 1. If token is configured, use official GraphQL API
  if (token && token.trim() !== "") {
    try {
      const response = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          "Content-Type": "application/json",
          "User-Agent": "gab-io-portfolio",
        },
        body: JSON.stringify({
          query: CONTRIBUTIONS_QUERY,
          variables: { login: GITHUB_USERNAME },
        }),
        next: {
          revalidate: 3600,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const rawCalendar = data?.data?.user?.contributionsCollection?.contributionCalendar;
        if (!data.errors && rawCalendar) {
          const LEVEL_MAP: Record<string, number> = {
            NONE: 0,
            FIRST_QUARTILE: 1,
            SECOND_QUARTILE: 2,
            THIRD_QUARTILE: 3,
            FOURTH_QUARTILE: 4,
          };
          const weeks: ContributionWeek[] = rawCalendar.weeks.map(
            (w: {
              contributionDays: Array<{
                date: string;
                contributionCount: number;
                weekday: number;
                contributionLevel?: string;
              }>;
            }) => ({
              contributionDays: w.contributionDays.map((d) => ({
                date: d.date,
                contributionCount: d.contributionCount,
                weekday: d.weekday,
                level: d.contributionLevel ? LEVEL_MAP[d.contributionLevel] ?? 0 : undefined,
              })),
            })
          );

          return {
            totalContributions: rawCalendar.totalContributions,
            weeks,
          };
        }
      }
    } catch {
      // Fall through to public fetch
    }
  }

  // 2. Fallback to public profile contributions fetch
  return await fetchPublicGitHubContributions();
}
