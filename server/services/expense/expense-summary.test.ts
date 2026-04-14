import { describe, expect, it } from 'bun:test';

import { summarizeExpenses, type ExpenseRecord } from '~/server/services/expense';

describe('summarizeExpenses', () => {
  it('groups totals by payer and category', () => {
    const entries: ExpenseRecord[] = [
      {
        id: '1',
        category: 'Groceries',
        tags: null,
        amount: 10,
        paidByUserId: 'a',
        paidByUserName: 'A',
        note: null,
        createdAt: new Date(),
      },
      {
        id: '2',
        category: 'Groceries',
        tags: null,
        amount: 5,
        paidByUserId: 'b',
        paidByUserName: 'B',
        note: null,
        createdAt: new Date(),
      },
    ];

    expect(summarizeExpenses(entries)).toEqual({
      totalExpenses: {
        total: 15,
        paidByUserTotals: [
          { id: 'a', name: 'A', total: 10 },
          { id: 'b', name: 'B', total: 5 },
        ],
        topCategories: [{ name: 'Groceries', total: 15 }],
      },
    });
  });
});
