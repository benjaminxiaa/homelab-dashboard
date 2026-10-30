import { getHealth } from "@/client/lib/health.ts";
import type { HealthCheck } from "@/shared/api.ts";
import { useEffect, useState } from "react";
import { Button } from "@/client/components/ui/button.tsx";
import StatusCard from "@/client/components/StatusCard.tsx";

type HealthState =
    | { status: "pending" }
    | { status: "down"; message: string; checkedAt: number }
    | { status: "up"; data: HealthCheck; checkedAt: number; responseTimeMs: number };

function HealthStatus() {
    const [state, setState] = useState<HealthState>({ status: "pending" });
    const [checkId, setCheckId] = useState(0);

    useEffect(() => {
        let ignore = false;

        async function fetchHealthStatus() {
            try {
                const health = await getHealth();
                if (!ignore)
                    setState({
                        status: "up",
                        data: health.data,
                        checkedAt: Date.now(),
                        responseTimeMs: health.responseTimeMs,
                    });
            } catch (error) {
                if (!ignore)
                    setState({
                        status: "down",
                        message: error instanceof Error ? error.message : "Unknown Error",
                        checkedAt: Date.now(),
                    });
            }
        }

        void fetchHealthStatus();

        return () => {
            ignore = true;
        };
    }, [checkId]);

    function handleRefresh() {
        setState({ status: "pending" });
        setCheckId((id) => id + 1);
    }

    return (
        <StatusCard
            title="Backend"
            layout="side"
            state={state.status}
            checkedAt={state.status === "pending" ? undefined : state.checkedAt}
            latencyMs={state.status === "up" ? state.responseTimeMs : undefined}
            error={state.status === "down" ? state.message : undefined}
            action={
                <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={handleRefresh}
                    disabled={state.status === "pending"}
                >
                    refresh
                </Button>
            }
        />
    );
}

export default HealthStatus;
