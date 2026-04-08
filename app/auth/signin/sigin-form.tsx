'use client';

import { useActionState } from 'react';
import {
  initialFormState,
  mergeForm,
  revalidateLogic,
  useForm,
  useTransform,
} from '@tanstack/react-form-nextjs';

import { FieldGroup } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { FormField } from '~/components/form-field';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { FormError } from '~/lib/forms/form-error';
import { SubmitButton } from '~/lib/forms/submit-button';

import { signinAction } from './action';
import { formOpts, signinSchema } from './shared';

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
          <FormError form={form} pending={pending} />

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

            <SubmitButton form={form} pending={pending} />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
