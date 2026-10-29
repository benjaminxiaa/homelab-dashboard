import { Hono } from "hono";
import { serveStatic } from "@hono/bun";

import health from "@/server/routes/health.js";
import config from "@/server/routes/config.js";
import status from "@/server/routes/status.ts";
import { startPollingServices } from "@/server/status/poller.ts";

const app = new Hono();

app.route("/api/health", health);
app.route("/api/config", config);
app.route("/api/status", status);

app.all("/api/*", (c) => c.notFound());

app.use("/*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ path: "./dist/index.html" }));

void startPollingServices(30_000);

export default app;
