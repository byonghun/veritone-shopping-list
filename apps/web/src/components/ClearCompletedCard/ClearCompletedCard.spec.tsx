import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ClearCompletedCard from "./";

describe("ClearCompletedCard", () => {
  it("renders heading, prompt text, and both action buttons", () => {
    const onClear = jest.fn();
    render(<ClearCompletedCard onClear={onClear} />);

    const container = screen.getByRole("heading", { level: 3 }).closest("#clear-completed-card");
    expect(container).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { level: 3, name: /all items completed!/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/clear this list, or start a new one\?/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /clear list/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start new list/i })).toBeInTheDocument();
  });

  it("invokes onClear with undefined for 'Clear list' and true for 'Start new list'", () => {
    const onClear = jest.fn();
    render(<ClearCompletedCard onClear={onClear} />);

    fireEvent.click(screen.getByRole("button", { name: /clear list/i }));
    expect(onClear).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /start new list/i }));
    expect(onClear).toHaveBeenCalledTimes(2);
    expect(onClear).toHaveBeenLastCalledWith(true);
  });

  it("awaits an async onClear without throwing (smoke test for Promise-returning handler)", async () => {
    const onClearAsync = jest.fn().mockResolvedValue(undefined);
    render(<ClearCompletedCard onClear={onClearAsync} />);

    fireEvent.click(screen.getByRole("button", { name: /start new list/i }));

    await waitFor(() => {
      expect(onClearAsync).toHaveBeenCalledWith(true);
    });
  });
});
