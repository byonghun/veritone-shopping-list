import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";

import { Select } from "./select";
import { AMOUNT_LIMIT } from "../../constants/drawer";

function Harness({
  initialOpen = false,
  initialValue,
}: {
  initialOpen?: boolean;
  initialValue?: number | undefined;
}) {
  const [open, setOpen] = React.useState(initialOpen);
  const [value, setValue] = React.useState<number | undefined>(initialValue);

  return <Select open={open} onOpenChange={setOpen} value={value} onClick={(v) => setValue(v)} />;
}

function openSelect() {
  const btn = screen.getByRole("button", { name: /how many\?/i });
  fireEvent.click(btn);
  return btn;
}

describe("Select (custom)", () => {
  it("renders closed by default with accessible button and listbox", () => {
    render(<Harness />);

    const btn = screen.getByRole("button", { name: /how many\?/i });
    expect(btn).toHaveAttribute("aria-haspopup", "listbox");
    expect(btn).toHaveAttribute("aria-expanded", "false");

    const listbox = screen.getByRole("listbox", { hidden: true });
    expect(listbox).toHaveAttribute("aria-hidden", "true");
  });

  it("opens on button click: updates aria, rotates arrow, and shows all options (AMOUNT_LIMIT)", () => {
    render(<Harness />);

    const btn = openSelect();
    expect(btn).toHaveAttribute("aria-expanded", "true");

    const arrow = btn.querySelector("svg");
    expect(arrow?.className.baseVal || arrow?.className || "").toContain("rotate-180");

    const listbox = screen.getByRole("listbox", { hidden: true });
    expect(listbox).toHaveAttribute("aria-hidden", "false");

    const options = within(listbox).getAllByRole("option", { hidden: true });
    expect(options.length).toBe(AMOUNT_LIMIT);
    expect(options[0]).toHaveTextContent("1");
    expect(options[options.length - 1]).toHaveTextContent(String(AMOUNT_LIMIT));

    const classes = listbox.getAttribute("class") || "";
    expect(classes).toContain("pointer-events-auto");
    expect(classes).toContain("opacity-100");
  });

  it("selects an option and closes; button shows the selected value and primary text color", () => {
    render(<Harness />);

    const btn = openSelect();
    const listbox = screen.getByRole("listbox", { hidden: true });

    const targetVal = Math.min(3, AMOUNT_LIMIT);
    const opt = within(listbox).getByRole("option", { name: String(targetVal), hidden: true });

    fireEvent.pointerDown(opt);

    expect(btn).toHaveTextContent(String(targetVal));
    const btnCls = btn.getAttribute("class") || "";
    expect(btnCls).toContain("text-primaryFont");

    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(listbox).toHaveAttribute("aria-hidden", "true");
  });

  it("closes when clicking outside (document pointerdown)", () => {
    render(<Harness />);

    const btn = openSelect();
    const listbox = screen.getByRole("listbox", { hidden: true });
    expect(listbox).toHaveAttribute("aria-hidden", "false");

    fireEvent.pointerDown(document.body);

    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(listbox).toHaveAttribute("aria-hidden", "true");
  });

  it("closes on blur", () => {
    render(<Harness />);

    const btn = openSelect();
    const listbox = screen.getByRole("listbox", { hidden: true });
    expect(listbox).toHaveAttribute("aria-hidden", "false");

    fireEvent.blur(btn);

    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(listbox).toHaveAttribute("aria-hidden", "true");
  });

  it("toggles open/close on repeated button clicks", () => {
    render(<Harness />);

    const btn = openSelect();
    const listbox = screen.getByRole("listbox", { hidden: true });

    expect(listbox).toHaveAttribute("aria-hidden", "false");

    fireEvent.click(btn);

    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(listbox).toHaveAttribute("aria-hidden", "true");
  });

  it("marks the selected option with aria-selected=true when value matches", () => {
    render(<Harness initialOpen={true} initialValue={1} />);

    const listbox = screen.getByRole("listbox", { hidden: true });
    const selected = within(listbox).getByRole("option", { name: "1", hidden: true });
    expect(selected).toHaveAttribute("aria-selected", "true");

    if (AMOUNT_LIMIT > 1) {
      const other = within(listbox).getByRole("option", { name: "2", hidden: true });
      expect(other).toHaveAttribute("aria-selected", "false");
    }
  });
});
