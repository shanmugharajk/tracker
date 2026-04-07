'use server';

import {
  createServerValidate,
  ServerValidateError,
} from '@tanstack/react-form-nextjs';
import { redirect } from 'next/navigation';

import { auth } from '~/server/lib/auth';

import { formOpts, signinSchema } from './shared';
import { APIError } from 'better-auth';

// https://github.com/TanStack/form/discussions/778
export const serverValidateSignin = createServerValidate({
  ...formOpts,
  onServerValidate: signinSchema,
});

export async function signinAction(previous: unknown, formData: FormData) {
  try {
    const { email, password } = await serverValidateSignin(formData);
    await auth.api.signInEmail({
      body: { email, password },
    });
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    if (e instanceof APIError && e.status === 'UNAUTHORIZED') {
      return { errorMap: { onSubmit: { form: e.message } } };
    } else {
      return {
        errorMap: {
          onSubmit: { form: 'Something went wrong, please try again later!' },
        },
      };
    }
  }

  redirect('/');
}
