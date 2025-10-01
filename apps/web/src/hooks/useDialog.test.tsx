import React from "react";
import { render, screen } from "@testing-library/react";

import { useDialog } from "./useDialog";
import { GlobalDialogContext } from "../providers/GlobalDialogProvider";

class ErrorBoundary extends React.Component<
  { onError: (e: Error) => void; children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    this.props.onError(error);
  }
  render() {
    if (this.state.error) return null;
    return this.props.children;
  }
}

const Consumer = () => {
  const ctx = useDialog();
  return <div data-testid="value">{(ctx as any).__TEST__ ?? "ok"}</div>;
};

describe("useDialog", () => {
  it("throws a descriptive error if used outside GlobalDialogProvider", () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    let captured: Error | undefined;

    render(
      <ErrorBoundary onError={(e) => (captured = e)}>
        <Consumer />
      </ErrorBoundary>,
    );

    expect(captured).toBeDefined();
    expect(captured!.message).toBe("useDialog must be used within the GlobalDialogProvider");

    errSpy.mockRestore();
  });

  it("returns the provided context value when inside the provider", () => {
    const mockValue = { __TEST__: 42 } as any;

    render(
      <GlobalDialogContext.Provider value={mockValue}>
        <Consumer />
      </GlobalDialogContext.Provider>,
    );

    expect(screen.getByTestId("value")).toHaveTextContent("42");
  });
});
