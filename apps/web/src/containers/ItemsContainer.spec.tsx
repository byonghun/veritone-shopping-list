import { render, screen, fireEvent, act } from "@testing-library/react";
import ItemsContainer from "./ItemsContainer";

const actClick = async (el: Element | Node | Window) =>
  act(async () => {
    fireEvent.click(el as any);
  });

const openDrawerMock = jest.fn();
const openDialogMock = jest.fn();

jest.mock("../hooks/useDrawer", () => ({
  __esModule: true,
  useDrawer: () => ({ openDrawer: openDrawerMock, closeDrawer: jest.fn() }),
}));

jest.mock("../hooks/useDialog", () => ({
  __esModule: true,
  useDialog: () => ({ openDialog: openDialogMock }),
}));

type QueryShape = {
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  data?: any;
  error?: any;
  refetch: jest.Mock;
};
type MutShape = { mutateAsync: jest.Mock };
let mockQuery: QueryShape;
let mockCreate: MutShape;
let mockUpdate: MutShape;
let mockRemove: MutShape;
let mockDeleteAll: MutShape;

jest.mock("../hooks/useItems", () => ({
  __esModule: true,
  useItems: () => ({
    query: mockQuery,
    create: mockCreate,
    update: mockUpdate,
    remove: mockRemove,
    deleteAll: mockDeleteAll,
    keys: { items: ["items"] as const },
  }),
}));

let lastSSECb: ((s: { items: any[] }) => void) | undefined;
jest.mock("../hooks/useItemsSSE", () => ({
  __esModule: true,
  useItemsSSE: (cb: (s: { items: any[] }) => void) => {
    lastSSECb = cb;
  },
}));

jest.mock("../utils/errors", () => ({
  __esModule: true,
  getErrorDescription: async () => "Nice error message",
}));

jest.mock("../components/LoadingIndicator", () => ({
  __esModule: true,
  default: () => <div data-testid="loading" />,
}));

jest.mock("../components/ErrorCard", () => ({
  __esModule: true,
  default: ({ onClick, errorMessage }: { onClick: () => void; errorMessage: string }) => (
    <div data-testid="error-card">
      <p>{errorMessage}</p>
      <button onClick={onClick}>Try again</button>
    </div>
  ),
}));

jest.mock("../components/ui/button", () => ({
  __esModule: true,
  Button: (props: any) => <button {...props} />,
}));

jest.mock("../components/Item", () => ({
  __esModule: true,
  default: (props: any) => {
    const { id, itemName, purchased, onEdit, onDelete, onTogglePurchased } = props;
    return (
      <div data-testid={`item-${id}`}>
        <span data-testid={`name-${id}`}>{itemName}</span>
        <span data-testid={`purchased-${id}`}>{String(purchased)}</span>
        <button onClick={() => onEdit(id)}>edit</button>
        <button onClick={() => onDelete(id)}>delete</button>
        <button onClick={() => onTogglePurchased(id, !purchased)}>toggle</button>
      </div>
    );
  },
}));

function setPending() {
  mockQuery = {
    isPending: true,
    isSuccess: false,
    isError: false,
    refetch: jest.fn(),
  };
  mockCreate = { mutateAsync: jest.fn() };
  mockUpdate = { mutateAsync: jest.fn() };
  mockRemove = { mutateAsync: jest.fn() };
  mockDeleteAll = { mutateAsync: jest.fn() };
}

function setError(e: Error) {
  mockQuery = {
    isPending: false,
    isSuccess: false,
    isError: true,
    error: e,
    refetch: jest.fn(),
  };
  mockCreate = { mutateAsync: jest.fn() };
  mockUpdate = { mutateAsync: jest.fn() };
  mockRemove = { mutateAsync: jest.fn() };
  mockDeleteAll = { mutateAsync: jest.fn() };
}

function setSuccess(items: any[]) {
  mockQuery = {
    isPending: false,
    isSuccess: true,
    isError: false,
    data: { items },
    refetch: jest.fn(),
  };
  mockCreate = { mutateAsync: jest.fn() };
  mockUpdate = { mutateAsync: jest.fn() };
  mockRemove = { mutateAsync: jest.fn() };
  mockDeleteAll = { mutateAsync: jest.fn() };
}

