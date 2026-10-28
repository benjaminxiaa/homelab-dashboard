import { Hono } from "hono";
import { serveStatic } from "@hono/bun";

import health from "./routes/health.js";

const app = new Hono();

app.route("/api/health", health);

app.all("/api/*", (c) => c.notFound());

app.use("/*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ path: "./dist/index.html" }));

export default app;
