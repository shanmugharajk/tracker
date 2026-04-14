import { formOptions } from '@tanstack/react-form-nextjs';
import { z } from 'zod';

import {
  expenseCategories,
  expenseCategoryValues,
} from '~/lib/expense-categories';

export { expenseCategories, expenseCategoryValues };

const expenseAmountSchema = z
  .string()
  .trim()
  .min(1, 'Amount is required')
  .refine((value) => {
    const amount = Number(value);

    return Number.isFinite(amount) && amount > 0;
  }, 'Amount must be greater than 0');

const expenseBooleanSchema = z
  .union([z.boolean(), z.literal('true'), z.literal('false')])
  .transform((value) => value === true || value === 'true');

const expenseOptionalTextSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => (typeof value === 'string' ? value.trim() : ''));

const addExpenseSchemaBase = z
  .object({
    amount: expenseAmountSchema,
    category: z.enum(expenseCategoryValues),
    tags: z.string().trim(),
    isSplit: expenseBooleanSchema,
    // `paidByUserId` is only rendered when the expense is split, so the server
    // needs to accept the non-split submission shape as well.
    paidByUserId: expenseOptionalTextSchema,
    note: z.string().trim(),
  })
  .superRefine((values, ctx) => {
    if (values.isSplit && !values.paidByUserId?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['paidByUserId'],
        message: 'Paid by is required when this expense is split',
      });
    }
  });

export const addExpenseSchema = addExpenseSchemaBase;

export type AddExpenseFormState = z.input<typeof addExpenseSchema>;
export type AddExpenseFormValues = z.output<typeof addExpenseSchema>;

const defaultValues: AddExpenseFormState = {
  amount: '',
  category: expenseCategories[0].value,
  tags: '',
  isSplit: false,
  paidByUserId: '',
  note: '',
};

export function resolveExpensePaidByUserId(
  isSplit: boolean,
  paidByUserId: string,
  currentUserId: string
) {
  return isSplit ? paidByUserId.trim() : currentUserId;
}

export const formOpts = formOptions({
  defaultValues,
});
