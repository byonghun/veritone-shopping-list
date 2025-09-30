import React from "react";
import { render, screen } from "@testing-library/react";

import { useDrawer } from "./useDrawer";
import { GlobalDrawerContext } from "../providers/GlobalDrawerProvider";

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
  const ctx = useDrawer();
  return <div data-testid="value">{(ctx as any).__TEST__ ?? "ok"}</div>;
};

describe("useDrawer", () => {
  it("throws a descriptive error if used outside GlobalDrawerProvider", () => {
    const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    let captured: Error | undefined;

    render(
      <ErrorBoundary onError={(e) => (captured = e)}>
        <Consumer />
      </ErrorBoundary>
    );

    expect(captured).toBeDefined();
    expect(captured!.message).toBe(
      "useDrawer must be used within the GlobalDrawerProvider"
    );

    errSpy.mockRestore();
  });

  it("returns the provided context value when inside the provider", () => {
    const mockValue = { __TEST__: 123 } as any;

    render(
      <GlobalDrawerContext.Provider value={mockValue}>
        <Consumer />
      </GlobalDrawerContext.Provider>
    );

    expect(screen.getByTestId("value")).toHaveTextContent("123");
  });
});
