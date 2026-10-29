import type { DashboardConfig, ServiceCheck, ServiceStatuses } from "@/shared/api.ts";
import { useEffect, useState } from "react";
import { getConfig } from "@/client/lib/config.ts";
import styles from "./ServiceList.module.css";
import { getStatuses } from "@/client/lib/status.ts";

type ServiceList =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "loaded"; data: DashboardConfig };

function statusTitle(check: ServiceCheck | undefined): string {
    if (check === undefined) {
        return "Not checked yet";
    }
    if (check.status === "up") {
        return `Up, ${check.latencyMs} ms`;
    }
    return `Down: ${check.error}`;
}

function ServiceList() {
    const [state, setState] = useState<ServiceList>({ status: "loading" });
    const [statuses, setStatuses] = useState<ServiceStatuses>({});

    useEffect(() => {
        let ignore = false;

        async function fetchConfig() {
            try {
                const config = await getConfig();
                if (!ignore) {
                    setState({
                        status: "loaded",
                        data: config,
                    });
                }
            } catch (error) {
                if (!ignore) {
                    setState({
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
        }, 5000);

        return () => {
            ignore = true;
            clearInterval(intervalId);
        };
    }, []);

    if (state.status === "loading") {
        return <p className={styles.message}>Loading services…</p>;
    }

    if (state.status === "error") {
        return (
            <section className={styles.group}>
                <h2 className={styles.groupTitle}>Could not load services</h2>
                <pre className={styles.error}>{state.message}</pre>
            </section>
        );
    }

    const { groups } = state.data;

    if (groups.length === 0) {
        return <p className={styles.message}>No services configured.</p>;
    }

    return (
        <div className={styles.list}>
            {groups.map((group) => (
                <section key={group.name} className={styles.group}>
                    <h2 className={styles.groupTitle}>{group.name}</h2>
                    {group.services.length === 0 ? (
                        <p className={styles.message}>No services in this group.</p>
                    ) : (
                        <ul className={styles.grid}>
                            {group.services.map((service) => {
                                const check = statuses[service.id];
                                const dotState = check?.status ?? "pending";

                                return (
                                    <li key={service.id}>
                                        <a
                                            className={styles.card}
                                            href={service.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            title={statusTitle(check)}
                                        >
                                            <span className={styles.header}>
                                                <span
                                                    className={`${styles.dot} ${styles[dotState]}`}
                                                    aria-hidden="true"
                                                />
                                                <span className={styles.name}>{service.name}</span>
                                                {check?.status === "up" ? (
                                                    <span className={styles.latency}>
                                                        {check.latencyMs} ms
                                                    </span>
                                                ) : null}
                                            </span>
                                            <span className={styles.srOnly}>
                                                {statusTitle(check)}
                                            </span>
                                            {service.description === undefined ? null : (
                                                <span className={styles.description}>
                                                    {service.description}
                                                </span>
                                            )}
                                            {check?.status === "down" ? (
                                                <span className={styles.downReason}>
                                                    {check.error}
                                                </span>
                                            ) : null}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            ))}
        </div>
    );
}

export default ServiceList;
