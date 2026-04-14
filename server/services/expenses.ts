import { db, ledgerEntry } from '~/server/db';
import type { AddExpenseFormValues } from '~/app/(tracker)/add-expense/shared';

type CreateExpenseLedgerEntryInput = {
  personId: string;
  category: AddExpenseFormValues['category'];
  tags: string | null;
  amount: number;
  paidByUserId: string;
  isSplit: boolean;
  note: string | null;
  createdBy: string;
  updatedBy: string;
};

type CreateSettlementLedgerEntryInput = {
  personId: string;
  amount: number;
  paidByUserId: string;
  settlementFor: 'expense';
  createdBy: string;
  updatedBy: string;
};

export async function createExpenseLedgerEntry(
  input: CreateExpenseLedgerEntryInput
) {
  const now = new Date();

  await db.insert(ledgerEntry).values({
    id: crypto.randomUUID(),
    personId: input.personId,
    type: 'expense',
    category: input.category,
    settlementFor: null,
    tags: input.tags,
    amount: input.amount,
    paidByUserId: input.paidByUserId,
    isSplit: input.isSplit,
    note: input.note,
    createdAt: now,
    updatedAt: now,
    createdBy: input.createdBy,
    updatedBy: input.updatedBy,
  });
}

export async function createSettlementLedgerEntry(
  input: CreateSettlementLedgerEntryInput
) {
  const now = new Date();

  await db.insert(ledgerEntry).values({
    id: crypto.randomUUID(),
    personId: input.personId,
    type: 'settlement',
    category: null,
    settlementFor: input.settlementFor,
    tags: null,
    amount: input.amount,
    paidByUserId: input.paidByUserId,
    isSplit: false,
    note: null,
    createdAt: now,
    updatedAt: now,
    createdBy: input.createdBy,
    updatedBy: input.updatedBy,
  });
}
