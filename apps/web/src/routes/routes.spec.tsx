import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import AppRoutes from "./index";

jest.mock("../pages/Home", () => ({
  __esModule: true,
  default: () => <div data-testid="home-page">Home Page</div>,
}));
jest.mock("../pages/Items", () => ({
  __esModule: true,
  default: () => <div data-testid="items-page">Items Page</div>,
}));
jest.mock("../pages/NotFound", () => ({
  __esModule: true,
  default: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

describe("AppRoutes", () => {
  it("renders HomePage at /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.queryByTestId("items-page")).toBeNull();
    expect(screen.queryByTestId("not-found-page")).toBeNull();
  });

  it("renders ItemsPage at /items", () => {
    render(
      <MemoryRouter initialEntries={["/items"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("items-page")).toBeInTheDocument();
    expect(screen.queryByTestId("home-page")).toBeNull();
    expect(screen.queryByTestId("not-found-page")).toBeNull();
  });

  it("renders NotFoundPage at /404", () => {
    render(
      <MemoryRouter initialEntries={["/404"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
  });

  it("redirects unknown paths to /404 (renders NotFoundPage)", () => {
    render(
      <MemoryRouter initialEntries={["/does-not-exist"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
  });
});
