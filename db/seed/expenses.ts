import { db, schema } from "~/db";

import { getUserByEmail } from "./users";

// 5 expenses for current month (March 2026) and 5 for previous month (February 2026)
function buildExpenses(userId: string) {
  const now = Date.now();

  return [
    // March 2026
    {
      userId,
      categoryId: 1,
      amount: 1250,
      currency: "INR",
      date: "2026-03-05",
      tag: "lunch",
      comment: "Team lunch",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      categoryId: 2,
      amount: 450,
      currency: "INR",
      date: "2026-03-10",
      tag: null,
      comment: "Cab to office",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      categoryId: 5,
      amount: 8990,
      currency: "INR",
      date: "2026-03-12",
      tag: "electricity",
      comment: "Monthly electricity bill",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      categoryId: 4,
      amount: 2999,
      currency: "INR",
      date: "2026-03-18",
      tag: "subscription",
      comment: "Streaming subscription",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      categoryId: 3,
      amount: 15000,
      currency: "INR",
      date: "2026-03-20",
      tag: "rent",
      comment: "Monthly rent",
      createdAt: now,
      updatedAt: now,
    },
    // February 2026 (previous month)
    {
      userId,
      categoryId: 1,
      amount: 980,
      currency: "INR",
      date: "2026-02-03",
      tag: "breakfast",
      comment: "Breakfast run",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      categoryId: 2,
      amount: 650,
      currency: "INR",
      date: "2026-02-08",
      tag: null,
      comment: "Metro recharge",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      categoryId: 5,
      amount: 1299,
      currency: "INR",
      date: "2026-02-14",
      tag: "internet",
      comment: "Broadband bill",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      categoryId: 4,
      amount: 3500,
      currency: "INR",
      date: "2026-02-20",
      tag: "shopping",
      comment: "Clothes",
      createdAt: now,
      updatedAt: now,
    },
    {
      userId,
      categoryId: 3,
      amount: 15000,
      currency: "INR",
      date: "2026-02-01",
      tag: "rent",
      comment: "Monthly rent",
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export async function seedExpenses() {
  const user = await getUserByEmail("s@cnd.com");
  const expenses = buildExpenses(user.id);

  await db.insert(schema.expenses).values(expenses).onConflictDoNothing();

  console.log(`✓ Seeded ${expenses.length} expenses for ${user.email}`);
}
