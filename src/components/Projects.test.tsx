import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Projects from "./Projects";

describe("Projects", () => {
  it("renders the Projects heading and project cards", () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByText("AI-Powered Payment Platform")).toBeInTheDocument();
  });
});
