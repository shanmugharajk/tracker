import { describe, expect, test } from 'bun:test';

import { summarizeExpenses, type ExpenseRecord } from '~/server/services/ledger';

const CURRENT_USER_ID = 'user-current';
const OTHER_USER_ID = 'user-other';
const THIRD_USER_ID = 'user-third';

function createExpenseRecord(
  overrides: Partial<ExpenseRecord> & Pick<ExpenseRecord, 'id'>
): ExpenseRecord {
  return {
    type: 'expense',
    settlementFor: null,
    personId: null,
    personName: null,
    category: 'Groceries',
    tags: null,
    amount: 0,
    paidByUserId: CURRENT_USER_ID,
    paidByUserName: 'Current User',
    isSplit: false,
    createdAt: new Date('2026-04-01T12:00:00.000Z'),
    ...overrides,
  };
}

describe('summarizeExpenses', () => {
  test('separates total expenses from shared-expense metrics', () => {
    const summary = summarizeExpenses(
      [
        createExpenseRecord({
          id: 'personal-current',
          category: 'Restaurants',
          amount: 30,
          paidByUserId: CURRENT_USER_ID,
        }),
        createExpenseRecord({
          id: 'personal-other',
          category: 'Shopping',
          amount: 20,
          personId: OTHER_USER_ID,
          personName: 'Alex',
          paidByUserId: OTHER_USER_ID,
          paidByUserName: 'Alex',
        }),
        createExpenseRecord({
          id: 'shared-current',
          category: 'Groceries',
          amount: 80,
          personId: OTHER_USER_ID,
          personName: 'Alex',
          isSplit: true,
        }),
        createExpenseRecord({
          id: 'shared-other',
          category: 'Bills',
          amount: 40,
          personId: OTHER_USER_ID,
          personName: 'Alex',
          paidByUserId: OTHER_USER_ID,
          paidByUserName: 'Alex',
          isSplit: true,
        }),
        createExpenseRecord({
          id: 'settlement-other',
          type: 'settlement',
          settlementFor: 'expense',
          category: null,
          amount: 10,
          personId: OTHER_USER_ID,
          personName: 'Alex',
          paidByUserId: OTHER_USER_ID,
          paidByUserName: 'Alex',
        }),
      ],
      CURRENT_USER_ID
    );

    expect(summary.totalExpenses.total).toBe(170);
    expect(summary.totalExpenses.individualTotal).toBe(50);
    expect(summary.totalExpenses.topCategories.length).toBe(3);
    expect(summary.totalExpenses.topCategories[0]?.name).toBe('Groceries');
    expect(summary.totalExpenses.topCategories[0]?.total).toBe(80);
    expect(summary.totalExpenses.topCategories[1]?.name).toBe('Bills');
    expect(summary.totalExpenses.topCategories[1]?.total).toBe(40);
    expect(summary.totalExpenses.topCategories[2]?.name).toBe('Restaurants');
    expect(summary.totalExpenses.topCategories[2]?.total).toBe(30);
    expect(summary.sharedExpenses.total).toBe(120);
    expect(summary.sharedExpenses.expensePerPerson).toBe(60);
    expect(summary.sharedExpenses.totalPaidByCurrentUser).toBe(80);
    expect(summary.sharedExpenses.totalPaidByOtherUser).toBe(40);
    expect(summary.sharedExpenses.balance).toBe(10);
    expect(summary.sharedExpenses.counterparty.id).toBe(OTHER_USER_ID);
    expect(summary.sharedExpenses.counterparty.name).toBe('Alex');
    expect(summary.participantExpenses.currentUserTotal).toBe(90);
    expect(summary.participantExpenses.counterpartyTotal).toBe(80);
  });

  test('picks a deterministic counterparty from the returned expense rows', () => {
    const summary = summarizeExpenses(
      [
        createExpenseRecord({
          id: 'shared-bob',
          amount: 50,
          category: 'Groceries',
          personId: OTHER_USER_ID,
          personName: 'Bob',
          isSplit: true,
        }),
        createExpenseRecord({
          id: 'personal-bob',
          amount: 10,
          category: 'Restaurants',
          personId: OTHER_USER_ID,
          personName: 'Bob',
          paidByUserId: OTHER_USER_ID,
          paidByUserName: 'Bob',
        }),
        createExpenseRecord({
          id: 'shared-charlie',
          amount: 200,
          category: 'Shopping',
          personId: THIRD_USER_ID,
          personName: 'Charlie',
          isSplit: true,
        }),
      ],
      CURRENT_USER_ID
    );

    expect(summary.totalExpenses.total).toBe(260);
    expect(summary.totalExpenses.individualTotal).toBe(10);
    expect(summary.totalExpenses.topCategories.length).toBe(3);
    expect(summary.totalExpenses.topCategories[0]?.name).toBe('Shopping');
    expect(summary.totalExpenses.topCategories[0]?.total).toBe(200);
    expect(summary.totalExpenses.topCategories[1]?.name).toBe('Groceries');
    expect(summary.totalExpenses.topCategories[1]?.total).toBe(50);
    expect(summary.totalExpenses.topCategories[2]?.name).toBe('Restaurants');
    expect(summary.totalExpenses.topCategories[2]?.total).toBe(10);
    expect(summary.sharedExpenses.total).toBe(250);
    expect(summary.sharedExpenses.expensePerPerson).toBe(125);
    expect(summary.sharedExpenses.totalPaidByCurrentUser).toBe(250);
    expect(summary.sharedExpenses.totalPaidByOtherUser).toBe(0);
    expect(summary.sharedExpenses.balance).toBe(125);
    expect(summary.sharedExpenses.counterparty.id).toBe(OTHER_USER_ID);
    expect(summary.sharedExpenses.counterparty.name).toBe('Bob');
    expect(summary.participantExpenses.currentUserTotal).toBe(125);
    expect(summary.participantExpenses.counterpartyTotal).toBe(135);
  });

  test('treats expense settlements as balance offsets', () => {
    const summary = summarizeExpenses(
      [
        createExpenseRecord({
          id: 'shared-current',
          category: 'Groceries',
          amount: 80,
          personId: OTHER_USER_ID,
          personName: 'Alex',
          isSplit: true,
        }),
        createExpenseRecord({
          id: 'shared-other',
          category: 'Bills',
          amount: 40,
          personId: OTHER_USER_ID,
          personName: 'Alex',
          paidByUserId: OTHER_USER_ID,
          paidByUserName: 'Alex',
          isSplit: true,
        }),
        createExpenseRecord({
          id: 'settlement',
          type: 'settlement',
          settlementFor: 'expense',
          category: null,
          amount: 20,
          personId: OTHER_USER_ID,
          personName: 'Alex',
          paidByUserId: OTHER_USER_ID,
          paidByUserName: 'Alex',
        }),
      ],
      CURRENT_USER_ID
    );

    expect(summary.sharedExpenses.balance).toBe(0);
    expect(summary.sharedExpenses.counterparty.id).toBe(OTHER_USER_ID);
    expect(summary.sharedExpenses.counterparty.name).toBe('Alex');
  });
});
