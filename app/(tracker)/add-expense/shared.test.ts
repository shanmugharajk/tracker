import { describe, expect, test } from 'bun:test';

import { addExpenseDefaultValues, addExpenseSchema } from './shared';

describe('addExpenseSchema', () => {
  test('requires a payer for every expense', () => {
    const result = addExpenseSchema.safeParse({
      amount: '12.50',
      category: 'Groceries',
      tags: '',
      paidByUserId: '',
      note: '',
    });

    expect(result.success).toBe(false);
  });

  test('accepts a selected payer', () => {
    const result = addExpenseSchema.safeParse({
      amount: '12.50',
      category: 'Groceries',
      tags: '',
      paidByUserId: 'user-1',
      note: '',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.paidByUserId).toBe('user-1');
    }
  });
});

describe('addExpenseDefaultValues', () => {
  test('keeps paid by blank until the session default is applied', () => {
    expect(addExpenseDefaultValues.paidByUserId).toBe('');
  });
});
