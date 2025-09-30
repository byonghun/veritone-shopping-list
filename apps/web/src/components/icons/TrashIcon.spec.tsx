import { render } from "@testing-library/react";
import TrashIcon from "./TrashIcon";

describe("TrashIcon", () => {
  it("renders an SVG with default attributes and path fill", () => {
    const { container } = render(<TrashIcon />);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg).toBeInTheDocument();

    expect(svg.getAttribute("width")).toBe("14");
    expect(svg.getAttribute("height")).toBe("18");
    expect(svg.getAttribute("viewBox")).toBe("0 0 14 18");
    expect(svg.getAttribute("fill")).toBe("none");
    expect(svg.classList.length).toBe(0);

    const path = svg.querySelector("path") as SVGPathElement;
    expect(path).toBeInTheDocument();
    expect(path.getAttribute("d")).toBe(
      "M11 6V16H3V6H11ZM9.5 0H4.5L3.5 1H0V3H14V1H10.5L9.5 0ZM13 4H1V16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4Z"
    );
    expect(path.getAttribute("fill")).toBe("#555F7C");
  });

  it("applies custom width/height/fill/fillColor and className", () => {
    const { container } = render(
      <TrashIcon
        width="20"
        height="24"
        fill="currentColor"
        fillColor="#ff0000"
        className="icon-xl"
      />
    );

    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.getAttribute("width")).toBe("20");
    expect(svg.getAttribute("height")).toBe("24");
    expect(svg.getAttribute("fill")).toBe("currentColor");
    expect(svg.classList.contains("icon-xl")).toBe(true);

    const path = svg.querySelector("path") as SVGPathElement;
    expect(path.getAttribute("fill")).toBe("#ff0000");
  });
});
