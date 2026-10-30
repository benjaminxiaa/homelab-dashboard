import StatusCard from "@/client/components/StatusCard.tsx";
import type { DashboardMachine, ServiceStatuses } from "@/shared/api.ts";

interface MachineListProps {
    machines: DashboardMachine[];
    statuses: ServiceStatuses;
}

function MachineList({ machines, statuses }: MachineListProps) {
    return machines.map((machine) => {
        const check = statuses[machine.id];

        return (
            <StatusCard
                key={machine.id}
                title={machine.name}
                href={machine.url}
                description={machine.description}
                state={check?.status ?? "pending"}
                checkedAt={check?.checkedAt}
                latencyMs={check?.status === "up" ? check.latencyMs : undefined}
                error={check?.status === "down" ? check.error : undefined}
            />
        );
    });
}

export default MachineList;
