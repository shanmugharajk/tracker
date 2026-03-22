import { db } from "~/db";
import { auth } from "~/lib/auth";

const TEST_USER = {
  email: "s@cnd.com",
  password: "shan@1234",
  name: "Test User",
};

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

seedTestUser();
