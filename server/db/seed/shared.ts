export const SEED_USER_ROLES = ['primary', 'secondary', 'tertiary'] as const;

export type SeedUserRole = (typeof SEED_USER_ROLES)[number];
export type SeedUserIds = Record<SeedUserRole, string>;
