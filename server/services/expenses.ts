import { db, expenseEntry } from '~/server/db';
import type { AddExpenseFormValues } from '~/app/(tracker)/add-expense/shared';

type CreateExpenseEntryInput = {
  category: AddExpenseFormValues['category'];
  tags: string | null;
  amount: number;
  paidByUserId: string;
  note: string | null;
  createdBy: string;
  updatedBy: string;
};

export async function createExpenseEntry(
  input: CreateExpenseEntryInput
) {
  const now = new Date();

  await db.insert(expenseEntry).values({
    id: crypto.randomUUID(),
    category: input.category,
    tags: input.tags,
    amount: input.amount,
    paidByUserId: input.paidByUserId,
    note: input.note,
    createdAt: now,
    updatedAt: now,
    createdBy: input.createdBy,
    updatedBy: input.updatedBy,
  });
}
