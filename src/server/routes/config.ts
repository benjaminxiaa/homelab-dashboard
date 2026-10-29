import { Hono } from "hono";
import { loadConfig } from "@/server/config/load.ts";

const config = new Hono();

config.get("/", async (c) => {
    try {
        const data = await loadConfig();
        return c.json(data);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return c.json({ error: message }, 500);
    }
});

export default config;
