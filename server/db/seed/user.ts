import { env } from '~/config/env';
import { auth } from '~/server/lib/auth';

import { SEED_USER_ROLES, type SeedUserIds } from './shared';

export type SeedUserNames = readonly [string, string, string];

export const createSeedEmail = (username: string) =>
  `${username.trim().toLowerCase()}@mail.com`;

export async function seedUser(
  userNames: SeedUserNames = env.SEED_USER_NAMES
): Promise<SeedUserIds> {
  const seededUsers = {} as SeedUserIds;

  for (const [index, name] of userNames.entries()) {
    const email = createSeedEmail(name);
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password: `${name.toLowerCase()}@1234`,
      },
    });

    if (!result?.user?.id) {
      throw new Error(`Failed to seed user: ${name}.`);
    }

    seededUsers[SEED_USER_ROLES[index]] = result.user.id;
  }

  console.log(`👤 Seeded users: ${userNames.join(', ')}`);
  return seededUsers;
}
