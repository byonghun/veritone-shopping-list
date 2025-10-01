import { render, screen, fireEvent } from "@testing-library/react";
import ErrorCard from "../ErrorCard";

describe("ErrorCard", () => {
  it("renders the static heading, error message, and CTA button", () => {
    render(<ErrorCard errorMessage="Network timeout" onClick={() => {}} />);

    expect(screen.getByText("Failed to load items.")).toBeInTheDocument();
    expect(screen.getByText("Network timeout")).toBeInTheDocument();

    const btn = screen.getByRole("button", { name: "Try again" });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute("type", "button");
  });

  it("calls onClick when the button is pressed", () => {
    const onClick = jest.fn();
    render(<ErrorCard errorMessage="Boom" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
