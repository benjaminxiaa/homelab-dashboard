import type { DashboardConfig } from "@/shared/api.ts";
import { useEffect, useState } from "react";
import { getConfig } from "@/client/lib/config.ts";
import styles from "./ServiceList.module.css";

type ServiceList =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "loaded"; data: DashboardConfig };

function ServiceList() {
    const [state, setState] = useState<ServiceList>({ status: "loading" });

    useEffect(() => {
        let ignore = false;

        async function fetchConfig() {
            try {
                const config = await getConfig();
                if (!ignore)
                    setState({
                        status: "loaded",
                        data: config,
                    });
            } catch (error) {
                if (!ignore)
                    setState({
                        status: "error",
                        message: error instanceof Error ? error.message : "Unknown Error",
                    });
            }
        }

        void fetchConfig();

        return () => {
            ignore = true;
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
                            {group.services.map((service) => (
                                <li key={service.id}>
                                    <a
                                        className={styles.card}
                                        href={service.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <span className={styles.name}>{service.name}</span>
                                        {service.description === undefined ? null : (
                                            <span className={styles.description}>
                                                {service.description}
                                            </span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            ))}
        </div>
    );
}

export default ServiceList;
