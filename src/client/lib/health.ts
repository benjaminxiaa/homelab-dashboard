import type { HealthCheck } from "@/shared/api.ts";

export type Health = {
    data: HealthCheck;
    responseTimeMs: number;
};

function isHealth(data: unknown): data is HealthCheck {
    return (
        typeof data === "object" &&
        data !== null &&
        "time" in data &&
        "status" in data &&
        data.status === "up" &&
        typeof data.time === "number"
    );
}

export async function getHealth(): Promise<Health> {
    const start = performance.now();
    const response = await fetch("/api/health");

    if (!response.ok) {
        throw new Error(`Health check failed with status ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!isHealth(data)) {
        throw new Error("Unexpected response shape from /api/health");
    }

    const end = performance.now();

    return { data, responseTimeMs: end - start };
}
