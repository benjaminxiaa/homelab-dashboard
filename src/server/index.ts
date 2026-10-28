import { Hono } from "hono";

import health from "./routes/health.js";

const app = new Hono();

app.route("/api/health", health);

app.get("/", (c) => c.text("Welcome to the server!"));

export default app;
