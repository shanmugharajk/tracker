import { formOptions } from '@tanstack/react-form-nextjs';
import { z } from 'zod';

const settlementAmountSchema = z
  .string()
  .trim()
  .min(1, 'Settlement amount is required')
  .refine((value) => {
    const amount = Number(value);

    return Number.isFinite(amount) && amount > 0;
  }, 'Settlement amount must be greater than 0');

export const settlementSchema = z.object({
  amount: settlementAmountSchema,
});

export type SettlementFormValues = z.output<typeof settlementSchema>;

export const formOpts = formOptions({
  defaultValues: {
    amount: '',
  },
});
