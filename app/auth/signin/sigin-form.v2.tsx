'use client';

import { useActionState } from 'react';

import { FieldGroup } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { FormField } from '~/components/form-field';

import { signinAction } from './action';
import { signinContract } from './shared';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  initialFormState,
  mergeForm,
  revalidateLogic,
  useForm,
  useTransform,
} from '@tanstack/react-form-nextjs';

function readFormError(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('form' in error)) {
    return undefined;
  }

  const form = (error as { form?: unknown }).form;

  return typeof form === 'string' ? form : undefined;
}

export function SigninFormV2() {
  const [state, action, pending] = useActionState(
    signinAction,
    initialFormState
  );

  const form = useForm({
    ...signinContract.formOpts,
    validators: { onDynamic: signinContract.schema },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state as never),
      [state]
    ),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signin</CardTitle>
        <CardDescription>Signin to the awesome Tracker!</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="signin-form"
          action={action}
          onSubmit={form.handleSubmit}
          noValidate
        >
          <form.Subscribe selector={(state) => state}>
            {(state) => {
              const { submissionAttempts, isFieldsValid, errors } = state;

              const rawFormError = errors.map(readFormError).find(Boolean);

              const formError =
                isFieldsValid && submissionAttempts > 0
                  ? rawFormError
                  : undefined;

              if (pending) return;

              return (
                <div className="mb-4 text-sm text-red-500">{formError}</div>
              );
            }}
          </form.Subscribe>

          <FieldGroup>
            <FormField
              fieldComponent={form.Field}
              name="email"
              label="Email"
              render={({
                name,
                value,
                handleBlur,
                handleChange,
                invalid,
                errorId,
                inputId,
              }) => (
                <Input
                  type="email"
                  id={inputId}
                  name={name}
                  value={value}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value)}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? errorId : undefined}
                  placeholder="shan@mail.com"
                  autoComplete="email"
                />
              )}
            />

            <FormField
              fieldComponent={form.Field}
              name="password"
              label="Password"
              render={({
                name,
                value,
                handleBlur,
                handleChange,
                invalid,
                errorId,
                inputId,
              }) => (
                <Input
                  type="password"
                  id={inputId}
                  name={name}
                  value={value}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value)}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? errorId : undefined}
                  autoComplete="current-password"
                  placeholder="password"
                />
              )}
            />
            <form.Subscribe selector={(state) => state}>
              {(state) => {
                const {
                  canSubmit,
                  submissionAttempts,
                  isFieldsValid,
                  isSubmitting,
                  isValidating,
                  errors,
                } = state;

                const isBusy = pending || isSubmitting;

                const rawFormError = errors.map(readFormError).find(Boolean);

                const formError =
                  isFieldsValid && submissionAttempts > 0
                    ? rawFormError
                    : undefined;

                const disableSubmit =
                  isBusy ||
                  (submissionAttempts > 0 &&
                    !formError &&
                    (!canSubmit || isValidating));

                return (
                  <Button type="submit" disabled={disableSubmit}>
                    {pending ? 'Submitting...' : 'Submit'}
                  </Button>
                );
              }}
            </form.Subscribe>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
