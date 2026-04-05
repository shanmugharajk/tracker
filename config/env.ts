import * as z from 'zod';

const EnvSchema = z.object({
  DEV_ORIGINS: z
    .string()
    .default('localhost')
    .transform((val) => val.split(',').map((s) => s.trim())),
});

export const env = EnvSchema.parse(process.env);
