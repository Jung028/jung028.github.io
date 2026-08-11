import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import * as githubStatsHook from "@/hooks/useGithubStats";
import { GithubStatsCard } from "./GithubStatsCard";

describe("GithubStatsCard", () => {
  it("renders live stats on success", () => {
    vi.spyOn(githubStatsHook, "useGithubStats").mockReturnValue({
      status: "success",
      data: {
        user: { public_repos: 12, followers: 3, html_url: "https://github.com/Jung028" },
        repos: [
          {
            name: "tracely",
            html_url: "https://github.com/Jung028/tracely",
            description: null,
            stargazers_count: 1,
            pushed_at: "2026-01-01",
          },
        ],
      },
    });
    render(<GithubStatsCard />);
    expect(screen.getByText(/12 repos/)).toBeInTheDocument();
    expect(screen.getByText("tracely")).toBeInTheDocument();
  });

  it("renders a static fallback on error", () => {
    vi.spyOn(githubStatsHook, "useGithubStats").mockReturnValue({ status: "error", data: null });
    render(<GithubStatsCard />);
    expect(screen.getByText("View GitHub profile")).toBeInTheDocument();
  });
});
