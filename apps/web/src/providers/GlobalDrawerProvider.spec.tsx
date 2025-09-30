import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import GlobalDrawerProvider, {
  GlobalDrawerContext,
} from "./GlobalDrawerProvider";

// ── helpers to guarantee all updates are wrapped in act ───────────────────────
const actClick = async (el: Element | Node | Window) =>
  act(async () => {
    fireEvent.click(el as any);
  });

const actChange = async (
  el: Element | Node,
  target: Record<string, unknown>
) =>
  act(async () => {
    fireEvent.change(el as any, { target });
  });

// ── mocks ────────────────────────────────────────────────────────────────────
jest.mock("../components/ui/drawer", () => {
  const React = require("react");
  const omitDomUnsafeProps = (props: any) => {
    const {
      onOpenAutoFocus,
      onCloseAutoFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onInteractOutside,
      open,
      onOpenChange,
      modal,
      direction,
      ...rest
    } = props || {};
    return rest;
  };

  return {
    __esModule: true,
    Drawer: ({ open, children }: any) =>
      open ? <div data-testid="mock-drawer">{children}</div> : null,
    DrawerContent: (props: any) => {
      const { className, children } = props || {};
      const rest = omitDomUnsafeProps(props);
      return (
        <div data-slot="drawer-content" data-class={className} {...rest}>
          {children}
        </div>
      );
    },
    DrawerHeader: ({ className, children }: any) => (
      <div data-slot="drawer-header" data-class={className}>
        {children}
      </div>
    ),
    DrawerFooter: ({ className, children }: any) => (
      <div data-slot="drawer-footer" data-class={className}>
        {children}
      </div>
    ),
    DrawerTitle: ({ className, children }: any) => (
      <h2 data-slot="drawer-title" className={className}>
        {children}
      </h2>
    ),
    DrawerDescription: ({ className, children }: any) => (
      <p data-slot="drawer-description" className={className}>
        {children}
      </p>
    ),
    DrawerClose: ({ asChild, children, ...rest }: any) =>
      asChild
        ? React.cloneElement(children, {
            "data-slot": "drawer-close",
            ...children.props,
          })
        : (
          <button data-slot="drawer-close" {...omitDomUnsafeProps(rest)}>
            {children}
          </button>
        ),
    DrawerPortal: ({ children }: any) => <>{children}</>,
    DrawerOverlay: () => <div data-slot="drawer-overlay" />,
    DrawerTrigger: ({ children }: any) => (
      <button data-slot="drawer-trigger">{children}</button>
    ),
  };
});

jest.mock("../components/ui/button", () => ({
  __esModule: true,
  Button: (props: any) => <button {...props} />,
}));

// forward ref so RHF register() works
jest.mock("../components/ui/input", () => {
  const React = require("react");
  return {
    __esModule: true,
    Input: React.forwardRef(function InputMock(
      props: any,
      ref: React.ForwardedRef<HTMLInputElement>
    ) {
      return <input ref={ref} data-slot="input" {...props} />;
    }),
  };
});

// forward ref so RHF register() works
jest.mock("../components/ui/textarea", () => {
  const React = require("react");
  return {
    __esModule: true,
    Textarea: React.forwardRef(function TextareaMock(
      props: any,
      ref: React.ForwardedRef<HTMLTextAreaElement>
    ) {
      return <textarea ref={ref} data-slot="textarea" {...props} />;
    }),
  };
});

jest.mock("../components/ui/checkbox", () => ({
  __esModule: true,
  Checkbox: ({ onCheckedChange, ...rest }: any) => (
    <input
      type="checkbox"
      data-slot="checkbox"
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...rest}
    />
  ),
}));

// keep type="button" so option clicks don't submit the form
jest.mock("../components/ui/select", () => ({
  __esModule: true,
  Select: ({
    value,
    onClick,
  }: {
    value?: number;
    onClick: (v: number) => void;
  }) => (
    <div>
      <div data-testid="select-current">{value ?? ""}</div>
      <button type="button" data-testid="select-1" onClick={() => onClick(1)}>
        Select 1
      </button>
      <button type="button" data-testid="select-3" onClick={() => onClick(3)}>
        Select 3
      </button>
    </div>
  ),
}));

// ── harness ──────────────────────────────────────────────────────────────────
function Consumer({
  onConfirmRef,
}: {
  onConfirmRef?: React.MutableRefObject<jest.Mock | undefined>;
}) {
  const ctx = React.useContext(GlobalDrawerContext)!;

  return (
    <div>
      <button
        data-testid="open-create"
        onClick={() =>
          ctx.openDrawer({
            type: "create",
            onConfirm: onConfirmRef?.current,
          } as any)
        }
      >
        open-create
      </button>

      <button
        data-testid="open-update"
        onClick={() =>
          ctx.openDrawer({
            type: "update",
            defaultValues: {
              itemName: "Bread",
              description: "Whole",
              quantity: 2,
              purchased: false,
            },
            onConfirm: onConfirmRef?.current,
          } as any)
        }
      >
        open-update
      </button>

      <button data-testid="close" onClick={() => ctx.closeDrawer()}>
        close
      </button>
    </div>
  );
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<GlobalDrawerProvider>{ui}</GlobalDrawerProvider>);
}

