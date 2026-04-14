'use server';

import {
  createServerValidate,
  ServerValidateError,
} from '@tanstack/react-form-nextjs';
import { revalidatePath } from 'next/cache';

import { requireSession } from '~/server/lib/request';
import { createSettlementLedgerEntry } from '~/server/services/expenses';

import { formOpts, settlementSchema } from './settlement-shared';

const serverValidateSettlement = createServerValidate({
  ...formOpts,
  onServerValidate: settlementSchema as never,
});

export const settleExpenseAction = async (
  _previous: unknown,
  formData: FormData
) => {
  try {
    const session = await requireSession();
    const values = await serverValidateSettlement(formData);
    const amount = Number(values.amount);

    await createSettlementLedgerEntry({
      personId: session.user.id,
      amount,
      paidByUserId: session.user.id,
      settlementFor: 'expense',
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    revalidatePath('/');
    revalidatePath('/all-expenses');

    return {
      status: 'success' as const,
      message: 'Settlement saved successfully.',
    };
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return error.formState;
    }

    return {
      status: 'error' as const,
      message:
        error instanceof Error
          ? error.message
          : 'Something went wrong, please try again later!',
    };
  }
};
