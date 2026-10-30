import { useEffect, useState } from "react";
import { getConfig } from "@/client/lib/config.ts";
import { getStatuses } from "@/client/lib/status.ts";
import type { DashboardConfig, ServiceStatuses } from "@/shared/api.ts";

export type ConfigState =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "loaded"; data: DashboardConfig };

const STATUS_POLL_MS = 5000;

export function useDashboard(): { config: ConfigState; statuses: ServiceStatuses } {
    const [config, setConfig] = useState<ConfigState>({ status: "loading" });
    const [statuses, setStatuses] = useState<ServiceStatuses>({});

    useEffect(() => {
        let ignore = false;

        async function fetchConfig() {
            try {
                const data = await getConfig();
                if (!ignore) {
                    setConfig({ status: "loaded", data });
                }
            } catch (error) {
                if (!ignore) {
                    setConfig({
                        status: "error",
                        message: error instanceof Error ? error.message : "Unknown Error",
                    });
                }
            }
        }

        void fetchConfig();

        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        let ignore = false;

        async function refresh() {
            try {
                const latest = await getStatuses();
                if (!ignore) {
                    setStatuses(latest);
                }
            } catch {
                // Keep the last known statuses when a poll fails.
            }
        }

        void refresh();
        const intervalId = setInterval(() => {
            void refresh();
        }, STATUS_POLL_MS);

        return () => {
            ignore = true;
            clearInterval(intervalId);
        };
    }, []);

    return { config, statuses };
}
