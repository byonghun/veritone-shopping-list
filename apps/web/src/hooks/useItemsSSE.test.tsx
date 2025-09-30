import type { UIItemsSnapshot } from "@app/shared";
import { render } from "@testing-library/react";
import { useItemsSSE } from "./useItemsSSE";

type Listener = (evt: { data: string; type?: string }) => void;

class MockEventSource {
  static instances: MockEventSource[] = [];

  url: string;
  closed = false;
  private listeners: Record<string, Set<Listener>> = {};

  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
  }

  addEventListener(type: string, cb: Listener) {
    (this.listeners[type] ??= new Set()).add(cb);
  }

  removeEventListener(type: string, cb: Listener) {
    this.listeners[type]?.delete(cb);
  }

  close() {
    this.closed = true;
  }

  dispatch(type: string, data: string) {
    const cbs = this.listeners[type];
    if (!cbs) return;
    for (const cb of Array.from(cbs)) cb({ data, type });
  }
}

function Harness({ onSnapshot }: { onSnapshot: (s: UIItemsSnapshot) => void }) {
  useItemsSSE(onSnapshot);
  return null;
}

const OriginalES: any = (globalThis as any).EventSource;

beforeAll(() => {
  (globalThis as any).EventSource = MockEventSource as any;
});

afterAll(() => {
  (globalThis as any).EventSource = OriginalES;
});

afterEach(() => {
  MockEventSource.instances.length = 0;
  jest.clearAllMocks();
});

describe("useItemsSSE", () => {
  it("connects to /api/v1/sse/items and calls onSnapshot with parsed payload", () => {
    const onSnapshot = jest.fn();
    render(<Harness onSnapshot={onSnapshot} />);

    expect(MockEventSource.instances.length).toBe(1);
    const es = MockEventSource.instances[0];
    expect(es.url).toBe("/api/v1/sse/items");

    const payload: UIItemsSnapshot = { items: [{ id: "1", itemName: "Milk" } as any] };
    es.dispatch("snapshot", JSON.stringify(payload));

    expect(onSnapshot).toHaveBeenCalledTimes(1);
    expect(onSnapshot).toHaveBeenCalledWith(payload);
  });

  it("ignores invalid JSON without throwing", () => {
    const onSnapshot = jest.fn();
    render(<Harness onSnapshot={onSnapshot} />);

    const es = MockEventSource.instances[0];
    es.dispatch("snapshot", "{not json}");

    expect(onSnapshot).not.toHaveBeenCalled();
  });

  it("removes the listener and closes the EventSource on unmount", () => {
    const onSnapshot = jest.fn();
    const { unmount } = render(<Harness onSnapshot={onSnapshot} />);

    const es = MockEventSource.instances[0];

    const removeSpy = jest.spyOn(es as any, "removeEventListener");
    const closeSpy = jest.spyOn(es as any, "close");

    unmount();

    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy.mock.calls[0][0]).toBe("snapshot");
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(es.closed).toBe(true);
  });
});
