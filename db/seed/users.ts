import { db } from "~/db";
import { auth } from "~/lib/auth";

export const TEST_USERS = [
  { email: "s@cnd.com", password: "shan@1234", name: "Test User" },
  { email: "luther@cnd.com", password: "luther@1234", name: "Luther" },
  { email: "caffrey@cnd.com", password: "caffrey@1234", name: "Caffrey" },
];

async function seedUser(user: (typeof TEST_USERS)[number]) {
  const existing = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.email, user.email),
  });

  if (existing) {
    console.log(`✓ User already exists: ${user.email}`);
    return;
  }

  await auth.api.signUpEmail({
    body: { email: user.email, password: user.password, name: user.name },
    asResponse: false,
  });

  console.log(`✓ Seeded user: ${user.email} (password: ${user.password})`);
}

export async function seedUsers() {
  for (const user of TEST_USERS) {
    await seedUser(user);
  }
}

export async function getUserByEmail(email: string) {
  const u = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });
  if (!u) throw new Error(`User not found: ${email}`);
  return u;
}
