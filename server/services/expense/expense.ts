import { and, desc, eq, gte, lt } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';

import { type Month } from '~/lib/formatters/date';
import { getMonthWindow } from '~/server/lib/date';
import { db, expenseEntry, user } from '~/server/db';

export type ExpenseEntryRecord = {
  id: string;
  category: string;
  tags: string | null;
  amount: number;
  paidByUserId: string;
  paidByUserName: string | null;
  note: string | null;
  createdAt: Date;
};

export type ExpenseRecord = ExpenseEntryRecord;

export type FetchExpenseEntriesByMonthParams = {
  month: Month;
  year: number;
  timeZone: string;
};

const paidByUser = alias(user, 'paid_by_user');

export async function fetchExpenseEntriesByMonth(
  params: FetchExpenseEntriesByMonthParams
): Promise<ExpenseEntryRecord[]> {
  const { month, year, timeZone } = params;
  const { start, end } = getMonthWindow(month, timeZone, year);

  const expenseEntries = await db
    .select({
      id: expenseEntry.id,
      category: expenseEntry.category,
      tags: expenseEntry.tags,
      amount: expenseEntry.amount,
      paidByUserId: expenseEntry.paidByUserId,
      paidByUserName: paidByUser.name,
      note: expenseEntry.note,
      createdAt: expenseEntry.createdAt,
    })
    .from(expenseEntry)
    .innerJoin(paidByUser, eq(expenseEntry.paidByUserId, paidByUser.id))
    .where(and(gte(expenseEntry.createdAt, start), lt(expenseEntry.createdAt, end)))
    .orderBy(desc(expenseEntry.createdAt));

  return expenseEntries;
}
