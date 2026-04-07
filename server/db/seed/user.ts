import { eq } from 'drizzle-orm';

import { env } from '~/config/env';
import { auth } from '~/server/lib/auth';
import { db, user } from '~/server/db';

export async function seedUser() {
  const existing = await db
    .select()
    .from(user)
    .where(eq(user.email, env.SIGNUP_EMAIL))
    .limit(1);

  if (existing.length > 0) {
    console.log('👤 User already exists');
    return;
  }

  const newUser = await auth.api.signUpEmail({
    body: {
      email: env.SIGNUP_EMAIL,
      password: env.PASSWORD,
      name: env.USER_NAME,
    },
  });

  console.log('🌱 Seeded user:', newUser);
}
