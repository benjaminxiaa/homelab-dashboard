import { Config } from "@/server/config/schema.ts";
import * as z from "zod";
import type { DashboardConfig } from "@/shared/api.ts";

async function readPath(): Promise<string> {
    const path = Bun.env["CONFIG_PATH"] ?? "config/services.yaml";
    const file = Bun.file(path);

    if (!(await file.exists())) {
        throw new Error(`Config file not found at ${path}`);
    }

    return file.text();
}

function parseConfig(raw: string): unknown {
    try {
        return Bun.YAML.parse(raw);
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid YAML in config file: ${reason}`, { cause: error });
    }
}

function validateConfig(data: unknown): Config {
    const result = Config.safeParse(data);

    if (!result.success) {
        throw new Error(`Invalid config:\n${z.prettifyError(result.error)}`);
    }

    return result.data;
}

const slug = (str: string) =>
    str
        .toLowerCase()
        .replaceAll(/[^a-z0-9]+/gu, "-")
        .replaceAll(/^-|-$/gu, "");

function convertConfig(config: Config): DashboardConfig {
    const seenIds = new Set<string>();

    return {
        groups: Object.entries(config).map(([groupName, services]) => ({
            name: groupName,
            services: Object.entries(services).map(([serviceName, service]) => {
                const id = service.id ?? slug(serviceName);
                if (id.length === 0) {
                    throw new Error(
                        `Service "${serviceName}" in group "${groupName}" cannot be turned into an id. Need an explicit "id:"`,
                    );
                }

                if (seenIds.has(id)) {
                    throw new Error(
                        `Duplicate service id "${id}" (service "${serviceName}" in group "${groupName}")`,
                    );
                }

                seenIds.add(id);

                return {
                    ...service,
                    name: serviceName,
                    id: id,
                };
            }),
        })),
    };
}

export async function loadConfig(): Promise<DashboardConfig> {
    const text = await readPath();
    const parsed = parseConfig(text);
    const validated = validateConfig(parsed);
    return convertConfig(validated);
}
