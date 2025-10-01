import { render, screen, fireEvent } from "@testing-library/react";
import Item from "../Item";

jest.mock("../ui/checkbox", () => ({
  __esModule: true,
  Checkbox: (props: any) => (
    <input
      type="checkbox"
      data-testid="item-checkbox"
      aria-label={props["aria-label"]}
      checked={!!props.checked}
      onChange={(e) => props.onCheckedChange?.((e.target as HTMLInputElement).checked)}
    />
  ),
}));

jest.mock("../Icons/EditIcon", () => ({
  __esModule: true,
  default: () => <span data-testid="edit-icon" />,
}));
jest.mock("../Icons/TrashIcon", () => ({
  __esModule: true,
  default: () => <span data-testid="trash-icon" />,
}));

const baseProps = {
  id: "id-1",
  itemName: "Milk",
  purchased: false,
  quantity: 1,
  onTogglePurchased: jest.fn(),
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe("Item", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders item name without quantity prefix when quantity is 1/undefined", () => {
    render(<Item {...baseProps} />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading.textContent?.trim()).toBe("Milk");
    expect(screen.getByLabelText("Mark Milk as purchased")).toBeInTheDocument();
  });

  it("renders quantity prefix when quantity > 1", () => {
    render(<Item {...baseProps} quantity={3} />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading.textContent?.trim()).toBe("3x Milk");
  });

  it("renders description only when provided", () => {
    const { rerender } = render(<Item {...baseProps} description="Organic whole milk" />);
    expect(screen.getByText("Organic whole milk")).toBeInTheDocument();

    rerender(<Item {...baseProps} description={undefined} />);
    expect(screen.queryByText("Organic whole milk")).toBeNull();
  });

  it("applies purchased styles when purchased=true", () => {
    render(<Item {...baseProps} purchased={true} description="tasty" />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveClass("line-through");
    expect(heading).toHaveClass("text-brand");
    expect(screen.getByText("tasty")).toHaveClass("line-through");

    const checkbox = screen.getByTestId("item-checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it("calls onTogglePurchased with the toggled state", () => {
    const onTogglePurchased = jest.fn();
    render(<Item {...baseProps} purchased={false} onTogglePurchased={onTogglePurchased} />);

    const checkbox = screen.getByTestId("item-checkbox");
    fireEvent.click(checkbox); // our mock will send next checked = true

    expect(onTogglePurchased).toHaveBeenCalledTimes(1);
    expect(onTogglePurchased).toHaveBeenCalledWith("id-1", true);
  });

  it("calls onEdit and onDelete with the item id", () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(<Item {...baseProps} onEdit={onEdit} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole("button", { name: "Edit button" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete button" }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith("id-1");
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith("id-1");
  });
});
