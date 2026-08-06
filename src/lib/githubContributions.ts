import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export type ContributionDay = {
  color: string;
  contributionCount: number;
  date: string;
  weekday: number;
};

export type ContributionWeek = {
  contributionDays: ContributionDay[];
  firstDay: string;
};

export type ContributionCalendar = {
  colors: string[];
  totalContributions: number;
  weeks: ContributionWeek[];
};

export type GitHubContributionResult = {
  calendar: ContributionCalendar | null;
  fetchedAt: string | null;
  login: string | null;
  rateLimit: {
    cost: number;
    remaining: number;
    resetAt: string;
  } | null;
  status: "ready" | "missing-env" | "error";
  statusMessage: string;
};

type FetchOptions = {
  cacheSeconds?: number;
  login?: string;
  token?: string;
};

const query = `
  query ContributionCalendar($login: String!) {
    user(login: $login) {
      login
      contributionsCollection {
        contributionCalendar {
          colors
          totalContributions
          weeks {
            firstDay
            contributionDays {
              color
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
    rateLimit {
      cost
      remaining
      resetAt
    }
  }
`;

const cachePath = join(process.cwd(), ".astro", "cache", "github-contributions.json");

export async function getGitHubContributions({
  cacheSeconds = 1800,
  login,
  token
}: FetchOptions): Promise<GitHubContributionResult> {
  if (!login || !token) {
    return {
      calendar: null,
      fetchedAt: null,
      login: login ?? null,
      rateLimit: null,
      status: "missing-env",
      statusMessage: "Set GITHUB_LOGIN and GITHUB_TOKEN to render live contribution data."
    };
  }

  const cached = await readCachedResult(cacheSeconds, login);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        variables: { login }
      })
    });

    const payload = await response.json();

    if (!response.ok || payload.errors?.length) {
      const message = payload.errors?.[0]?.message ?? `GitHub returned ${response.status}.`;

      return {
        calendar: null,
        fetchedAt: new Date().toISOString(),
        login,
        rateLimit: null,
        status: "error",
        statusMessage: message
      };
    }

    const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar ?? null;
    const result: GitHubContributionResult = {
      calendar,
      fetchedAt: new Date().toISOString(),
      login: payload.data?.user?.login ?? login,
      rateLimit: payload.data?.rateLimit ?? null,
      status: calendar ? "ready" : "error",
      statusMessage: calendar ? "Live GitHub contribution data rendered at build time." : "No contribution calendar returned."
    };

    await writeCachedResult(result);

    return result;
  } catch (error) {
    return {
      calendar: null,
      fetchedAt: new Date().toISOString(),
      login,
      rateLimit: null,
      status: "error",
      statusMessage: error instanceof Error ? error.message : "GitHub contribution fetch failed."
    };
  }
}

async function readCachedResult(cacheSeconds: number, login: string): Promise<GitHubContributionResult | null> {
  if (import.meta.env.GITHUB_CONTRIBUTIONS_REFRESH === "1") {
    return null;
  }

  try {
    const raw = await readFile(cachePath, "utf8");
    const cached = JSON.parse(raw) as GitHubContributionResult;
    const fetchedAt = cached.fetchedAt ? new Date(cached.fetchedAt).getTime() : 0;
    const isFresh = Date.now() - fetchedAt < cacheSeconds * 1000;

    if (cached.login === login && isFresh) {
      return {
        ...cached,
        statusMessage: "Live GitHub contribution data rendered from local cache."
      };
    }
  } catch {
    return null;
  }

  return null;
}

async function writeCachedResult(result: GitHubContributionResult): Promise<void> {
  try {
    await mkdir(dirname(cachePath), { recursive: true });
    await writeFile(cachePath, JSON.stringify(result, null, 2));
  } catch {
    // Cache writes should never break a page build.
  }
}
