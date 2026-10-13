import { GITHUB_USERNAME } from "@/data/content";

export interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
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
            }
          }
        }
      }
    }
  }
`;

/**
 * Server-side function to fetch GitHub contributions using GraphQL API.
 * Uses Next.js fetch cache with 1-hour revalidation (3600s).
 * Safely returns null if token is missing or request fails.
 * Never logs or exposes GITHUB_TOKEN to the client.
 */
export async function getGitHubContributions(): Promise<ContributionCalendarData | null> {
  const token = process.env.GITHUB_TOKEN;

  // If token is missing, return null safely without throwing
  if (!token || token.trim() === "") {
    return null;
  }

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

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.errors || !data?.data?.user?.contributionsCollection?.contributionCalendar) {
      return null;
    }

    return data.data.user.contributionsCollection.contributionCalendar as ContributionCalendarData;
  } catch {
    // Fail silently without leaking token
    return null;
  }
}
