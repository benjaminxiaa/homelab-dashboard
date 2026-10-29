import type { ServiceStatuses } from "@/shared/api.ts";
import { loadConfig } from "@/server/config/load.ts";
import { checkAllServices } from "@/server/status/check.ts";

let latest: ServiceStatuses = {};

export function getLatest(): ServiceStatuses {
    return latest;
}

async function runCheckRound(): Promise<void> {
    try {
        const config = await loadConfig();
        latest = await checkAllServices(config);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Status check round failed (keeping last results): ${message}`);
    }
}

export async function startPollingServices(intervalMs: number): Promise<never> {
    for (;;) {
        // oxlint-disable-next-line no-await-in-loop
        await runCheckRound();
        // oxlint-disable-next-line no-await-in-loop
        await Bun.sleep(intervalMs);
    }
}
