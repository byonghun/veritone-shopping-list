import { render } from "@testing-library/react";
import ArrowIcon from "./ArrowIcon";

describe("ArrowIcon", () => {
  it("renders an SVG with default attributes and path fill", () => {
    const { container } = render(<ArrowIcon />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg).toBeTruthy();

    expect(svg.getAttribute("width")).toBe("10");
    expect(svg.getAttribute("height")).toBe("5");
    expect(svg.getAttribute("viewBox")).toBe("0 0 10 5");
    expect(svg.getAttribute("fill")).toBe("none");

    expect(svg.classList.length).toBe(0);

    const path = svg.querySelector("path") as SVGPathElement;
    expect(path).toBeTruthy();
    expect(path.getAttribute("d")).toBe("M0 0L5 5L10 0H0Z");
    expect(path.getAttribute("fill")).toBe("#555F7C");
  });

  it("applies custom width/height/fill/fillColor and className", () => {
    const { container } = render(
      <ArrowIcon
        width="20"
        height="10"
        fill="currentColor"
        fillColor="#ff0000"
        className="icon-large"
      />
    );

    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.getAttribute("height")).toBe("10");
    expect(svg.getAttribute("fill")).toBe("currentColor");
    expect(svg.classList.contains("icon-large")).toBe(true);

    const path = svg.querySelector("path") as SVGPathElement;
    expect(path.getAttribute("fill")).toBe("#ff0000");
  });
});
