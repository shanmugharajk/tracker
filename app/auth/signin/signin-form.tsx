'use client';

import { useActionState } from 'react';
import { initialFormState } from '@tanstack/react-form-nextjs';
import { useForm } from '@tanstack/react-form-nextjs';
import Link from 'next/link';

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

import { signinAction } from './action';
import { formOpts, signinSchema } from './shared';
import { Button } from '~/components/ui/button';

export function SigninForm() {
  const [state, action, pending] = useActionState(
    signinAction,
    initialFormState
  );

  const form = useForm({
    ...formOpts,
    ...useServerFormOptions(signinSchema, state),
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
                  placeholder="your email@domain.com"
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

            <div className="space-x-2">
              <SubmitButton form={form} pending={pending} />
              <Link href="signup">
                <Button variant="secondary">Signup</Button>
              </Link>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
