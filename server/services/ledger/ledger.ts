import { and, desc, eq, gte, lt } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';

import { type Month } from '~/lib/formatters/date';
import { getMonthWindow } from '~/server/lib/date';
import { db, ledgerEntry, user } from '~/server/db';

export type LedgerEntryRecord = {
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

export type FetchLedgerEntriesByMonthParams = {
  month: Month;
  year: number;
  timeZone: string;
};

const personUser = alias(user, 'person_user');

export async function fetchLedgerEntriesByMonth(
  params: FetchLedgerEntriesByMonthParams
): Promise<LedgerEntryRecord[]> {
  const { month, year, timeZone } = params;
  const { start, end } = getMonthWindow(month, timeZone, year);

  const ledgerEntries = await db
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
    .where(and(gte(ledgerEntry.createdAt, start), lt(ledgerEntry.createdAt, end)))
    .orderBy(desc(ledgerEntry.createdAt));

  return ledgerEntries;
}
