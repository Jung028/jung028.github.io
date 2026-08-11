import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LittleAboutMe from "./LittleAboutMe";

describe("LittleAboutMe", () => {
  it("renders the section heading and fact cards", () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    render(<LittleAboutMe />);
    expect(screen.getByRole("heading", { name: "Little about me" })).toBeInTheDocument();
    expect(screen.getAllByText("Ant International").length).toBeGreaterThan(0);
  });
});
