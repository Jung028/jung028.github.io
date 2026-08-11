import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useGithubStats } from "./useGithubStats";

const mockUser = { public_repos: 12, followers: 3, html_url: "https://github.com/Jung028" };
const mockRepos = [
  {
    name: "tracely",
    html_url: "https://github.com/Jung028/tracely",
    description: "Agentic incident response",
    stargazers_count: 1,
    pushed_at: "2026-01-01",
  },
];

function mockFetchSuccess() {
  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => mockUser })
    .mockResolvedValueOnce({ ok: true, json: async () => mockRepos });
}

describe("useGithubStats", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts in loading state", () => {
    mockFetchSuccess();
    const { result } = renderHook(() => useGithubStats());
    expect(result.current.status).toBe("loading");
  });

  it("transitions to success with user and repo data", async () => {
    mockFetchSuccess();
    const { result } = renderHook(() => useGithubStats());
    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.data?.user.public_repos).toBe(12);
    expect(result.current.data?.repos[0].name).toBe("tracely");
  });

  it("transitions to error when the GitHub API responds with a non-2xx status", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    const { result } = renderHook(() => useGithubStats());
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.data).toBeNull();
  });

  it("transitions to error on network failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => useGithubStats());
    await waitFor(() => expect(result.current.status).toBe("error"));
  });
});
