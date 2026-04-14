import { env } from '~/config/env';
import { auth } from '~/server/lib/auth';
import { db, user } from '~/server/db';
import { eq } from 'drizzle-orm';
import type { UserType } from '~/server/db/schema';

import { SEED_USER_ROLES, type SeedUserIds } from './shared';

export const createSeedEmail = (username: string) =>
  `${username.trim().toLowerCase()}@mail.com`;

export async function seedUser(
  userNames: string[] = env.SEED_USER_NAMES
): Promise<SeedUserIds> {
  const seededUsers = {} as SeedUserIds;
  const userTypes: [UserType, UserType, UserType] = [
    'expense',
    'expense',
    'loan',
  ];

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

    const userType = userTypes[index];

    await db.update(user).set({ userType }).where(eq(user.id, result.user.id));

    seededUsers[SEED_USER_ROLES[index]] = result.user.id;
  }

  console.log(`👤 Seeded users: ${userNames.join(', ')}`);
  return seededUsers;
}
