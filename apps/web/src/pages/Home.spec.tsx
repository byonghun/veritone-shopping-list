import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";

jest.mock("../components/ui/button", () => ({
  __esModule: true,
  Button: (props: any) => <button {...props} />,
}));

jest.mock("react-router", () => {
  const actual = jest.requireActual("react-router");
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

import HomePage from "./Home";

describe("HomePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the home text and CTA button", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(document.getElementById("home-page")).toBeInTheDocument();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lets start your list" })).toBeInTheDocument();
  });

  it("navigates to /items when the button is clicked", () => {
    const navigateSpy = jest.fn();
    (useNavigate as unknown as jest.Mock).mockReturnValue(navigateSpy);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <HomePage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Lets start your list" }));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith("/items");
  });
});
