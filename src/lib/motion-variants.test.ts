import { describe, it, expect } from "vitest";
import { fadeInUp, staggerContainer } from "./motion-variants";

describe("motion-variants", () => {
  it("fadeInUp defines hidden and visible states", () => {
    expect(fadeInUp.hidden).toEqual({ opacity: 0, y: 24 });
    expect(fadeInUp.visible).toMatchObject({ opacity: 1, y: 0 });
  });

  it("staggerContainer staggers its children", () => {
    expect(staggerContainer.visible).toMatchObject({
      transition: { staggerChildren: 0.08 },
    });
  });
});
