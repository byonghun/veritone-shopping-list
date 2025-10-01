import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ItemForm from "./";

jest.mock("@app/shared", () => {
  const { z } = require("zod");
  const ItemSchema = z.object({
    id: z.string().optional(),
    itemName: z.string().trim().min(1, "Item name is required."),
    description: z.string().optional(),
    quantity: z.number().int().positive().optional(),
    purchased: z.boolean().optional(),
    createdAt: z.any().optional(),
    updatedAt: z.any().optional(),
  });
  return {
    ItemSchema,
  };
});

jest.mock("../../constants/drawer", () => ({
  DEFAULT_ITEM: {
    id: "",
    itemName: "",
    description: "",
    quantity: undefined,
    purchased: false,
    createdAt: undefined,
    updatedAt: undefined,
  },
  MAX_DESCRIPTION: 200,
}));

jest.mock("../../components/ui/button", () => ({
  Button: (props: any) => <button {...props} />,
}));

jest.mock("../../components/ui/checkbox", () => ({
  Checkbox: ({ onCheckedChange, checked, ...rest }: any) => (
    <input
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...rest}
    />
  ),
}));

jest.mock("../../components/ui/drawer", () => ({
  DrawerClose: ({ asChild, children }: any) =>
    asChild ? children : <button>{children}</button>,
  DrawerDescription: ({ className, children }: any) => (
    <p data-testid="drawer-description" className={className}>
      {children}
    </p>
  ),
  DrawerFooter: ({ className, children }: any) => (
    <div data-testid="drawer-footer" className={className}>
      {children}
    </div>
  ),
}));

jest.mock("../../components/ui/input", () => {
  const React = require("react");
  return {
    Input: React.forwardRef(function InputMock(
      props: any,
      ref: React.ForwardedRef<HTMLInputElement>
    ) {
      return <input ref={ref} {...props} />;
    }),
  };
});

jest.mock("../../components/ui/textarea", () => {
  const React = require("react");
  return {
    Textarea: React.forwardRef(function TextareaMock(
      props: any,
      ref: React.ForwardedRef<HTMLTextAreaElement>
    ) {
      return <textarea ref={ref} {...props} />;
    }),
  };
});

jest.mock("../../components/ui/select", () => ({
  Select: ({
    value,
    onClick,
    onOpenChange,
  }: {
    value?: number;
    onClick: (v: number) => void;
    onOpenChange?: (v: boolean) => void;
  }) => (
    <div>
      <div data-testid="select-value">{value ?? ""}</div>
      <button
        type="button"
        data-testid="select-1"
        onClick={() => {
          onClick(1);
          onOpenChange?.(false);
        }}
      >
        Select 1
      </button>
      <button
        type="button"
        data-testid="select-3"
        onClick={() => {
          onClick(3);
          onOpenChange?.(false);
        }}
      >
        Select 3
      </button>
    </div>
  ),
}));

jest.mock("../../utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

const baseDefaultValues = {
  id: "",
  itemName: "",
  description: "",
  quantity: undefined,
  purchased: false,
  createdAt: undefined,
  updatedAt: undefined,
};

function renderForm(
  overrides?: Partial<React.ComponentProps<typeof ItemForm>>
) {
  const props: React.ComponentProps<typeof ItemForm> = {
    description: "Add your new item below",
    selectOpen: false,
    setSelectOpen: () => {},
    onClose: () => {},
    type: "create",
    defaultValues: baseDefaultValues,
    onConfirm: () => {},
    ...overrides,
  };
  return render(<ItemForm {...props} />);
}

const getSubmitBtn = () =>
  screen.getByRole("button", { name: /Add Task|Save Item|Saving...|Updating.../i });

/* ───────────── Tests ───────────── */

describe("ItemForm", () => {
  it("renders and shows provided description", () => {
    renderForm({ description: "Hello description" });
    expect(screen.getByTestId("drawer-description")).toHaveTextContent(
      "Hello description"
    );
  });

  it("create mode: requires itemName, allows selecting quantity, normalizes defaults, calls onConfirm and onClose", async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();

    renderForm({
      type: "create",
      onConfirm,
      onClose,
      defaultValues: baseDefaultValues,
    });

    const submit = getSubmitBtn();
    expect(submit).toBeDisabled();

    const name = screen.getByPlaceholderText("Item Name");
    fireEvent.change(name, { target: { name: "itemName", value: "Milk" } });

    fireEvent.click(screen.getByTestId("select-3"));
    expect(screen.getByTestId("select-value")).toHaveTextContent("3");

    await waitFor(() => expect(submit).not.toBeDisabled());
    fireEvent.click(submit);

    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
    const payload = onConfirm.mock.calls[0][0];

    expect(payload).toMatchObject({
      itemName: "Milk",
      description: "",
      quantity: 3,
      purchased: false,
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("update mode: shows Purchased checkbox and requires dirty state before submit", async () => {
    const onConfirm = jest.fn();

    renderForm({
      type: "update",
      onConfirm,
      defaultValues: {
        ...baseDefaultValues,
        id: "abc",
        itemName: "Bread",
        description: "Whole",
        quantity: 2,
        purchased: false,
      },
    });

    const purchased = screen.getByLabelText("Purchased");
    expect(purchased).toBeInTheDocument();

    const submit = getSubmitBtn();
    expect(submit).toBeDisabled();

    fireEvent.click(purchased);

    await waitFor(() => expect(submit).not.toBeDisabled());

    fireEvent.click(submit);
    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));

    const payload = onConfirm.mock.calls[0][0];
    expect(payload).toMatchObject({
      itemName: "Bread",
      description: "Whole",
      quantity: 2,
      purchased: true,
    });
  });
});
