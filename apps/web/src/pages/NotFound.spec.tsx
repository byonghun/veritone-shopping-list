import { MemoryRouter, useNavigate } from "react-router";
import { render, screen, fireEvent } from "@testing-library/react";

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

import NotFoundPage from "./NotFound";

describe("NotFoundPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the not-found text and button", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(document.getElementById("not-found-page")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lets start your list" })).toBeInTheDocument();
  });

  it("navigates to /items when the button is clicked", () => {
    const navigateSpy = jest.fn();
    (useNavigate as unknown as jest.Mock).mockReturnValue(navigateSpy);

    render(
      <MemoryRouter initialEntries={["/random"]}>
        <NotFoundPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Lets start your list" }));

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith("/items");
  });
});
