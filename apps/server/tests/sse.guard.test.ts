import http from "http";
import net from "net";
import { app } from "../src/app";

function openRawGet(path: string): Promise<{ socket: net.Socket; status: number; raw: string }> {
  return new Promise((resolve, reject) => {
    // Note: Not ideal to create per call, but fine for test
    const server = http.createServer(app);
    server.listen(0, () => {
      const port = (server.address() as any).port;
      const client = net.connect({ port }, () => {
        client.write(`GET ${path} HTTP/1.1\r\nHost: localhost\r\nConnection: keep-alive\r\n\r\n`);
      });

      let data = "";
      client.on("data", (chunk) => {
        data += chunk.toString();
        // resolve on first header chunk
        const m = data.match(/HTTP\/1\.1 (\d{3})/);
        if (m) {
          const status = parseInt(m[1], 10);
          resolve({ socket: client, status, raw: data });
          // Keep the socket open for SSE unless 429
          if (status === 429) {
            client.end();
            server.close();
          }
        }
      });

      client.on("error", (err) => {
        reject(err);
        server.close();
      });
    });
  });
}

describe("SSE concurrent connection guard", () => {
  it("Allows up to 5 concurrent connections and 429 on 6th", async () => {
    const sockets: net.Socket[] = [];
    try {
      for (let i = 1; i <= 5; i++) {
        const { socket, status } = await openRawGet("/api/v1/sse/items");
        expect(status).toBe(200);
        sockets.push(socket);
      }
      const sixth = await openRawGet("/api/v1/sse/items");
      expect(sixth.status).toBe(429);
    } finally {
      sockets.forEach((s) => s.end());
    }
  });
});
