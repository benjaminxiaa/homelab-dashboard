import { isServiceStatuses, type ServiceStatuses } from "@/shared/api.ts";

async function errorMessage(response: Response): Promise<string> {
    try {
        const body: unknown = await response.json();
        if (
            typeof body === "object" &&
            body !== null &&
            "error" in body &&
            typeof body.error === "string"
        ) {
            return body.error;
        }
    } catch {
        // body wasn't JSON; fall through to the status code
    }
    return `Request failed with status ${response.status}`;
}

export async function getStatuses(): Promise<ServiceStatuses> {
    const response = await fetch("/api/status");

    if (!response.ok) {
        throw new Error(await errorMessage(response));
    }

    const data: unknown = await response.json();

    if (!isServiceStatuses(data)) {
        throw new Error("Unexpected response shape from /api/status");
    }

    return data;
}
