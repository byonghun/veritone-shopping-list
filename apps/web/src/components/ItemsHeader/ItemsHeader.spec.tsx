import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ItemsHeader, { type ItemsHeaderProps } from "./";

function renderHeader(props: Partial<ItemsHeaderProps> = {}) {
  const onDrawerOpen = props.onDrawerOpen ?? jest.fn();
  const allProps: ItemsHeaderProps = {
    className: props.className,
    type: "active",
    metaText: props.metaText,
    isCompleted: props.isCompleted ?? false,
    itemsLength: props.itemsLength ?? 0,
    onDrawerOpen,
  };
  const utils = render(<ItemsHeader {...allProps} />);
  return { ...utils, onDrawerOpen, props: allProps };
}

describe("ItemsHeader", () => {
  it("renders active header with metaText and Add Item button; clicking calls onDrawerOpen", () => {
    const { onDrawerOpen } = renderHeader({
      type: "active",
      metaText: "2/5 Completed",
      isCompleted: false,
      itemsLength: 3,
      onDrawerOpen: jest.fn(),
    });

    expect(screen.getByRole("heading", { level: 2, name: /your items/i })).toBeInTheDocument();

    const meta = screen.getByText("2/5 Completed");
    expect(meta).toBeInTheDocument();
    expect(meta).not.toHaveClass("text-green-600");

    const btn = screen.getByRole("button", { name: /add item/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onDrawerOpen).toHaveBeenCalledTimes(1);
  });

  it("applies green style to metaText when isCompleted=true (still active list)", () => {
    renderHeader({
      type: "active",
      metaText: "3/3 Completed",
      isCompleted: true,
      itemsLength: 3,
      onDrawerOpen: jest.fn(),
    });

    const meta = screen.getByText("3/3 Completed");
    expect(meta).toBeInTheDocument();
    expect(meta).toHaveClass("text-green-600");
  });

  it("completed list with zero items dims the header color", () => {
    const { container } = renderHeader({
      type: "completed",
      itemsLength: 0,
    });

    const h2 = container.querySelector("h2");
    expect(h2).toBeInTheDocument();
    expect(h2!).toHaveClass("font-semibold text-lg leading-6");
  });

  it("merges custom className on the root container", () => {
    const { container } = renderHeader({
      className: "mt-10",
      type: "active",
      itemsLength: 1,
      onDrawerOpen: jest.fn(),
    });

    const root = container.firstElementChild as HTMLElement;
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass("mt-10");
  });
});
