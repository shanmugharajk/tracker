import { and, desc, eq, gte, lt, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';

import { type Month } from '~/lib/formatters/date';
import { getMonthWindow } from '~/server/lib/date';
import { db, ledgerEntry, user } from '~/server/db';

export type ExpenseRecord = {
  id: string;
  type: (typeof ledgerEntry.$inferSelect)['type'];
  settlementFor: 'expense' | 'loan' | null;
  personId: string | null;
  personName: string | null;
  category: string | null;
  tags: string | null;
  amount: number;
  paidByUserId: string | null;
  paidByUserName: string | null;
  isSplit: boolean;
  createdAt: Date;
};

export type FetchExpensesByMonthParams = {
  month: Month;
  year: number;
  timeZone: string;
  includeSettlement?: boolean;
};

const personUser = alias(user, 'person_user');

function getExpenseTypeFilter(includeSettlement: boolean) {
  if (!includeSettlement) {
    return eq(ledgerEntry.type, 'expense');
  }

  return or(
    eq(ledgerEntry.type, 'expense'),
    and(
      eq(ledgerEntry.type, 'settlement'),
      eq(ledgerEntry.settlementFor, 'expense')
    )
  );
}

export async function fetchExpensesByMonth(
  params: FetchExpensesByMonthParams
): Promise<ExpenseRecord[]> {
  const { month, year, timeZone, includeSettlement = false } = params;
  const { start, end } = getMonthWindow(month, timeZone, year);

  const expenses = await db
    .select({
      id: ledgerEntry.id,
      type: ledgerEntry.type,
      settlementFor: ledgerEntry.settlementFor,
      personId: ledgerEntry.personId,
      personName: personUser.name,
      category: ledgerEntry.category,
      tags: ledgerEntry.tags,
      amount: ledgerEntry.amount,
      paidByUserId: ledgerEntry.paidByUserId,
      paidByUserName: user.name,
      isSplit: ledgerEntry.isSplit,
      createdAt: ledgerEntry.createdAt,
    })
    .from(ledgerEntry)
    .leftJoin(personUser, eq(ledgerEntry.personId, personUser.id))
    .leftJoin(user, eq(ledgerEntry.paidByUserId, user.id))
    .where(
      and(
        getExpenseTypeFilter(includeSettlement),
        gte(ledgerEntry.createdAt, start),
        lt(ledgerEntry.createdAt, end)
      )
    )
    .orderBy(desc(ledgerEntry.createdAt));

  return expenses;
}
