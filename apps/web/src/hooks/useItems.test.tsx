import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useItems } from "./useItems";

jest.mock("../api/items.api", () => ({
  __esModule: true,
  ItemsClient: {
    listAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  },
}));

import { ItemsClient } from "../api/items.api";

function Harness() {
  const { query, create, update, remove, keys } = useItems();

  return (
    <div>
      <div data-testid="status">{query.status}</div>
      <div data-testid="len">{query.data?.items?.length ?? 0}</div>
      <div data-testid="keys">{JSON.stringify(keys.items)}</div>

      <button data-testid="create" onClick={() => create.mutate({ itemName: "Milk" } as any)} />
      <button
        data-testid="update"
        onClick={() => update.mutate({ id: "1", data: { itemName: "Eggs" } as any })}
      />
      <button data-testid="remove" onClick={() => remove.mutate("1")} />
    </div>
  );
}

function renderWithClient(ui: React.ReactElement) {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const utils = render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
  const invalidateSpy = jest.spyOn(qc, "invalidateQueries");
  return { ...utils, qc, invalidateSpy };
}

describe("useItems", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("runs the initial listAll() query and exposes keys.items=['items']", async () => {
    const first = { items: [{ id: "a" }] };
    (ItemsClient.listAll as jest.Mock).mockResolvedValueOnce(first).mockResolvedValue(first);

    renderWithClient(<Harness />);

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("success");
    });
    expect(screen.getByTestId("len").textContent).toBe("1");

    expect(ItemsClient.listAll).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("keys").textContent).toBe(JSON.stringify(["items"]));
  });

  it("create.mutate calls ItemsClient.create and invalidates ['items']", async () => {
    (ItemsClient.listAll as jest.Mock).mockResolvedValue({ items: [] });
    (ItemsClient.create as jest.Mock).mockResolvedValue({ id: "1" });

    const { invalidateSpy } = renderWithClient(<Harness />);

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("success");
    });

    fireEvent.click(screen.getByTestId("create"));

    await waitFor(() => {
      expect(ItemsClient.create).toHaveBeenCalledWith({ itemName: "Milk" });
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["items"] });
    });

    await waitFor(() => {
      expect(ItemsClient.listAll).toHaveBeenCalledTimes(2);
    });
  });

  it("update.mutate calls ItemsClient.update and invalidates ['items']", async () => {
    (ItemsClient.listAll as jest.Mock).mockResolvedValue({ items: [] });
    (ItemsClient.update as jest.Mock).mockResolvedValue({ id: "1", itemName: "Eggs" });

    const { invalidateSpy } = renderWithClient(<Harness />);

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("success");
    });

    fireEvent.click(screen.getByTestId("update"));

    await waitFor(() => {
      expect(ItemsClient.update).toHaveBeenCalledWith("1", { itemName: "Eggs" });
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["items"] });
    });

    await waitFor(() => {
      expect(ItemsClient.listAll).toHaveBeenCalledTimes(2);
    });
  });

  it("remove.mutate calls ItemsClient.remove and invalidates ['items']", async () => {
    (ItemsClient.listAll as jest.Mock).mockResolvedValue({ items: [] });
    (ItemsClient.remove as jest.Mock).mockResolvedValue(undefined);

    const { invalidateSpy } = renderWithClient(<Harness />);

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("success");
    });

    fireEvent.click(screen.getByTestId("remove"));

    await waitFor(() => {
      expect(ItemsClient.remove).toHaveBeenCalledWith("1");
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["items"] });
    });

    await waitFor(() => {
      expect(ItemsClient.listAll).toHaveBeenCalledTimes(2);
    });
  });
});
