import { render } from "@testing-library/react";
import EditIcon from "./EditIcon";

describe("EditIcon", () => {
  it("renders an SVG with default attributes and path fill", () => {
    const { container } = render(<EditIcon />);
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
      "M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM5.92 19H5V18.08L14.06 9.02L14.98 9.94L5.92 19ZM20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3C17.4 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63Z",
    );
    expect(path.getAttribute("fill")).toBe("#555F7C");
  });

  it("applies custom width/height/fill/fillColor and className", () => {
    const { container } = render(
      <EditIcon
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
