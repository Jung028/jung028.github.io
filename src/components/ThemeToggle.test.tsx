import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "./ThemeToggle";

function renderWithTheme() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    localStorage.clear();
  });

  it("shows the 'switch to light' label by default (dark theme)", () => {
    renderWithTheme();
    expect(screen.getByLabelText("Switch to light theme")).toBeInTheDocument();
  });

  it("toggles to light theme on click and removes the dark class from <html>", async () => {
    renderWithTheme();
    fireEvent.click(screen.getByLabelText("Switch to light theme"));
    expect(await screen.findByLabelText("Switch to dark theme")).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists the choice to localStorage", () => {
    renderWithTheme();
    fireEvent.click(screen.getByLabelText("Switch to light theme"));
    expect(localStorage.getItem("theme")).toBe("light");
  });
});
