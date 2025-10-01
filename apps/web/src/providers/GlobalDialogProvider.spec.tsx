import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GlobalDialogProvider, {
  GlobalDialogContext,
} from "./GlobalDialogProvider";

jest.mock("../components/ui/button", () => ({
  __esModule: true,
  Button: (props: any) => <button {...props} />,
}));

jest.mock("../components/ui/dialog", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");

  function omitDomUnsafeProps<P extends Record<string, any>>(props: P) {
    const {
      onOpenAutoFocus: _a,
      showCloseButton: _b,
      ...rest
    } = props as any;
    return rest as P;
  }

  return {
    __esModule: true,
    Dialog: ({ open, children }: any) =>
      open ? <div data-testid="mock-dialog">{children}</div> : null,

    DialogContent: (props: any) => {
      const { className, showCloseButton, children } = props;
      const rest = omitDomUnsafeProps(props);
      return (
        <div data-slot="dialog-content" data-class={className} {...rest}>
          {showCloseButton ? (
            <button data-slot="dialog-close" aria-label="Close ×" />
          ) : null}
          {children}
        </div>
      );
    },

    DialogHeader: ({ className, children }: any) => (
      <div data-slot="dialog-header" data-class={className}>
        {children}
      </div>
    ),
    DialogFooter: ({ className, children }: any) => (
      <div data-slot="dialog-footer" data-class={className}>
        {children}
      </div>
    ),
    DialogTitle: ({ className, children }: any) => (
      <h2 data-slot="dialog-title" className={className}>
        {children}
      </h2>
    ),
    DialogDescription: ({ className, children }: any) => (
      <p data-slot="dialog-description" className={className}>
        {children}
      </p>
    ),
    DialogClose: ({ asChild, children, ...rest }: any) =>
      asChild ? (
        React.cloneElement(children, {
          "data-slot": "dialog-close",
          ...children.props,
        })
      ) : (
        <button data-slot="dialog-close" {...omitDomUnsafeProps(rest)}>
          {children}
        </button>
      ),
    DialogTrigger: ({ children }: any) => (
      <button data-slot="dialog-trigger">{children}</button>
    ),
    DialogOverlay: () => <div data-slot="dialog-overlay" />,
    DialogPortal: ({ children }: any) => <>{children}</>,
  };
});

function Consumer({
  onConfirmRef,
}: {
  onConfirmRef?: React.MutableRefObject<jest.Mock | undefined>;
}) {
  const ctx = React.useContext(GlobalDialogContext)!;

  return (
    <div>
      <button
        data-testid="open-error"
        onClick={() =>
          ctx.openDialog({
            title: "Delete item",
            type: "error",
            btnLabel: "Delete",
            closeBtnLabel: "Cancel",
            description: "This cannot be undone",
            headerTextClassName: "hdr-x",
            descriptionTextClassName: "desc-x",
            className: "extra-content-class",
            onConfirm: onConfirmRef?.current,
          })
        }
      />
      <button
        data-testid="open-info"
        onClick={() =>
          ctx.openDialog({
            title: "Info",
            type: "alert",
            btnLabel: "OK",
            closeBtnLabel: "Close",
            description: "All good",
            className: "info-extra",
          })
        }
      />
      <button data-testid="close-dialog" onClick={() => ctx.closeDialog()} />
    </div>
  );
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<GlobalDialogProvider>{ui}</GlobalDialogProvider>);
}

describe("GlobalDialogProvider", () => {
  it("opens an ERROR dialog: hides Cancel, styles confirm red, hides top-right close (onConfirm present)", () => {
    const onConfirmRef = { current: jest.fn() as jest.Mock | undefined };

    renderWithProvider(<Consumer onConfirmRef={onConfirmRef} />);

    fireEvent.click(screen.getByTestId("open-error"));

    const content = screen
      .getByTestId("mock-dialog")
      .querySelector('[data-slot="dialog-content"]') as HTMLElement;
    expect(content).toBeInTheDocument();

    const contentClass = content.getAttribute("data-class") || "";
    expect(contentClass).toContain("bg-white");
    expect(contentClass).toContain("extra-content-class");

    const title = screen.getByText("Delete item");
    expect(title).toHaveAttribute("data-slot", "dialog-title");
    expect(title).toHaveClass("hdr-x");

    const desc = screen.getByText("This cannot be undone");
    expect(desc).toHaveAttribute("data-slot", "dialog-description");
    expect(desc).toHaveClass("desc-x");

    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();

    const confirm = screen.getByRole("button", { name: "Delete" });
    expect(confirm).toBeInTheDocument();
    expect(confirm.getAttribute("class") || "").toContain("bg-red-600");

    expect(screen.queryByLabelText("Close ×")).toBeNull();
  });

  it("opens an INFO dialog: shows Cancel, confirm not red, top-right close present (no onConfirm)", () => {
    renderWithProvider(<Consumer />);

    fireEvent.click(screen.getByTestId("open-info"));

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    const confirm = screen.getByRole("button", { name: "OK" });
    expect(confirm).toBeInTheDocument();
    expect(confirm.getAttribute("class") || "").not.toContain("bg-red-600");

    expect(screen.getByLabelText("Close ×")).toBeInTheDocument();

    const content = screen
      .getByTestId("mock-dialog")
      .querySelector('[data-slot="dialog-content"]') as HTMLElement;
    const contentClass = content.getAttribute("data-class") || "";
    expect(contentClass).toContain("bg-white");
    expect(contentClass).toContain("info-extra");
  });

  it("clicking confirm calls onConfirm and closes the dialog", () => {
    const onConfirmRef = { current: jest.fn() as jest.Mock | undefined };
    renderWithProvider(<Consumer onConfirmRef={onConfirmRef} />);

    fireEvent.click(screen.getByTestId("open-error"));

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onConfirmRef.current).toHaveBeenCalledTimes(1);

    expect(screen.queryByTestId("mock-dialog")).toBeNull();
  });

  it("closeDialog() closes the dialog", () => {
    renderWithProvider(<Consumer />);

    fireEvent.click(screen.getByTestId("open-info"));
    expect(screen.getByTestId("mock-dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close-dialog"));
    expect(screen.queryByTestId("mock-dialog")).toBeNull();
  });
});
