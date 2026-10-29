import * as z from "zod";

const Service = z
    .object({
        url: z.url(),
        description: z.string().optional(),
        icon: z.string().optional(),
        id: z.string().min(1).optional(),
    })
    .strict();

const Group = z.record(z.string(), Service);

export const Config = z.record(z.string(), Group);
export type Config = z.infer<typeof Config>;
