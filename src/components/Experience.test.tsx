import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Experience from "./Experience";

describe("Experience", () => {
  it("renders the Career Tracks heading and first role", () => {
    render(<Experience />);
    expect(screen.getByRole("heading", { name: "Career Tracks" })).toBeInTheDocument();
    expect(screen.getByText("Java Engineer")).toBeInTheDocument();
  });
});
