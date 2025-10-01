import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "./checkbox";

describe("Checkbox (Radix wrapper)", () => {
  it("renders with role=checkbox, data-slot, base classes, and data-state='unchecked' by default", () => {
    render(<Checkbox name="buy-milk" aria-label="Buy milk" />);

    const root = screen.getByRole("checkbox", { name: "Buy milk" });
    expect(root).toBeInTheDocument();
    expect(root).toHaveAttribute("data-slot", "checkbox");

    const cls = root.getAttribute("class") || "";
    expect(cls).toContain("rounded-[2px]");
    expect(cls).toContain("border-[2px]");

    expect(root).toHaveAttribute("aria-checked", "false");
    expect(root).toHaveAttribute("data-state", "unchecked");
  });

  it("merges custom className at the end", () => {
    render(<Checkbox className="mt-2" aria-label="c" />);
    const root = screen.getByRole("checkbox", { name: "c" });
    const classes = (root.getAttribute("class") || "").trim().split(/\s+/);
    expect(classes[classes.length - 1]).toBe("mt-2");
  });

  it("toggles checked state and calls onCheckedChange with the new value", () => {
    const onChange = jest.fn();
    render(<Checkbox aria-label="task" onCheckedChange={onChange} />);

    const root = screen.getByRole("checkbox", { name: "task" });

    expect(root).toHaveAttribute("aria-checked", "false");
    expect(root).toHaveAttribute("data-state", "unchecked");

    fireEvent.click(root);
    expect(onChange).toHaveBeenCalledTimes(1);
    // Radix CheckState is boolean | "indeterminate"; here should be true
    expect(onChange.mock.calls[0][0]).toBe(true);
    expect(root).toHaveAttribute("aria-checked", "true");
    expect(root).toHaveAttribute("data-state", "checked");

    fireEvent.click(root);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1][0]).toBe(false);
    expect(root).toHaveAttribute("aria-checked", "false");
    expect(root).toHaveAttribute("data-state", "unchecked");
  });
});
