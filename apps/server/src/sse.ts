// Notes:
// Why this design
// 1. Server-sent events use a single, long-lived Hypertext Transfer Protocol (Http)
// connection per client, which is simple to implement on the server side
// compared with full bidirectional web sockets
// 2. The stream format is line-based and human-readable, so debugging
// is straightforward.
// 3. "Comment" lines (starting with a colon) and periodic pings keep intermediaries from
// closing idle connections.
// 4. A single broadcast function keeps your update logic in one place

// Alternatives
// 1. Web socket connections (full duplex, higher complexity)
// 2. Short-polling or long-polling (simpler but less efficient)
// 3. A pub/sub message broker behind the server with server-sent events
// only at the edge

// I was tasked a shopping list code challenge with no time frame, but
// there's always a limit
// My goal was to deploy/develop a MVP
// If this was a real product, I'd do that same, and iterate on top of it.
// Although, time wasn't a problem, in my opinion any application is better
// to be developed or any feature to be deployed and iterated on.
// There are times where over engineering can lead to missing deadlines
// Or even not even deploying a feature due to over complication

import express from "express";
import { nanoid } from "nanoid";

import { Item } from "./types/domain";

export type ItemsSnapshot = { items: Item[] };

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
sseRouter.get("/items", (req, res) => {
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
    try { res.write(`: ping ${Date.now()}\n\n`); } catch {}
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
