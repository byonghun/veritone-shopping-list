import { useEffect } from "react";
import { TItem } from "../types/item";

type Snapshot = { items: TItem[] };

export function useItemsSSE(onSnapshot: (s: Snapshot) => void) {
  useEffect(() => {
    // Note: Creates a new browser EventSource object that connects
    // to the "/api/v1/sse/items"
    // Opens a long-lived connection using server-sent events
    // to the same web origin that served the page.
    const eventSource = new EventSource("/api/v1/sse/items");
    const handler = (event: MessageEvent) => {
      try {
        onSnapshot(JSON.parse(event.data));
      } catch {}
    };
    // Note: Handler function that runs whenever a named server-sent event arrives
    eventSource.addEventListener("snapshot", handler);
    return () => {
      eventSource.removeEventListener("snapshot", handler as any);
      eventSource.close();
    };
  }, [onSnapshot]);
}
