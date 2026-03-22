import { db, schema } from "~/db";

import { getUserByEmail } from "./users";

function buildTransactions(
  accountId: number,
  entries: { amount: number; date: string; comment: string }[],
) {
  const now = Date.now();
  return entries.map((e) => ({
    debtAccountId: accountId,
    amount: e.amount,
    currency: "INR",
    date: e.date,
    comment: e.comment,
    createdAt: now,
  }));
}

export async function seedDebtTransactions() {
  const luther = await getUserByEmail("luther@cnd.com");
  const caffrey = await getUserByEmail("caffrey@cnd.com");

  const lutherAccounts = await db.query.debtAccounts.findMany({
    where: (a, { eq }) => eq(a.userId, luther.id),
  });

  const caffreyAccounts = await db.query.debtAccounts.findMany({
    where: (a, { eq }) => eq(a.userId, caffrey.id),
  });

  const lutherPersonalLoan = lutherAccounts.find(
    (a) => a.name === "Personal Loan",
  );
  const lutherCreditCard = lutherAccounts.find((a) => a.name === "Credit Card");
  const caffreyFriendDebt = caffreyAccounts.find(
    (a) => a.name === "Friend Debt",
  );
  const caffreyCarEmi = caffreyAccounts.find((a) => a.name === "Car EMI");

  if (
    !lutherPersonalLoan ||
    !lutherCreditCard ||
    !caffreyFriendDebt ||
    !caffreyCarEmi
  ) {
    throw new Error("Debt accounts not found — run seedDebtAccounts first");
  }

  const transactions = [
    ...buildTransactions(lutherPersonalLoan.id, [
      { amount: 50000, date: "2026-01-15", comment: "EMI January" },
      { amount: 50000, date: "2026-02-15", comment: "EMI February" },
      { amount: 50000, date: "2026-03-15", comment: "EMI March" },
      { amount: 5000, date: "2026-03-01", comment: "Partial prepayment" },
      { amount: 2000, date: "2026-02-28", comment: "Penalty charge" },
    ]),
    ...buildTransactions(lutherCreditCard.id, [
      { amount: 12000, date: "2026-01-20", comment: "January statement" },
      { amount: 8500, date: "2026-02-20", comment: "February statement" },
      { amount: 9300, date: "2026-03-20", comment: "March statement" },
      { amount: 3000, date: "2026-03-05", comment: "Partial payment" },
      { amount: 500, date: "2026-02-25", comment: "Late fee" },
    ]),
    ...buildTransactions(caffreyFriendDebt.id, [
      { amount: 10000, date: "2026-01-10", comment: "Borrowed for rent" },
      { amount: 5000, date: "2026-02-10", comment: "Repaid partial" },
      { amount: 2000, date: "2026-02-20", comment: "Repaid more" },
      { amount: 1000, date: "2026-03-01", comment: "Repaid instalment" },
      { amount: 2000, date: "2026-03-15", comment: "Final repayment" },
    ]),
    ...buildTransactions(caffreyCarEmi.id, [
      { amount: 18000, date: "2026-01-05", comment: "EMI January" },
      { amount: 18000, date: "2026-02-05", comment: "EMI February" },
      { amount: 18000, date: "2026-03-05", comment: "EMI March" },
      { amount: 1800, date: "2026-01-15", comment: "Insurance premium" },
      { amount: 500, date: "2026-02-15", comment: "Processing fee" },
    ]),
  ];

  await db
    .insert(schema.debtTransactions)
    .values(transactions)
    .onConflictDoNothing();

  console.log(`✓ Seeded ${transactions.length} debt transactions`);
}
