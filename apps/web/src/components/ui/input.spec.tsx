import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "./input";

describe("Input", () => {
  it("renders a text input by default with data-slot and base classes", () => {
    render(<Input placeholder="Type here" />);

    const input = screen.getByRole("textbox", { name: "" });
    expect(input).toBeInTheDocument();

    expect(input).toHaveAttribute("data-slot", "input");

    const cls = input.getAttribute("class") || "";
    expect(cls).toContain("w-full");
    expect(cls).toContain("rounded-[4px]");
    expect(cls).toContain("h-[52px]");

    expect(input).toHaveAttribute("placeholder", "Type here");
  });

  it("merges className and resolves Tailwind conflicts (user overrides height)", () => {
    render(<Input className="h-10 mt-2" placeholder="conflict" />);
    const input = screen.getByPlaceholderText("conflict");

    const cls = input.getAttribute("class") || "";
    expect(cls).toContain("h-10");
    expect(cls).not.toContain("h-[52px]");
    expect(cls).toContain("mt-2");
  });

  it("passes through common props: value/onChange/disabled/type", () => {
    const onChange = jest.fn();

    render(<Input placeholder="props" onChange={onChange} />);
    const input = screen.getByPlaceholderText("props") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Milk" } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input.value).toBe("Milk");

    render(<Input placeholder="disabled" disabled />);
    const disabledInput = screen.getByPlaceholderText("disabled");
    expect(disabledInput).toBeDisabled();
  });

  it("supports type override (number → role=spinbutton)", () => {
    render(<Input type="number" aria-label="qty" />);
    expect(screen.getByRole("spinbutton", { name: "qty" })).toBeInTheDocument();
  });

  it("forwards ref to the underlying <input>", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="ref-input" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);

    ref.current?.focus();
    expect(document.activeElement).toBe(ref.current);
  });
});
