'use server';

import {
  createServerValidate,
  ServerValidateError,
} from '@tanstack/react-form-nextjs';
import { redirect } from 'next/navigation';
import { APIError } from 'better-auth';

import { auth } from '~/server/lib/auth';

import { formOpts, signinSchema } from './shared';

// https://github.com/TanStack/form/discussions/778
export const serverValidateSignin = createServerValidate({
  ...formOpts,
  onServerValidate: signinSchema,
});

export const signinAction = async (_previous: unknown, formData: FormData) => {
  try {
    const { email, password } = await serverValidateSignin(formData);
    await auth.api.signInEmail({
      body: { email, password },
    });
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return error.formState;
    }

    if (error instanceof APIError && error.status === 'UNAUTHORIZED') {
      return { errorMap: { onSubmit: { form: error.message } } };
    }

    return {
      errorMap: {
        onSubmit: { form: 'Something went wrong, please try again later!' },
      },
    };
  }

  redirect('/');
};
