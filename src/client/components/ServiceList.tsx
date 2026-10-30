import type { ServiceCheck, ServiceStatuses } from "@/shared/api.ts";
import type { ConfigState } from "@/client/hooks/useDashboard.ts";
import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card.tsx";

interface ServiceListProps {
    config: ConfigState;
    statuses: ServiceStatuses;
}

const DOT_CLASSES = {
    up: "bg-status-up",
    down: "bg-status-down",
    pending: "bg-status-pending animate-pulse motion-reduce:animate-none",
} as const;

function statusTitle(check: ServiceCheck | undefined): string {
    if (check === undefined) {
        return "Not checked yet";
    }
    if (check.status === "up") {
        return `Up, ${check.latencyMs} ms`;
    }
    return `Down: ${check.error}`;
}

function ServiceList({ config: state, statuses }: ServiceListProps) {
    if (state.status === "loading") {
        return <p className="text-sm text-muted-foreground">Loading services…</p>;
    }

    if (state.status === "error") {
        return (
            <section>
                <h2 className="mb-3 text-xs tracking-wider text-muted-foreground uppercase">
                    Could not load services
                </h2>
                <Card size="sm">
                    <CardContent>
                        <pre className="font-mono text-xs wrap-break-word whitespace-pre-wrap text-destructive">
                            {state.message}
                        </pre>
                    </CardContent>
                </Card>
            </section>
        );
    }

    const { groups } = state.data;

    if (groups.length === 0) {
        return <p className="text-sm text-muted-foreground">No services configured.</p>;
    }

    return (
        <div className="-m-1 flex min-h-0 flex-1 flex-col gap-6 overflow-hidden p-1">
            {groups.map((group) => (
                <section key={group.name}>
                    <h2 className="mb-3 text-xs tracking-wider text-muted-foreground uppercase">
                        {group.name}
                    </h2>
                    {group.services.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No services in this group.</p>
                    ) : (
                        <ul className="grid grid-cols-2 items-start gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {group.services.map((service) => {
                                const check = statuses[service.id];
                                const dotState = check?.status ?? "pending";
                                const hasBody =
                                    service.description !== undefined || check?.status === "down";

                                return (
                                    <li key={service.id}>
                                        <a
                                            className="group block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                                            href={service.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            title={statusTitle(check)}
                                        >
                                            <Card className="transition-shadow group-hover:ring-foreground/25 motion-reduce:transition-none">
                                                <CardHeader className="flex items-center gap-2">
                                                    <span
                                                        className={`size-2.5 shrink-0 rounded-full ${DOT_CLASSES[dotState]}`}
                                                        aria-hidden="true"
                                                    />
                                                    <CardTitle className="min-w-0 flex-1 truncate text-base font-bold">
                                                        {service.name}
                                                    </CardTitle>
                                                    {check?.status === "up" ? (
                                                        <span className="shrink-0 text-sm text-muted-foreground">
                                                            {check.latencyMs} ms
                                                        </span>
                                                    ) : null}
                                                    <span className="sr-only">
                                                        {statusTitle(check)}
                                                    </span>
                                                </CardHeader>
                                                {hasBody ? (
                                                    <CardContent className="flex flex-col gap-1">
                                                        {service.description ===
                                                        undefined ? null : (
                                                            <p className="text-sm text-muted-foreground">
                                                                {service.description}
                                                            </p>
                                                        )}
                                                        {check?.status === "down" ? (
                                                            <p className="text-sm wrap-break-word text-destructive">
                                                                {check.error}
                                                            </p>
                                                        ) : null}
                                                    </CardContent>
                                                ) : null}
                                            </Card>
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
