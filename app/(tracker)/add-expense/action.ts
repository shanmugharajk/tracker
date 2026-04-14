'use server';

import {
  createServerValidate,
  ServerValidateError,
} from '@tanstack/react-form-nextjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireSession } from '~/server/lib/request';
import { createExpenseLedgerEntry } from '~/server/services/expenses';
import { fetchExpenseUsers } from '~/server/services/users';

import {
  formOpts,
  addExpenseSchema,
  resolveExpensePaidByUserId,
} from './shared';

const serverValidateAddExpense = createServerValidate({
  ...formOpts,
  onServerValidate: addExpenseSchema as never,
});

function normalizeIsSplit(value: unknown) {
  return value === true || value === 'true';
}

function normalizeText(value: string | undefined) {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

export const addExpenseAction = async (
  _previous: unknown,
  formData: FormData
) => {
  try {
    const session = await requireSession();
    const values = await serverValidateAddExpense(formData);
    const normalizedValues = {
      ...values,
      isSplit: normalizeIsSplit(values.isSplit),
    };
    const expenseUsers = await fetchExpenseUsers();

    if (
      normalizedValues.isSplit &&
      !expenseUsers.some(
        (expenseUser) => expenseUser.id === normalizedValues.paidByUserId
      )
    ) {
      return {
        errorMap: {
          onSubmit: {
            form: 'Please choose a payer from the expense users list.',
          },
        },
      };
    }

    await createExpenseLedgerEntry({
      personId: session.user.id,
      category: normalizedValues.category,
      tags: normalizeText(normalizedValues.tags),
      amount: Number(normalizedValues.amount),
      paidByUserId: resolveExpensePaidByUserId(
        normalizedValues.isSplit,
        normalizedValues.paidByUserId ?? '',
        session.user.id
      ),
      isSplit: normalizedValues.isSplit,
      note: normalizeText(normalizedValues.note),
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    revalidatePath('/');
    revalidatePath('/all-expenses');
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return {
        ...error.formState,
        values: error.formState.values
          ? {
              ...error.formState.values,
              isSplit: normalizeIsSplit(error.formState.values.isSplit),
            }
          : error.formState.values,
      };
    }

    if (error instanceof Error) {
      return {
        errorMap: {
          onSubmit: { form: error.message },
        },
      };
    }

    return {
      errorMap: {
        onSubmit: { form: 'Something went wrong, please try again later!' },
      },
    };
  }

  redirect('/');
};
