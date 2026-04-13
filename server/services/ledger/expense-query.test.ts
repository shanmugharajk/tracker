import { describe, expect, test } from 'bun:test';

import {
  selectExpenseRecords,
  type LedgerEntryRecord,
} from '~/server/services/ledger';

function createLedgerEntry(
  overrides: Partial<LedgerEntryRecord> & Pick<LedgerEntryRecord, 'id'>
): LedgerEntryRecord {
  return {
    type: 'expense',
    settlementFor: null,
    personId: null,
    personName: null,
    category: 'Groceries',
    tags: null,
    amount: 0,
    paidByUserId: null,
    paidByUserName: null,
    isSplit: false,
    createdAt: new Date('2026-04-01T12:00:00.000Z'),
    ...overrides,
  };
}

describe('selectExpenseRecords', () => {
  test('keeps expense rows and optionally includes expense settlements', () => {
    const entries = [
      createLedgerEntry({ id: 'expense', type: 'expense' }),
      createLedgerEntry({
        id: 'expense-settlement',
        type: 'settlement',
        settlementFor: 'expense',
      }),
      createLedgerEntry({
        id: 'loan-settlement',
        type: 'settlement',
        settlementFor: 'loan',
      }),
      createLedgerEntry({ id: 'borrow', type: 'borrow' }),
    ];

    expect(selectExpenseRecords(entries).length).toBe(1);
    expect(selectExpenseRecords(entries, true).map((entry) => entry.id)).toEqual([
      'expense',
      'expense-settlement',
    ]);
  });
});
