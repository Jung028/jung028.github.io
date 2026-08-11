import { useEffect, useState } from "react";

export const GITHUB_USERNAME = "Jung028";

export type GithubUser = {
  public_repos: number;
  followers: number;
  html_url: string;
};

export type GithubRepo = {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  pushed_at: string;
};

export type GithubStats = {
  user: GithubUser;
  repos: GithubRepo[];
};

export type GithubStatsStatus = "loading" | "success" | "error";

export function useGithubStats(): { status: GithubStatsStatus; data: GithubStats | null } {
  const [status, setStatus] = useState<GithubStatsStatus>("loading");
  const [data, setData] = useState<GithubStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=5`),
        ]);

        if (!userRes.ok || !reposRes.ok) {
          throw new Error("GitHub API request failed");
        }

        const user = (await userRes.json()) as GithubUser;
        const repos = (await reposRes.json()) as GithubRepo[];

        if (!cancelled) {
          setData({ user, repos });
          setStatus("success");
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
        }
      }
    }

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, data };
}
