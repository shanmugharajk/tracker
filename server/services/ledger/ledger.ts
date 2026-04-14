import { and, desc, eq, gte, lt } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';

import { type Month } from '~/lib/formatters/date';
import { getMonthWindow } from '~/server/lib/date';
import { db, ledgerEntry, user } from '~/server/db';

export type LedgerEntryRecord = {
  id: string;
  category: string;
  tags: string | null;
  amount: number;
  paidByUserId: string;
  paidByUserName: string | null;
  note: string | null;
  createdAt: Date;
};

export type ExpenseRecord = LedgerEntryRecord;

export type FetchLedgerEntriesByMonthParams = {
  month: Month;
  year: number;
  timeZone: string;
};

const paidByUser = alias(user, 'paid_by_user');

export async function fetchLedgerEntriesByMonth(
  params: FetchLedgerEntriesByMonthParams
): Promise<LedgerEntryRecord[]> {
  const { month, year, timeZone } = params;
  const { start, end } = getMonthWindow(month, timeZone, year);

  const ledgerEntries = await db
    .select({
      id: ledgerEntry.id,
      category: ledgerEntry.category,
      tags: ledgerEntry.tags,
      amount: ledgerEntry.amount,
      paidByUserId: ledgerEntry.paidByUserId,
      paidByUserName: paidByUser.name,
      note: ledgerEntry.note,
      createdAt: ledgerEntry.createdAt,
    })
    .from(ledgerEntry)
    .innerJoin(paidByUser, eq(ledgerEntry.paidByUserId, paidByUser.id))
    .where(and(gte(ledgerEntry.createdAt, start), lt(ledgerEntry.createdAt, end)))
    .orderBy(desc(ledgerEntry.createdAt));

  return ledgerEntries;
}
