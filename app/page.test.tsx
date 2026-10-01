import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("EventHub home page", () => {
  it("renders a main heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
      }),
    ).toBeInTheDocument();
  });
});

