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

import { addExpenseSchema, formOpts } from './shared';

const serverValidateAddExpense = createServerValidate({
  ...formOpts,
  onServerValidate: addExpenseSchema as never,
});

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
    const expenseUsers = await fetchExpenseUsers();
    const validPayerIds = new Set([
      session.user.id,
      ...expenseUsers.map((expenseUser) => expenseUser.id),
    ]);

    if (!validPayerIds.has(values.paidByUserId)) {
      return {
        errorMap: {
          onSubmit: {
            form: 'Please choose a valid payer.',
          },
        },
      };
    }

    await createExpenseLedgerEntry({
      category: values.category,
      tags: normalizeText(values.tags),
      amount: Number(values.amount),
      paidByUserId: values.paidByUserId,
      note: normalizeText(values.note),
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    revalidatePath('/');
    revalidatePath('/all-expenses');
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return {
        ...error.formState,
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
