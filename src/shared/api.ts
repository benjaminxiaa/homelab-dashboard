export interface HealthCheck {
    status: "up";
    time: number;
}

export type ServiceCheck =
    | {
          status: "up";
          latencyMs: number;
          checkedAt: number;
      }
    | {
          status: "down";
          checkedAt: number;
          error: string;
      };

export type ServiceStatuses = Record<string, ServiceCheck>;

export interface DashboardConfig {
    groups: DashboardGroup[];
}

export interface DashboardGroup {
    name: string;
    services: DashboardService[];
}

export interface DashboardService {
    id: string;
    name: string;
    url: string;
    description?: string;
    icon?: string;
}

export function isDashboardService(value: unknown): value is DashboardService {
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        typeof value.id === "string" &&
        "name" in value &&
        typeof value.name === "string" &&
        "url" in value &&
        typeof value.url === "string" &&
        (!("description" in value) || typeof value.description === "string") &&
        (!("icon" in value) || typeof value.icon === "string")
    );
}

export function isDashboardGroup(value: unknown): value is DashboardGroup {
    return (
        typeof value === "object" &&
        value !== null &&
        "name" in value &&
        typeof value.name === "string" &&
        "services" in value &&
        Array.isArray(value.services) &&
        value.services.every(isDashboardService)
    );
}

export function isDashboardConfig(value: unknown): value is DashboardConfig {
    return (
        typeof value === "object" &&
        value !== null &&
        "groups" in value &&
        Array.isArray(value.groups) &&
        value.groups.every(isDashboardGroup)
    );
}

export function isServiceCheck(value: unknown): value is ServiceCheck {
    return (
        typeof value === "object" &&
        value !== null &&
        "status" in value &&
        "checkedAt" in value &&
        typeof value.checkedAt === "number" &&
        (("latencyMs" in value && typeof value.latencyMs === "number" && value.status === "up") ||
            ("error" in value && value.status === "down" && typeof value.error === "string"))
    );
}

export function isServiceStatuses(value: unknown): value is ServiceStatuses {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.values(value).every((entry) => isServiceCheck(entry))
    );
}
