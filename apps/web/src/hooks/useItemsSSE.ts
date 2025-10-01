import { useEffect } from "react";
import { UIItemsSnapshot } from "@app/shared";

export function useItemsSSE(onSnapshot: (s: UIItemsSnapshot) => void) {
  useEffect(() => {
    // Note: Creates a new browser EventSource object that connects
    // to the "/api/v1/sse/items"
    // Opens a long-lived connection using server-sent events
    // to the same web origin that served the page.
    const eventSource = new EventSource("/api/v1/sse/items");
    const handleSnapshot: EventListener = (event) => {
      const msg = event as MessageEvent<string>;
      try {
        const data = JSON.parse(msg.data) as UIItemsSnapshot;
        onSnapshot(data);
      } catch {
        // ignore malformed payloads
      }
    };
    // Note: Handler function that runs whenever a named server-sent event arrives
    eventSource.addEventListener("snapshot", handleSnapshot);
    return () => {
      eventSource.removeEventListener("snapshot", handleSnapshot);
      eventSource.close();
    };
  }, [onSnapshot]);
}
