import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders a <textarea> with data-slot and base classes", () => {
    render(<Textarea aria-label="Notes" />);

    const ta = screen.getByRole("textbox", { name: "Notes" });
    expect(ta).toBeInTheDocument();
    expect(ta.tagName).toBe("TEXTAREA");
    expect(ta).toHaveAttribute("data-slot", "textarea");

    const cls = ta.getAttribute("class") || "";
    expect(cls).toContain("w-full");
    expect(cls).toContain("rounded-[4px]");
    expect(cls).toContain("h-[140px]");
  });

  it("merges className and resolves Tailwind conflicts (user class wins)", () => {
    render(<Textarea aria-label="Conf" className="h-24 mt-2" />);

    const ta = screen.getByRole("textbox", { name: "Conf" });
    const cls = ta.getAttribute("class") || "";

    expect(cls).toContain("h-24");
    expect(cls).not.toContain("h-[140px]");
    expect(cls).toContain("mt-2");
  });

  it("passes through props: value/onChange/disabled/rows/placeholder", () => {
    const onChange = jest.fn();

    render(
      <Textarea aria-label="Props" placeholder="Add notes" rows={6} disabled onChange={onChange} />,
    );

    const ta = screen.getByPlaceholderText("Add notes") as HTMLTextAreaElement;

    expect(ta).toBeDisabled();
    expect(ta).toHaveAttribute("rows", "6");

    fireEvent.change(ta, { target: { value: "Milk, Eggs" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(ta.value).toBe("Milk, Eggs");
  });

  it("forwards ref to the underlying <textarea> and allows focus()", () => {
    const ref = React.createRef<HTMLTextAreaElement>();

    render(<Textarea ref={ref} aria-label="RefTA" />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);

    ref.current?.focus();
    expect(document.activeElement).toBe(ref.current);
  });
});
