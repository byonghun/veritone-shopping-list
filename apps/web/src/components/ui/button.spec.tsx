import { render, screen, fireEvent } from "@testing-library/react";
import { Button, buttonVariants } from "./button";

describe("Button (shadcn + cva)", () => {
  it("renders a native <button> by default with data-slot and base classes", () => {
    render(<Button>Click me</Button>);

    const btn = screen.getByRole("button", { name: "Click me" });

    expect(btn.tagName).toBe("BUTTON");
    expect(btn).toHaveAttribute("data-slot", "button");

    const cls = btn.getAttribute("class") || "";
    expect(cls).toContain("inline-flex");
    expect(cls).toContain("items-center");
    expect(cls).toContain("rounded-[4px]");
    expect(cls).toContain("transition-colors");
    expect(cls).toContain("disabled:opacity-50");

    expect(cls).toContain("bg-buttonBlue");
    expect(cls).toContain("text-white");
    expect(cls).toContain("h-9");
  });

  it("merges user className at the end", () => {
    render(<Button className="mt-2">Styled</Button>);
    const btn = screen.getByRole("button", { name: "Styled" });
    const cls = btn.getAttribute("class") || "";
    expect(cls.split(" ").pop()).toBe("mt-2");
  });

  it("passes through props (onClick, type, disabled)", () => {
    const handleClick = jest.fn();
    render(
      <Button type="submit" disabled onClick={handleClick}>
        Submit
      </Button>,
    );

    const btn = screen.getByRole("button", { name: "Submit" });
    expect(btn).toHaveAttribute("type", "submit");
    expect(btn).toBeDisabled();

    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("supports asChild: renders anchor preserving classes and data-slot", () => {
    render(
      <Button asChild size="lg" variant="link">
        <a href="/x">Go</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Go" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/x");
    expect(link).toHaveAttribute("data-slot", "button");

    const cls = link.getAttribute("class") || "";
    expect(cls).toContain("underline-offset-4");
    expect(cls).toContain("h-10");
  });

  it.each([
    ["default", "bg-buttonBlue"],
    ["outline", "border"],
    ["secondary", "bg-secondary"],
    ["ghost", "hover:bg-accent"],
    ["link", "underline-offset-4"],
  ] as const)("applies variant=%s classes", (variant, expectedToken) => {
    render(
      <Button variant={variant} data-testid={`btn-${variant}`}>
        v
      </Button>,
    );
    const el = screen.getByTestId(`btn-${variant}`);
    expect(el.getAttribute("class") || "").toContain(expectedToken);
  });

  it.each([
    ["default", "h-9"],
    ["sm", "h-8"],
    ["lg", "h-10"],
    ["icon", "size-9"],
  ] as const)("applies size=%s classes", (size, expectedToken) => {
    render(
      <Button size={size} data-testid={`btn-${size}`}>
        s
      </Button>,
    );
    const el = screen.getByTestId(`btn-${size}`);
    expect(el.getAttribute("class") || "").toContain(expectedToken);
  });

  it("buttonVariants() composes classes for variant+size+className", () => {
    const cls = buttonVariants({
      variant: "outline",
      size: "sm",
      className: "mx-2",
    });
    expect(cls).toContain("border");
    expect(cls).toContain("h-8");
    expect(cls.endsWith("mx-2")).toBe(true);
  });
});