// ── tests ─────────────────────────────────────────────────────────────────────
describe("GlobalDrawerProvider", () => {
  it("opens in create mode and submits after filling required fields", async () => {
    const onConfirmRef = { current: jest.fn() as jest.Mock | undefined };
    renderWithProvider(<Consumer onConfirmRef={onConfirmRef} />);

    await actClick(screen.getByTestId("open-create"));
    expect(screen.getByTestId("mock-drawer")).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText("Item Name");
    const descInput = screen.getByPlaceholderText("Description");

    await actChange(nameInput, { name: "itemName", value: "Milk" });
    await actChange(descInput, { name: "description", value: "ok" });
    await actClick(screen.getByTestId("select-1"));

    const submitBtn = screen.getByRole("button", { name: /add task/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    await actClick(submitBtn);

    await waitFor(() => expect(onConfirmRef.current).toHaveBeenCalledTimes(1));
    const payload = onConfirmRef.current!.mock.calls[0][0];
    expect(payload.itemName).toBe("Milk");
    expect(payload.quantity).toBe(1);
    expect(payload.purchased).toBe(false);
    expect(screen.queryByTestId("mock-drawer")).toBeNull();
  });

  it("selects quantity via Select and passes value through", async () => {
    const onConfirmRef = { current: jest.fn() as jest.Mock | undefined };
    renderWithProvider(<Consumer onConfirmRef={onConfirmRef} />);

    await actClick(screen.getByTestId("open-create"));
    await actChange(screen.getByPlaceholderText("Item Name"), {
      name: "itemName",
      value: "Eggs",
    });

    await actClick(screen.getByTestId("select-3"));
    expect(screen.getByTestId("select-current").textContent).toBe("3");

    const submitBtn = screen.getByRole("button", { name: /add task/i });
    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    await actClick(submitBtn);

    await waitFor(() => expect(onConfirmRef.current).toHaveBeenCalledTimes(1));
    expect(onConfirmRef.current!.mock.calls[0][0].quantity).toBe(3);
  });

  it("update mode shows purchased checkbox; 'Save Item' disabled until dirty; submits after change", async () => {
    const onConfirmRef = { current: jest.fn() as jest.Mock | undefined };
    renderWithProvider(<Consumer onConfirmRef={onConfirmRef} />);

    await actClick(screen.getByTestId("open-update"));

    const purchased = screen.getByLabelText("Purchased");
    expect(purchased).toBeInTheDocument();

    const submitBtn = screen.getByRole("button", { name: /save item/i });
    expect(submitBtn).toBeDisabled();

    await actClick(screen.getByTestId("select-1"));

    await waitFor(() => expect(submitBtn).not.toBeDisabled());

    await actClick(submitBtn);
    await waitFor(() => expect(onConfirmRef.current).toHaveBeenCalledTimes(1));
  });

  it("shows Clear Form when dirty and resets fields on click", async () => {
    renderWithProvider(<Consumer />);

    await actClick(screen.getByTestId("open-create"));

    const nameInput = screen.getByPlaceholderText(
      "Item Name"
    ) as HTMLInputElement;

    await actChange(nameInput, { name: "itemName", value: "Tea" });
    await actClick(screen.getByTestId("select-1"));

    const clearBtn = await waitFor(() =>
      screen.getByRole("button", { name: "Clear Form" })
    );

    await actClick(clearBtn);
    expect(nameInput.value).toBe("");
  });

  it("closeDrawer() clears dirty form and next open is clean", async () => {
    renderWithProvider(<Consumer />);

    await actClick(screen.getByTestId("open-create"));
    const nameInput = screen.getByPlaceholderText(
      "Item Name"
    ) as HTMLInputElement;

    await actChange(nameInput, { name: "itemName", value: "Butter" });
    await actClick(screen.getByTestId("close"));

    expect(screen.queryByTestId("mock-drawer")).toBeNull();

    await actClick(screen.getByTestId("open-create"));
    // form should be reset (empty), not "Butter"
    await waitFor(() =>
      expect(
        (screen.getByPlaceholderText("Item Name") as HTMLInputElement).value
      ).toBe("")
    );
  });

  it("header close button (icon-only) closes the drawer", async () => {
    renderWithProvider(<Consumer />);

    await actClick(screen.getByTestId("open-create"));

    const headerClose = document.querySelector(
      "button.w-\\[70px\\]"
    ) as HTMLButtonElement | null;
    expect(headerClose).not.toBeNull();

    if (headerClose) {
      await actClick(headerClose);
    }
    expect(screen.queryByTestId("mock-drawer")).toBeNull();
  });
});