beforeEach(() => {
  jest.clearAllMocks();
  lastSSECb = undefined;
});

describe("ItemsContainer", () => {
  it("shows loader while first query is pending", () => {
    setPending();
    render(<ItemsContainer />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows error card on first load error and retries on click", async () => {
    setError(new Error("Boom"));
    render(<ItemsContainer />);

    expect(screen.getByTestId("error-card")).toBeInTheDocument();
    expect(screen.getByText("Boom")).toBeInTheDocument();

    await actClick(screen.getByText("Try again"));
    expect(mockQuery.refetch).toHaveBeenCalledTimes(1);
  });

  it("renders empty state after successful load with no items", async () => {
    setSuccess([]);
    render(<ItemsContainer />);

    const addFirst = screen.getByRole("button", {
      name: /add your first item/i,
    });
    expect(addFirst).toBeInTheDocument();

    await actClick(addFirst);
    expect(openDrawerMock).toHaveBeenCalledTimes(1);
    const args = openDrawerMock.mock.calls[0][0];
    expect(args.type).toBe("create");
    expect(args.defaultValues).toEqual({
      id: "",
      itemName: "",
      description: "",
      quantity: undefined,
      purchased: false,
    });

    const payload = { itemName: "Milk", description: "whole", quantity: 2 };
    const created = {
      id: "1",
      itemName: "Milk",
      description: "whole",
      quantity: 2,
      purchased: false,
    };
    mockCreate.mutateAsync.mockResolvedValueOnce(created);

    await act(async () => {
      await args.onConfirm(payload);
    });

    expect(screen.getByTestId("item-1")).toBeInTheDocument();
    expect(screen.getByTestId("name-1")).toHaveTextContent("Milk");
  });

  it("renders list view with counts and 'Add Item' button when items exist", () => {
    setSuccess([
      { id: "a", itemName: "Eggs", purchased: false, quantity: 1 },
      { id: "b", itemName: "Bread", purchased: true, quantity: 1 },
    ]);
    render(<ItemsContainer />);

    expect(screen.getByText(/1\/2 Completed/i)).toBeInTheDocument();

    const addBtn = screen.getByRole("button", { name: /add item/i });
    expect(addBtn).toBeInTheDocument();
    fireEvent.click(addBtn);
    expect(openDrawerMock).toHaveBeenCalled();
    expect(openDrawerMock.mock.calls[0][0].type).toBe("create");
  });

  it("Edit flow: opens drawer with defaultValues; onConfirm updates item", async () => {
    setSuccess([{ id: "x", itemName: "Tea", purchased: false, quantity: 1 }]);
    mockUpdate.mutateAsync.mockResolvedValueOnce(undefined);

    render(<ItemsContainer />);

    await actClick(screen.getByText("edit"));

    expect(openDrawerMock).toHaveBeenCalled();
    const args = openDrawerMock.mock.calls[0][0];
    expect(args.type).toBe("update");
    expect(args.defaultValues).toMatchObject({ id: "x", itemName: "Tea" });

    await act(async () => {
      await args.onConfirm({
        itemName: "Green Tea",
        description: "",
        quantity: 1,
        purchased: false,
      });
    });

    expect(mockUpdate.mutateAsync).toHaveBeenCalledWith({
      id: "x",
      data: {
        itemName: "Green Tea",
        description: "",
        quantity: 1,
        purchased: false,
      },
    });
  });

  it("Delete flow: opens confirm dialog; confirm removes item (optimistic + server)", async () => {
    setSuccess([{ id: "d1", itemName: "Yogurt", purchased: false, quantity: 1 }]);
    mockRemove.mutateAsync.mockResolvedValueOnce(undefined);

    render(<ItemsContainer />);

    await actClick(screen.getByText("delete"));

    expect(openDialogMock).toHaveBeenCalled();
    const dlg = openDialogMock.mock.calls[0][0];
    expect(dlg.type).toBe("delete");

    await act(async () => {
      await dlg.onConfirm();
    });

    expect(mockRemove.mutateAsync).toHaveBeenCalledWith("d1");
    expect(screen.queryByTestId("item-d1")).toBeNull();
  });

  it("Toggle purchased: optimistic flip and calls update.mutateAsync with normalized payload", async () => {
    setSuccess([
      {
        id: "t1",
        itemName: "Apples",
        purchased: false,
        quantity: 2,
        description: "fuji",
      },
    ]);
    mockUpdate.mutateAsync.mockResolvedValueOnce(undefined);

    render(<ItemsContainer />);

    expect(screen.getByTestId("purchased-t1")).toHaveTextContent("false");

    await actClick(screen.getByText("toggle"));

    expect(screen.getByTestId("purchased-t1")).toHaveTextContent("true");
    expect(mockUpdate.mutateAsync).toHaveBeenCalledWith({
      id: "t1",
      data: {
        itemName: "Apples",
        description: "fuji",
        quantity: 2,
        purchased: true,
      },
    });
  });

  it("Create flow surfaces error via dialog and rolls back optimistic temp item", async () => {
    setSuccess([]);
    mockCreate.mutateAsync.mockRejectedValueOnce(new Error("fail"));

    render(<ItemsContainer />);

    await actClick(screen.getByRole("button", { name: /add your first item/i }));
    const args = openDrawerMock.mock.calls[0][0];

    await act(async () => {
      await args.onConfirm({
        itemName: "Milk",
        description: "",
        quantity: 1,
        purchased: false,
      });
    });

    expect(openDialogMock).toHaveBeenCalled();
    const dlg = openDialogMock.mock.calls[0][0];
    expect(dlg.type).toBe("error");
    expect(dlg.title).toMatch(/failed to create item/i);
    expect(screen.queryByTestId(/item-/)).toBeNull();
  });

  it("SSE snapshot replaces items and marks first load as complete", async () => {
    setSuccess([]);
    render(<ItemsContainer />);

    await act(async () => {
      lastSSECb?.({
        items: [{ id: "s1", itemName: "Snap", purchased: false, quantity: 1 }],
      });
    });

    expect(screen.getByTestId("item-s1")).toBeInTheDocument();
  });

  it("when all items are completed, shows ClearCompletedCard; confirm 'Clear list' calls deleteAll and empties list", async () => {
    setSuccess([
      { id: "c1", itemName: "Done A", purchased: true, quantity: 1 },
      { id: "c2", itemName: "Done B", purchased: true, quantity: 1 },
    ]);
    mockDeleteAll.mutateAsync.mockResolvedValueOnce({ deletedCount: 2 });

    render(<ItemsContainer />);

    expect(
      screen.getByRole("heading", { level: 3, name: /all items completed!/i }),
    ).toBeInTheDocument();
    const clearBtn = screen.getByRole("button", { name: /clear list/i });

    await actClick(clearBtn);
    expect(openDialogMock).toHaveBeenCalled();
    const dlg = openDialogMock.mock.calls[0][0];

    await act(async () => {
      await dlg.onConfirm();
    });

    expect(mockDeleteAll.mutateAsync).toHaveBeenCalledTimes(1);

    expect(screen.getByRole("button", { name: /add your first item/i })).toBeInTheDocument();
  });

  it("confirming 'Start new list' clears and then opens the drawer", async () => {
    jest.useFakeTimers();
    setSuccess([{ id: "z1", itemName: "All done", purchased: true, quantity: 1 }]);
    mockDeleteAll.mutateAsync.mockResolvedValueOnce({ deletedCount: 1 });

    render(<ItemsContainer />);

    const startBtn = screen.getByRole("button", { name: /start new list/i });

    await actClick(startBtn);
    expect(openDialogMock).toHaveBeenCalled();
    const dlg = openDialogMock.mock.calls[0][0];

    await act(async () => {
      await dlg.onConfirm();
    });

    expect(mockDeleteAll.mutateAsync).toHaveBeenCalledTimes(1);

    act(() => {
      jest.runAllTimers();
    });

    expect(openDrawerMock).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
