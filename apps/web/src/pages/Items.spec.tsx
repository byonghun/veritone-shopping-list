import { render, screen } from "@testing-library/react";

jest.mock("../containers/ItemsContainer", () => ({
  __esModule: true,
  default: () => <div data-testid="items-container">ItemsContainer</div>,
}));

import ItemsPage from "./Items";

describe("ItemsPage", () => {
  it("renders the page wrapper and the ItemsContainer", () => {
    render(<ItemsPage />);

    const wrapper = document.getElementById("items-page");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("page-wrapper", "md:mt-8");

    expect(screen.getByTestId("items-container")).toBeInTheDocument();
  });
});
