import { app } from "./app";
import { initItemsRepo } from "./modules/items/repo.instance";

await initItemsRepo();

const port = Number(process.env.PORT ?? 3001);

const server = app.listen(port, () => {
  console.log(`Server listening on port:${port}`);
});

function shutdown(signal: string) {
  // eslint-disable-next-line no-console
  console.log(`Server received ${signal}, closing...`);
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log("Server closed. Bye!");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));