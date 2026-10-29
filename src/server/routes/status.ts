import { Hono } from "hono";
import { getLatest } from "@/server/status/poller.ts";

const status = new Hono();

status.get("/", (c) => c.json(getLatest()));

export default status;
