import { getHealth } from "@/client/lib/health.ts";
import type { HealthCheck } from "@/shared/api.ts";
import { type ReactNode, useEffect, useState } from "react";
import styles from "./HealthStatus.module.css";

type HealthState =
    | { status: "pending" }
    | { status: "down"; message: string; checkedAt: number }
    | { status: "up"; data: HealthCheck; checkedAt: number; responseTimeMs: number };

function formatTime(checkTime: number, current: number): string {
    const seconds = Math.max(0, Math.floor((current - checkTime) / 1000));
    if (seconds < 5) return "just now";
    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    return `${Math.floor(minutes / 60)}h ago`;
}

function HealthStatus() {
    const [state, setState] = useState<HealthState>({ status: "pending" });
    const [now, setNow] = useState(() => Date.now());
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

    useEffect(() => {
        const intervalID = setInterval(() => setNow(Date.now()), 1000);

        return () => clearInterval(intervalID);
    }, []);

    function handleRefresh() {
        setState({ status: "pending" });
        setCheckId((id) => id + 1);
    }

    let status: ReactNode;
    switch (state.status) {
        case "pending":
            status = "Pending";
            break;

        case "down":
            status = "DOWN";
            break;

        case "up":
            status = "UP";
            break;
    }

    return (
        <section className={styles.card}>
            <header className={styles.header}>
                <h1 className={styles.title}>Backend</h1>
                <button
                    type="button"
                    onClick={handleRefresh}
                    className={styles.refresh}
                    disabled={state.status === "pending"}
                >
                    refresh
                </button>
            </header>
            <output className={styles.status}>
                <span className={`${styles.dot} ${styles[state.status]}`} aria-hidden="true" />
                {status}
            </output>
            {state.status === "down" && <p className={styles.error}>{state.message}</p>}
            <dl className={styles.meta}>
                <div>
                    <dt>Checked</dt>
                    <dd>{state.status === "pending" ? "—" : formatTime(state.checkedAt, now)}</dd>
                </div>
                <div>
                    <dt>Response</dt>
                    <dd>
                        {state.status === "up" ? `${Math.round(state.responseTimeMs)} ms` : "—"}
                    </dd>
                </div>
            </dl>
        </section>
    );
}

export default HealthStatus;
