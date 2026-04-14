import { db, ledgerEntry } from '~/server/db';
import type { AddExpenseFormValues } from '~/app/(tracker)/add-expense/shared';

type CreateExpenseLedgerEntryInput = {
  category: AddExpenseFormValues['category'];
  tags: string | null;
  amount: number;
  paidByUserId: string;
  note: string | null;
  createdBy: string;
  updatedBy: string;
};

export async function createExpenseLedgerEntry(
  input: CreateExpenseLedgerEntryInput
) {
  const now = new Date();

  await db.insert(ledgerEntry).values({
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
