import { render, screen } from "@testing-library/react";
import LoadingIndicator from "../LoadingIndicator";

describe("LoadingIndicator", () => {
  it("renders with role=status and the accessible label", () => {
    render(<LoadingIndicator />);

    const el = screen.getByRole("status", { name: "Loading Indicator" });
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("animate-spin");
    expect(el).toHaveClass("rounded-full");
  });

  it("merges className and resolves Tailwind conflicts in favor of the provided className", () => {
    render(<LoadingIndicator className="mt-2" data-testid="loader" />);

    const el = screen.getByTestId("loader");
    expect(el.className).toContain("mt-2");
    expect(el.className).not.toContain("mt-[110px]");
  });

  it("forwards arbitrary DOM props", () => {
    render(<LoadingIndicator data-testid="loader" title="loading…" />);
    const el = screen.getByTestId("loader");
    expect(el).toHaveAttribute("title", "loading…");
  });
});
