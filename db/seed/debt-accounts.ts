import { db, schema } from "~/db";

import { getUserByEmail } from "./users";

export async function seedDebtAccounts() {
  const luther = await getUserByEmail("luther@cnd.com");
  const caffrey = await getUserByEmail("caffrey@cnd.com");
  const now = Date.now();

  const accounts = [
    {
      userId: luther.id,
      name: "Personal Loan",
      comment: "Loan from bank",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId: luther.id,
      name: "Credit Card",
      comment: "Visa credit card dues",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId: caffrey.id,
      name: "Friend Debt",
      comment: "Borrowed from friend",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId: caffrey.id,
      name: "Car EMI",
      comment: "Monthly car installment",
      createdAt: now,
      updatedAt: now,
    },
  ];

  await db.insert(schema.debtAccounts).values(accounts).onConflictDoNothing();

  console.log(`✓ Seeded ${accounts.length} debt accounts`);
}
