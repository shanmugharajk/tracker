'use client';

import { FieldGroup } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { FormField } from '~/components/form-field';
import { useServerForm } from '~/lib/forms/use-server-form';

import { signinAction } from './action';
import { signinContract } from './shared';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export function SigninForm() {
  const { action, form, formError, isBusy, disableSubmit } = useServerForm(
    signinContract,
    signinAction
  );

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

            <Button type="submit" form="signin-form" disabled={disableSubmit}>
              {isBusy ? 'Submitting...' : 'Submit'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
