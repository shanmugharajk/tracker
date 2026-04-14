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

const addExpenseSchemaBase = z
  .object({
    amount: expenseAmountSchema,
    category: z.enum(expenseCategoryValues),
    tags: z.string().trim(),
    paidByUserId: z.string().trim().min(1, 'Paid by is required'),
    note: z.string().trim(),
  });

export const addExpenseSchema = addExpenseSchemaBase;

export type AddExpenseFormState = z.input<typeof addExpenseSchema>;
export type AddExpenseFormValues = z.output<typeof addExpenseSchema>;

export const addExpenseDefaultValues: AddExpenseFormState = {
  amount: '',
  category: expenseCategories[0].value,
  tags: '',
  paidByUserId: '',
  note: '',
};

export const formOpts = formOptions({
  defaultValues: addExpenseDefaultValues,
});
