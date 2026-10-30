import type { ReactNode } from "react";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/client/components/ui/card.tsx";
import { useNow } from "@/client/hooks/useNow.ts";
import { formatTimeAgo } from "@/client/lib/time.ts";

export type StatusState = "up" | "down" | "pending";

interface StatusCardProps {
    title: string;
    state: StatusState;
    href?: string;
    description?: string;
    checkedAt?: number;
    latencyMs?: number;
    error?: string;
    action?: ReactNode;
    /** "side" puts Checked/Response in a column on the right; "stacked" puts them along the bottom. */
    layout?: "stacked" | "side";
}

const CARD_TINT = {
    up: "bg-status-up/10 ring-status-up/40",
    down: "bg-status-down/10 ring-status-down/50",
    pending: "",
} as const;

const DOT_CLASSES = {
    up: "bg-status-up",
    down: "bg-status-down",
    pending: "bg-status-pending animate-pulse motion-reduce:animate-none",
} as const;

const TEXT_CLASSES = {
    up: "text-status-up",
    down: "text-status-down",
    pending: "text-muted-foreground",
} as const;

const LABELS = {
    up: "UP",
    down: "DOWN",
    pending: "PENDING",
} as const;

function StatusCard({
    title,
    state,
    href,
    description,
    checkedAt,
    latencyMs,
    error,
    action,
    layout = "stacked",
}: StatusCardProps) {
    const now = useNow();
    const side = layout === "side";

    return (
        <Card className={`transition-colors motion-reduce:transition-none ${CARD_TINT[state]}`}>
            <CardHeader>
                <CardTitle className="text-xs font-normal tracking-wider text-muted-foreground uppercase">
                    {href === undefined ? (
                        title
                    ) : (
                        <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-sm hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                        >
                            {title}
                        </a>
                    )}
                </CardTitle>
                {description === undefined ? null : (
                    <CardDescription className="text-xs">{description}</CardDescription>
                )}
                <CardAction className="flex items-center gap-3">
                    {action}
                    <span
                        className={`size-3 shrink-0 rounded-full ${DOT_CLASSES[state]}`}
                        aria-hidden="true"
                    />
                </CardAction>
            </CardHeader>
            <CardContent
                className={
                    side
                        ? "grid flex-1 grid-cols-[1fr_auto_1fr] items-center gap-5"
                        : "flex flex-1 flex-col gap-5"
                }
            >
                {side ? <div aria-hidden="true" /> : null}
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                    <output
                        className={`font-bold tracking-wide ${side ? "text-[clamp(2.5rem,8vh,6rem)]" : "text-[clamp(2rem,6vh,4.5rem)]"} ${TEXT_CLASSES[state]}`}
                    >
                        {LABELS[state]}
                    </output>
                    {error === undefined ? null : (
                        <p className="max-w-md text-xs wrap-break-word text-status-down">{error}</p>
                    )}
                </div>
                <dl
                    className={
                        side
                            ? "flex flex-col justify-center gap-3 justify-self-end border-l border-foreground/10 pl-5 text-right"
                            : "grid grid-cols-2 gap-3 border-t border-foreground/10 pt-4"
                    }
                >
                    <div>
                        <dt className="text-xs text-muted-foreground">Checked</dt>
                        <dd className="mt-0.5 text-sm">
                            {checkedAt === undefined ? "—" : formatTimeAgo(checkedAt, now)}
                        </dd>
                    </div>
                    <div className="text-right">
                        <dt className="text-xs text-muted-foreground">Response</dt>
                        <dd className="mt-0.5 text-sm">
                            {latencyMs === undefined ? "—" : `${Math.round(latencyMs)} ms`}
                        </dd>
                    </div>
                </dl>
            </CardContent>
        </Card>
    );
}

export default StatusCard;
