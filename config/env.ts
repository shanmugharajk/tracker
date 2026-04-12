import { z } from 'zod';

const SeedUserNamesSchema = z.string().transform((val, ctx) => {
  const names = val.split(',').map((s) => s.trim());

  if (names.length !== 3 || names.some((name) => name.length === 0)) {
    ctx.addIssue({
      code: 'custom',
      message: 'SEED_USER_NAMES must contain exactly three usernames.',
    });
    return z.NEVER;
  }

  if (new Set(names).size !== names.length) {
    ctx.addIssue({
      code: 'custom',
      message: 'SEED_USER_NAMES must not contain duplicate usernames.',
    });
    return z.NEVER;
  }

  return names as unknown as readonly [string, string, string];
});

const EnvSchema = z.object({
  DEV_ORIGINS: z
    .string()
    .default('localhost')
    .transform((val) => val.split(',').map((s) => s.trim())),

  DATABASE_URL: z.string().min(5),

  SEED_USER_NAMES: SeedUserNamesSchema,
});

export const env = EnvSchema.parse(process.env);
