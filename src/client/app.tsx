import HealthStatus from "@/client/components/HealthStatus.tsx";
import MachineList from "@/client/components/MachineList.tsx";
import ServiceList from "@/client/components/ServiceList.tsx";
import { useDashboard } from "@/client/hooks/useDashboard.ts";

function App() {
    const { config, statuses } = useDashboard();

    return (
        <main className="mx-auto flex h-dvh w-full flex-col gap-6 overflow-hidden px-4 py-6 sm:w-[88%] sm:px-1">
            <div className="flex shrink-0 flex-col gap-3">
                <HealthStatus />
                {config.status === "loaded" && config.data.machines.length > 0 ? (
                    <section
                        aria-label="Machines"
                        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                    >
                        <MachineList machines={config.data.machines} statuses={statuses} />
                    </section>
                ) : null}
            </div>
            <ServiceList config={config} statuses={statuses} />
        </main>
    );
}

export default App;
