import { describe, expect, test } from 'bun:test';

import { addExpenseSchema, resolveExpensePaidByUserId } from './shared';

describe('addExpenseSchema', () => {
  test('accepts a non-split expense without a payer field', () => {
    const result = addExpenseSchema.safeParse({
      amount: '12.50',
      category: 'Groceries',
      tags: '',
      isSplit: false,
      note: '',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.paidByUserId).toBe('');
      expect(result.data.isSplit).toBe(false);
    }
  });

  test('still requires a payer when the expense is split', () => {
    const result = addExpenseSchema.safeParse({
      amount: '12.50',
      category: 'Groceries',
      tags: '',
      isSplit: true,
      paidByUserId: '',
      note: '',
    });

    expect(result.success).toBe(false);
  });
});

describe('resolveExpensePaidByUserId', () => {
  test('uses the current user for non-split expenses', () => {
    expect(
      resolveExpensePaidByUserId(false, 'someone-else', 'me')
    ).toBe('me');
  });

  test('keeps the selected payer for split expenses', () => {
    expect(resolveExpensePaidByUserId(true, 'alex', 'me')).toBe('alex');
  });
});
