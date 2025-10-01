import { render } from "@testing-library/react";
import HideIcon from "./HideIcon";

describe("HideIcon", () => {
  it("renders an SVG with default attributes and path fill", () => {
    const { container } = render(<HideIcon />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg).toBeInTheDocument();

    expect(svg.getAttribute("width")).toBe("24");
    expect(svg.getAttribute("height")).toBe("24");
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg.getAttribute("fill")).toBe("none");
    expect(svg.classList.length).toBe(0);

    const path = svg.querySelector("path") as SVGPathElement;
    expect(path).toBeInTheDocument();
    expect(path.getAttribute("d")).toBe(
      "M5.59 7.41L10.18 12L5.59 16.59L7 18L13 12L7 6L5.59 7.41ZM16 6H18V18H16V6Z",
    );
    expect(path.getAttribute("fill")).toBe("#555F7C");
  });

  it("applies custom width/height/fill/fillColor and className", () => {
    const { container } = render(
      <HideIcon
        width="32"
        height="32"
        fill="currentColor"
        fillColor="#ff0000"
        className="icon-lg"
      />,
    );

    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.getAttribute("width")).toBe("32");
    expect(svg.getAttribute("height")).toBe("32");
    expect(svg.getAttribute("fill")).toBe("currentColor");
    expect(svg.classList.contains("icon-lg")).toBe(true);

    const path = svg.querySelector("path") as SVGPathElement;
    expect(path.getAttribute("fill")).toBe("#ff0000");
  });
});
