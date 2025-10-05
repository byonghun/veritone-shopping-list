import express from "express";
import { nanoid } from "nanoid";
import type { ItemsSnapshot } from "@app/shared";
import { sseConnectionGuard } from "./middleware/rateLimit";

export const sseRouter = express.Router();

// Note: Track all subscribers to the items stream
// "keepAlive" is a timer that is used to handle
// periodic comments so that proxies and load balancers
// do not close the connection
type Client = { id: string; res: express.Response; keepAlive: NodeJS.Timer };
// Note: An array to store all connected clients
// Everytime a browser connects, we push a "Client"
// record into this array
// When browser disconnects, we remove the "Client" record
const itemClients: Client[] = [];

/**
 * GET /api/v1/sse/items
 * Opens a long-lived SSE connection. Server will emit "snapshot" events.
 */
sseRouter.get("/items", sseConnectionGuard, (req, res) => {
  // Required SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  // Don't cachce this response and do not transform it
  res.setHeader("Cache-Control", "no-cache, no-transform");
  // Important as this asks the underlying connection to remain open
  res.setHeader("Connection", "keep-alive");

  // Note: In server-sent events, any line starting with ":" a colon is a
  // comment for keep-alive purposes
  res.write(`: connected ${new Date().toISOString()}\n\n`);

  // Periodic comment to keep the connection alive through proxies/load balancers
  const keepAlive = setInterval(() => {
    try {
      res.write(`: ping ${Date.now()}\n\n`);
    } catch {}
  }, 25000);

  const id = nanoid();

  // Note: Stores this client in the global list so we can
  // broadcast events to it
  itemClients.push({ id, res, keepAlive });

  // Register a listener for the request's "close" event
  // Note: this runs when the browser disconnects, the network drops,
  // or the server descides to end the connection
  req.on("close", () => {
    // Stops the repeating keep-alive timer for this client
    clearInterval(keepAlive);
    const itemClient = itemClients.findIndex((client) => client.id === id);
    if (itemClient !== -1) itemClients.splice(itemClient, 1);
  });
});

/** Broadcast a full items snapshot to every connected client */
export function sseBroadcastItems(snapshot: ItemsSnapshot) {
  const msg = `event: snapshot\ndata: ${JSON.stringify(snapshot)}\n\n`;
  for (const itemClient of itemClients) {
    try {
      itemClient.res.write(msg);
    } catch {
      /* ignore broken pipes */
    }
  }
}
