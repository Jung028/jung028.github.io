import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { CustomCursor } from "./CustomCursor";

function mockPointer(coarse: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: coarse,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

describe("CustomCursor", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders nothing on coarse (touch) pointers", () => {
    mockPointer(true);
    const { container } = render(<CustomCursor />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the cursor dot and ring on fine (mouse) pointers", () => {
    mockPointer(false);
    const { container } = render(<CustomCursor />);
    expect(container.querySelectorAll("div").length).toBe(2);
  });
});
