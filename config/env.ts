import { z } from 'zod';

const EnvSchema = z.object({
  DEV_ORIGINS: z
    .string()
    .default('localhost')
    .transform((val) => val.split(',').map((s) => s.trim())),

  DATABASE_URL: z.string().min(5),

  SEED_USER_NAMES: z
    .string()
    .default('shan')
    .transform((val) => val.split(',').map((s) => s.trim())),
});

export const env = EnvSchema.parse(process.env);
