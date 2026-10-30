import type { DashboardConfig, ServiceCheck, ServiceStatuses } from "@/shared/api.ts";

async function checkService(url: string): Promise<ServiceCheck> {
    const start = performance.now();
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
        const end = performance.now();
        await response.body?.cancel();
        return { status: "up", checkedAt: Date.now(), latencyMs: Math.round(end - start) };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { status: "down", checkedAt: Date.now(), error: message };
    }
}

export async function checkAllServices(config: DashboardConfig): Promise<ServiceStatuses> {
    const services = config.groups.flatMap((group) => group.services);

    const combined = [...config.machines, ...services];

    const targets = await Promise.all(
        combined.map(async (service) => [service.id, await checkService(service.url)] as const),
    );

    return Object.fromEntries(targets);
}
