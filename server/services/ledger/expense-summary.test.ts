import { describe, expect, test } from 'bun:test';

import { summarizeExpenses, type ExpenseRecord } from '~/server/services/ledger';

const CURRENT_USER_ID = 'user-current';
const OTHER_USER_ID = 'user-other';
const THIRD_USER_ID = 'user-third';

function createExpenseRecord(
  overrides: Partial<ExpenseRecord> & Pick<ExpenseRecord, 'id'>
): ExpenseRecord {
  return {
    category: 'Groceries',
    tags: null,
    amount: 0,
    paidByUserId: CURRENT_USER_ID,
    paidByUserName: 'Current User',
    note: null,
    createdAt: new Date('2026-04-01T12:00:00.000Z'),
    ...overrides,
  };
}

describe('summarizeExpenses', () => {
  test('groups totals by payer and category', () => {
    const summary = summarizeExpenses(
      [
        createExpenseRecord({
          id: 'current-groceries',
          category: 'Groceries',
          amount: 30,
          paidByUserId: CURRENT_USER_ID,
          paidByUserName: 'Current User',
        }),
        createExpenseRecord({
          id: 'other-shopping',
          category: 'Shopping',
          amount: 20,
          paidByUserId: OTHER_USER_ID,
          paidByUserName: 'Alex',
        }),
        createExpenseRecord({
          id: 'other-bills',
          category: 'Bills',
          amount: 40,
          paidByUserId: OTHER_USER_ID,
          paidByUserName: 'Alex',
        }),
      ]
    );

    expect(summary.totalExpenses.total).toBe(90);
    expect(summary.totalExpenses.paidByUserTotals).toEqual([
      { id: OTHER_USER_ID, name: 'Alex', total: 60 },
      { id: CURRENT_USER_ID, name: 'Current User', total: 30 },
    ]);
    expect(summary.totalExpenses.topCategories).toEqual([
      { name: 'Bills', total: 40 },
      { name: 'Groceries', total: 30 },
      { name: 'Shopping', total: 20 },
    ]);
  });

  test('keeps payer ordering deterministic when names tie', () => {
    const summary = summarizeExpenses(
      [
        createExpenseRecord({
          id: 'bob-1',
          category: 'Groceries',
          amount: 50,
          paidByUserId: OTHER_USER_ID,
          paidByUserName: 'Bob',
        }),
        createExpenseRecord({
          id: 'bob-2',
          category: 'Restaurants',
          amount: 25,
          paidByUserId: THIRD_USER_ID,
          paidByUserName: 'Bob',
        }),
      ]
    );

    expect(summary.totalExpenses.paidByUserTotals).toEqual([
      { id: OTHER_USER_ID, name: 'Bob', total: 50 },
      { id: THIRD_USER_ID, name: 'Bob', total: 25 },
    ]);
  });
});
