import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { CommandPalette } from "./CommandPalette";

// jsdom does not implement ResizeObserver, but the underlying `cmdk` library
// (used by the shadcn Command primitive) requires it to measure list items.
// This polyfill is scoped to this test file since src/test/setup.ts is out
// of scope for this task.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
  // jsdom also does not implement scrollIntoView, which cmdk calls when
  // moving selection between items.
  Element.prototype.scrollIntoView = () => {};
});

function renderPalette() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <CommandPalette />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe("CommandPalette", () => {
  beforeEach(() => {
    document.documentElement.className = "";
    // jsdom does not implement window.scrollTo; stub it so we can assert
    // on calls (the "Home" item scrolls to the top instead of jumping to
    // a nonexistent element id — see CommandPalette.tsx's jumpToSection).
    window.scrollTo = vi.fn();
  });

  it("opens on Cmd+K", async () => {
    renderPalette();
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(await screen.findByPlaceholderText(/jump to a section/i)).toBeInTheDocument();
  });

  it("filters items as the user types", async () => {
    renderPalette();
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    const input = await screen.findByPlaceholderText(/jump to a section/i);
    fireEvent.change(input, { target: { value: "Tracely" } });
    expect(await screen.findByText("Tracely")).toBeInTheDocument();
    expect(screen.queryByText("SunDog")).not.toBeInTheDocument();
  });

  it("closes the dialog after selecting an item", async () => {
    renderPalette();
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    const item = await screen.findByText("About");
    fireEvent.click(item);
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/jump to a section/i)).not.toBeInTheDocument();
    });
  });

  it("scrolls to the top of the page when Home is selected", async () => {
    renderPalette();
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    const item = await screen.findByText("Home");
    fireEvent.click(item);
    await waitFor(() => {
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });
  });
});
