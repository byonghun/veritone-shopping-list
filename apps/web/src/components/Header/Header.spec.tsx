import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router";
import { ROUTES } from "../../constants/routes";

jest.mock("react-router", () => {
  const actual = jest.requireActual("react-router");
  return {
    ...actual,
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
  };
});

import Header from "../Header";

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders CTA button with correct label and aria-label", () => {
    (useNavigate as unknown as jest.Mock).mockReturnValue(
      jest.fn()
    );
    (useLocation as unknown as jest.Mock).mockReturnValue({
      pathname: "/items",
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const btn = screen.getByRole("button", { name: "Home button" }); // matches aria-label
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent("Shopping List");
  });

  it("navigates to ROUTES.home when clicked and not already on home", () => {
    const navigateSpy = jest.fn();
    (useNavigate as unknown as jest.Mock).mockReturnValue(
      navigateSpy
    );
    (useLocation as unknown as jest.Mock).mockReturnValue({
      pathname: "/items",
    });

    render(
      <MemoryRouter initialEntries={["/items"]}>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Home button" }));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(ROUTES.home);
  });

  it("does not navigate when already on home", () => {
    const navigateSpy = jest.fn();
    (useNavigate as unknown as jest.Mock).mockReturnValue(
      navigateSpy
    );
    (useLocation as unknown as jest.Mock).mockReturnValue({
      pathname: ROUTES.home,
    });

    render(
      <MemoryRouter initialEntries={[ROUTES.home]}>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Home button" }));

    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
