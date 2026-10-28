import { Hono } from "hono";
import type { HealthCheck } from "@/shared/api.ts";

const health = new Hono();

health.get("/", (c) => {
    const body: HealthCheck = { status: "up", time: Date.now() };
    return c.json(body);
});

export default health;