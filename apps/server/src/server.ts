import { app } from "./app";
import { initItemsRepo } from "./modules/items/repo.instance";

// Top-level await to initialize persistence backend BEFORE the
// server starts accepting traffic.
// Note: Ensures all routes that depend on the repository are safe to call.
await initItemsRepo();

const port = Number(process.env.PORT ?? 3001);

const server = app.listen(port, () => {
  console.log(`Server listening on port:${port}`);
});

function shutdown(_signal: string) {
  server.close(() => {
    console.log("Server closed. Bye!");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
