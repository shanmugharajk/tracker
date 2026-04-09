'use server';

import {
  createServerValidate,
  ServerValidateError,
} from '@tanstack/react-form-nextjs';
import { APIError } from 'better-auth';
import { redirect } from 'next/navigation';

import { auth } from '~/server/lib/auth';

import { formOpts, signupSchema } from './shared';

// https://github.com/TanStack/form/discussions/778
export const serverValidateSignup = createServerValidate({
  ...formOpts,
  onServerValidate: signupSchema,
});

export const signupAction = async (_previous: unknown, formData: FormData) => {
  try {
    const { name, email, password } = await serverValidateSignup(formData);

    await auth.api.signUpEmail({
      body: { name, email, password },
    });
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return error.formState;
    }

    if (error instanceof APIError) {
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
