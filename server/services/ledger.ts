import { and, desc, eq, gte, lt } from 'drizzle-orm';

import { getMonthWindow } from '~/server/lib/date';
import { db, ledgerEntry, user } from '~/server/db';

export type ExpenseRecord = {
  id: string;
  category: string | null;
  tags: string | null;
  amount: number;
  paidByUserName: string | null;
  isSplit: boolean;
  createdAt: Date;
};

export async function fetchExpensesByMonth(
  month?: string | null,
  timeZone?: string | null,
  year?: number | string | null
): Promise<ExpenseRecord[]> {
  const { start, end } = getMonthWindow(month, timeZone, year);

  const expenses = await db
    .select({
      id: ledgerEntry.id,
      category: ledgerEntry.category,
      tags: ledgerEntry.tags,
      amount: ledgerEntry.amount,
      paidByUserName: user.name,
      isSplit: ledgerEntry.isSplit,
      createdAt: ledgerEntry.createdAt,
    })
    .from(ledgerEntry)
    .leftJoin(user, eq(ledgerEntry.paidByUserId, user.id))
    .where(
      and(
        eq(ledgerEntry.type, 'expense'),
        gte(ledgerEntry.createdAt, start),
        lt(ledgerEntry.createdAt, end)
      )
    )
    .orderBy(desc(ledgerEntry.createdAt));

  return expenses;
}
