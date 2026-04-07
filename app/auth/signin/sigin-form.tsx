'use client';

import {
  mergeForm,
  revalidateLogic,
  useForm,
  useStore,
} from '@tanstack/react-form';
import { initialFormState, useTransform } from '@tanstack/react-form-nextjs';
import { useActionState } from 'react';

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

import { signinAction } from './action';
import { formOpts, signinSchema, SubmitError } from './shared';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export function SigninForm() {
  const [state, action, pending] = useActionState(
    signinAction,
    initialFormState
  );

  const form = useForm({
    ...formOpts,
    validators: { onDynamic: signinSchema },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
  });

  const {
    canSubmit,
    formError,
    submissionAttempts,
    isSubmitting,
    isValidating,
  } = useStore(form.store, (state) => {
    // Extract server-side form error (if any)
    const rawFormError = state.errors
      .map((e) => (e as SubmitError | undefined)?.form)
      .find(Boolean);

    return {
      canSubmit: state.canSubmit,
      submissionAttempts: state.submissionAttempts,
      isSubmitting: state.isSubmitting,
      isValidating: state.isValidating,

      /**
       * Show server error only when:
       * - user has attempted submit
       * - current fields are valid
       *
       * Reason:
       * Server errors are only meaningful for valid input.
       * If user changes input to invalid, hide stale server error.
       */
      formError:
        state.isFieldsValid && state.submissionAttempts > 0
          ? rawFormError
          : undefined,
    };
  });

  const isBusy = pending || isSubmitting;

  /**
   * Disable submit when:
   * - form is actively submitting (prevent duplicate submits)
   * - OR user already tried submitting AND:
   *    - no server error (otherwise allow retry)
   *    - form is not submittable (invalid or not ready)
   *    - validation is in progress (avoid premature submits)
   *
   * This ensures:
   * - first attempt is always allowed
   * - invalid forms can't be spam-submitted
   * - server errors can be retried
   * - no UI flicker during validation
   */
  const disableSubmit =
    isBusy ||
    (submissionAttempts > 0 && !formError && (!canSubmit || isValidating));

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
          {formError && (
            <div className="mb-4 text-sm text-red-500">{formError}</div>
          )}

          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      type="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      aria-describedby={
                        isInvalid ? `${field.name}-error` : undefined
                      }
                      placeholder="shan@mail.com"
                      autoComplete="email"
                    />
                    {isInvalid && (
                      <FieldError
                        id={`${field.name}-error`}
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      type="password"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      aria-describedby={
                        isInvalid ? `${field.name}-error` : undefined
                      }
                      autoComplete="current-password"
                      placeholder="password"
                    />
                    {isInvalid && (
                      <FieldError
                        id={`${field.name}-error`}
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <Button type="submit" form="signin-form" disabled={disableSubmit}>
              {isBusy ? 'Submitting...' : 'Submit'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
