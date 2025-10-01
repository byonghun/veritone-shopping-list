import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GlobalDrawerProvider, { GlobalDrawerContext } from "./GlobalDrawerProvider";

jest.mock("../components/ui/drawer", () => {
  const omitDomUnsafeProps = (props: any) => {
    const { onOpenAutoFocus: _a, onCloseAutoFocus: _b, ...domSafe } = props;

    return domSafe;
  };

  return {
    __esModule: true,
    Drawer: ({ open, children }: any) => (open ? <div data-testid="drawer">{children}</div> : null),
    DrawerContent: (props: any) => {
      const { className, children } = props || {};
      const rest = omitDomUnsafeProps(props);
      return (
        <div data-testid="drawer-content" data-class={className} {...rest}>
          {children}
        </div>
      );
    },
    DrawerHeader: ({ className, children }: any) => (
      <div data-testid="drawer-header" data-class={className}>
        {children}
      </div>
    ),
    DrawerTitle: ({ className, children }: any) => (
      <h2 data-testid="drawer-title" className={className}>
        {children}
      </h2>
    ),
  };
});

let ITEM_FORM_MOUNT_COUNT = 0;

jest.mock("../components/ItemForm", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react");
  function ItemFormMock(props: any) {
    const [mounts, setMounts] = React.useState(0);

    React.useEffect(() => {
      ITEM_FORM_MOUNT_COUNT += 1;
      setMounts(ITEM_FORM_MOUNT_COUNT);
    }, []);

    const { type, description, descriptionTextClassName, defaultValues } = props;

    return (
      <div data-testid="item-form">
        <div data-testid="item-form-type">{type ?? "undefined"}</div>
        <div data-testid="item-form-desc" className={descriptionTextClassName}>
          {description}
        </div>
        <div data-testid="item-form-id">{defaultValues?.id ?? "no-id"}</div>
        <div data-testid="item-form-mounts">{mounts}</div>
      </div>
    );
  }
  return { __esModule: true, default: ItemFormMock };
});

function Consumer({ propsA, propsB, propsC }: { propsA: any; propsB: any; propsC: any }) {
  const ctx = React.useContext(GlobalDrawerContext)!;

  return (
    <div>
      <button data-testid="open-a" onClick={() => ctx.openDrawer(propsA)}>
        open-a
      </button>
      <button data-testid="open-b" onClick={() => ctx.openDrawer(propsB)}>
        open-b
      </button>
      <button data-testid="open-c" onClick={() => ctx.openDrawer(propsC)}>
        open-c
      </button>
      <button data-testid="close" onClick={() => ctx.closeDrawer()}>
        close
      </button>
    </div>
  );
}

const baseDefaults = {
  id: "",
  itemName: "",
  description: "",
  quantity: undefined,
  purchased: false,
  createdAt: undefined,
  updatedAt: undefined,
};

describe("GlobalDrawerProvider (drawer-focused)", () => {
  beforeEach(() => {
    ITEM_FORM_MOUNT_COUNT = 0;
  });

  function renderWithProvider() {
    const propsA = {
      type: "create" as const,
      description: "Create something",
      descriptionTextClassName: "desc-class",
      defaultValues: { ...baseDefaults, id: "" },
      onConfirm: jest.fn(),
    };

    const propsB = {
      type: "update" as const,
      description: "Update something",
      descriptionTextClassName: "desc-class-b",
      defaultValues: { ...baseDefaults, id: "" },
      onConfirm: jest.fn(),
    };

    const propsC = {
      type: "update" as const,
      description: "Update other",
      descriptionTextClassName: "desc-class-c",
      defaultValues: { ...baseDefaults, id: "abc" },
      onConfirm: jest.fn(),
    };

    return render(
      <GlobalDrawerProvider>
        <Consumer propsA={propsA} propsB={propsB} propsC={propsC} />
        <div data-testid="outside-child">outside</div>
      </GlobalDrawerProvider>,
    );
  }

  it("renders children and keeps drawer closed by default", () => {
    renderWithProvider();
    expect(screen.getByTestId("outside-child")).toHaveTextContent("outside");
    expect(screen.queryByTestId("drawer")).toBeNull();
  });

  it("openDrawer opens the drawer and passes props to ItemForm", async () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId("open-a"));
    expect(screen.getByTestId("drawer")).toBeInTheDocument();

    expect(screen.getByTestId("item-form-type")).toHaveTextContent("create");
    expect(screen.getByTestId("item-form-id")).toHaveTextContent("");

    await waitFor(() => expect(screen.getByTestId("item-form-mounts")).toHaveTextContent("1"));
  });

  it("header close button closes the drawer", () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId("open-a"));
    expect(screen.getByTestId("drawer")).toBeInTheDocument();

    const headerClose = document.querySelector("button.w-\\[70px\\].h-full") as HTMLButtonElement | null;
    expect(headerClose).not.toBeNull();

    if (headerClose) fireEvent.click(headerClose);
    expect(screen.queryByTestId("drawer")).toBeNull();
  });

  it("closeDrawer from context closes the drawer", () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId("open-a"));
    expect(screen.getByTestId("drawer")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("close"));
    expect(screen.queryByTestId("drawer")).toBeNull();
  });

  it("remounts ItemForm when the keyed scenario changes (type or id), and not when unchanged", async () => {
    renderWithProvider();

    fireEvent.click(screen.getByTestId("open-a"));
    await waitFor(() => expect(screen.getByTestId("item-form-mounts")).toHaveTextContent("1"));

    fireEvent.click(screen.getByTestId("open-b"));
    await waitFor(() => expect(screen.getByTestId("item-form-mounts")).toHaveTextContent("2"));

    fireEvent.click(screen.getByTestId("open-b"));
    expect(screen.getByTestId("item-form-mounts")).toHaveTextContent("2");

    fireEvent.click(screen.getByTestId("open-c"));
    await waitFor(() => expect(screen.getByTestId("item-form-mounts")).toHaveTextContent("3"));
  });
});
