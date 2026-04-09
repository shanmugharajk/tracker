'use client';

import { useActionState } from 'react';
import { initialFormState } from '@tanstack/react-form-nextjs';
import { useForm } from '@tanstack/react-form-nextjs';

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
import { useServerFormOptions } from '~/lib/forms/server-form';

import { signupAction } from './action';
import { formOpts, signupSchema } from './shared';

export function SignupForm() {
  const [state, action, pending] = useActionState(
    signupAction,
    initialFormState
  );

  const form = useForm({
    ...formOpts,
    ...useServerFormOptions(signupSchema, state),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Create your Tracker account.</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="signup-form"
          action={action}
          onSubmit={form.handleSubmit}
          noValidate
        >
          <FormError form={form} pending={pending} />

          <FieldGroup>
            <FormField
              fieldComponent={form.Field}
              name="name"
              label="Name"
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
                  type="text"
                  id={inputId}
                  name={name}
                  value={value}
                  onBlur={handleBlur}
                  onChange={(e) => handleChange(e.target.value)}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? errorId : undefined}
                  placeholder="Shan"
                  autoComplete="name"
                />
              )}
            />

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
                  autoComplete="new-password"
                  placeholder="password"
                />
              )}
            />

            <SubmitButton
              form={form}
              pending={pending}
              text="Signup"
              submittingText="Signing up..."
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
