import "@testing-library/jest-dom";
import type { ItemDTO } from "@app/shared";
import { render, screen, fireEvent, within } from "@testing-library/react";
import ItemsList from "./";

function makeItem(overrides: Partial<ItemDTO> = {}): ItemDTO {
  return {
    id: Math.random().toString(36).slice(2),
    itemName: "Milk",
    description: "2%",
    quantity: 1,
    purchased: false,
    ...overrides,
  };
}

describe("ItemsList", () => {
  it("renders an ItemsHeader with itemsLength and shows each item row", () => {
    const items: ItemDTO[] = [makeItem({ itemName: "Apples" }), makeItem({ itemName: "Bananas" })];

    render(
      <ItemsList
        items={items}
        itemsHeaderProps={{ type: "completed" }}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onTogglePurchased={jest.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: /Completed Items \(2\)/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Apples")).toBeInTheDocument();
    expect(screen.getByText("Bananas")).toBeInTheDocument();
  });

  it("passes handlers to Item: clicking edit/delete calls with the correct id", () => {
    const items: ItemDTO[] = [
      makeItem({ id: "id-a", itemName: "Bread" }),
      makeItem({ id: "id-b", itemName: "Cheese" }),
    ];

    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <ItemsList
        items={items}
        itemsHeaderProps={{ type: "active", metaText: "0/2 Completed" }}
        onEdit={onEdit}
        onDelete={onDelete}
        onTogglePurchased={jest.fn()}
      />,
    );

    const editButtons = screen.getAllByRole("button", { name: /edit button/i });
    const deleteButtons = screen.getAllByRole("button", { name: /delete button/i });

    fireEvent.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith("id-a");

    fireEvent.click(deleteButtons[0]);
    expect(onDelete).toHaveBeenCalledWith("id-a");
  });

  it("toggling the checkbox calls onTogglePurchased(id, true)", () => {
    const item = makeItem({ id: "id-t", itemName: "Tomatoes", purchased: false });

    const onTogglePurchased = jest.fn();

    render(
      <ItemsList
        items={[item]}
        itemsHeaderProps={{ type: "active", metaText: "0/1 Completed" }}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onTogglePurchased={onTogglePurchased}
      />,
    );

    // The checkbox should have role="checkbox". Click it to check.
    const checkbox = screen.getByRole("checkbox", { name: /mark tomatoes as purchased/i });
    fireEvent.click(checkbox);

    expect(onTogglePurchased).toHaveBeenCalledWith("id-t", true);
  });

  it("active header shows metaText and Add Item button when provided via itemsHeaderProps", () => {
    const items: ItemDTO[] = [makeItem({ itemName: "Milk" })];
    const onDrawerOpen = jest.fn();

    render(
      <ItemsList
        items={items}
        itemsHeaderProps={{
          type: "active",
          metaText: "1/1 Completed",
          isCompleted: true,
          onDrawerOpen,
        }}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onTogglePurchased={jest.fn()}
      />,
    );

    const heading = screen.getByRole("heading", { level: 2, name: /your items/i });
    expect(heading).toBeInTheDocument();

    const meta = within(heading).getByText("1/1 Completed");
    expect(meta).toBeInTheDocument();
    expect(meta).toHaveClass("text-green-600");

    const addBtn = screen.getByRole("button", { name: /add item/i });
    expect(addBtn).toBeInTheDocument();
    fireEvent.click(addBtn);
    expect(onDrawerOpen).toHaveBeenCalledTimes(1);
  });
});
