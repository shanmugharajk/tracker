import { sql } from "drizzle-orm";

import { db, schema } from "~/db";
import { auth } from "~/lib/auth";

const TEST_USER = {
  email: "s@cnd.com",
  password: "shan@1234",
  name: "Test User",
};

const CATEGORIES = [
  { id: 1, name: "Food", emoji: "🍔", color: "#F97316", sortOrder: 1 },
  { id: 2, name: "Transport", emoji: "🚗", color: "#3B82F6", sortOrder: 2 },
  { id: 3, name: "Home", emoji: "🏠", color: "#22C55E", sortOrder: 3 },
  { id: 4, name: "Lifestyle", emoji: "✨", color: "#A855F7", sortOrder: 4 },
  { id: 5, name: "Bills", emoji: "⚡", color: "#EAB308", sortOrder: 5 },
];

async function seedCategories() {
  await db
    .insert(schema.categories)
    .values(CATEGORIES)
    .onConflictDoUpdate({
      target: schema.categories.id,
      set: {
        name: sql`excluded.name`,
        emoji: sql`excluded.emoji`,
        color: sql`excluded.color`,
        sortOrder: sql`excluded.sort_order`,
      },
    });

  console.log("✓ Seeded categories");
}

async function seedTestUser() {
  try {
    // Check if user already exists
    const existingUser = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.email, TEST_USER.email),
    });

    if (existingUser) {
      console.log(
        `✓ Test user already exists: ${TEST_USER.email} (password: ${TEST_USER.password})`,
      );
      return;
    }

    // Use better-auth to create user with password hashing
    await auth.api.signUpEmail({
      body: {
        email: TEST_USER.email,
        password: TEST_USER.password,
        name: TEST_USER.name,
      },
      asResponse: false,
    });

    console.log(
      `✓ Seeded test user: ${TEST_USER.email} (password: ${TEST_USER.password})`,
    );
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

async function main() {
  try {
    await seedTestUser();
    await seedCategories();
    console.log("\n🌱 ✓ All seeds completed successfully");
  } catch (error) {
    console.error("✗ Seeding failed:", error);
    process.exit(1);
  }
}

main();
