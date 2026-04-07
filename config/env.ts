import { z } from 'zod';

const EnvSchema = z.object({
  DEV_ORIGINS: z
    .string()
    .default('localhost')
    .transform((val) => val.split(',').map((s) => s.trim())),

  DATABASE_URL: z.string().min(5),

  USER_NAME: z.string().min(4),
  SIGNUP_EMAIL: z.email(),
  PASSWORD: z.string().min(5),
});

export const env = EnvSchema.parse(process.env);
