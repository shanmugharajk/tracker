'use client';

import { useActionState } from 'react';

import { initialFormState, useForm } from '@tanstack/react-form-nextjs';
import { useStore } from '@tanstack/react-form';

import { Button } from '~/components/ui/button';
import { FieldGroup } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Switch } from '~/components/ui/switch';
import { Textarea } from '~/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { FormField } from '~/components/form-field';
import { FormError } from '~/lib/forms/form-error';
import { SubmitButton } from '~/lib/forms/submit-button';
import { useServerFormOptions } from '~/lib/forms/server-form';

import { addExpenseAction } from './action';
import { expenseCategories, formOpts, addExpenseSchema } from './shared';
import type { ExpenseUserRecord } from '~/server/services/users';

type AddExpenseFormProps = {
  users: ExpenseUserRecord[];
};

export function AddExpenseForm({ users }: AddExpenseFormProps) {
  const [state, action, pending] = useActionState(
    addExpenseAction,
    initialFormState
  );

  const form = useForm({
    ...formOpts,
    ...useServerFormOptions(addExpenseSchema, state),
  });

  const isSplit = useStore(form.store, (store) => store.values.isSplit);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Add expense</CardTitle>
        <CardDescription>
          Capture a new expense with a quick, focused form.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <form
          id="add-expense-form"
          action={action}
          onSubmit={form.handleSubmit}
          noValidate
        >
          <FormError form={form} pending={pending} />

          <FieldGroup>
            <FormField
              fieldComponent={form.Field}
              name="amount"
              label="Expense amount"
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
                  inputMode="decimal"
                  id={inputId}
                  name={name}
                  value={value}
                  onBlur={handleBlur}
                  onChange={(event) => handleChange(event.target.value)}
                  aria-invalid={invalid}
                  aria-describedby={invalid ? errorId : undefined}
                  placeholder="0.00"
                />
              )}
            />

            <FormField
              fieldComponent={form.Field}
              name="category"
              label="Category"
              render={({ name, value, handleBlur, handleChange }) => (
                <div
                  role="radiogroup"
                  className="flex flex-wrap gap-2"
                  onBlur={handleBlur}
                >
                  {expenseCategories.map((category) => {
                    const active = value === category.value;

                    return (
                      <Button
                        key={category.value}
                        type="button"
                        variant={active ? 'default' : 'outline'}
                        className="h-auto w-fit shrink-0 gap-2 rounded-full px-3 py-1.5 text-sm"
                        aria-pressed={active}
                        onClick={() => handleChange(category.value)}
                      >
                        <span aria-hidden="true">{category.emoji}</span>
                        <span className="font-medium">{category.title}</span>
                      </Button>
                    );
                  })}
                  <input type="hidden" name={name} value={value} />
                </div>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                fieldComponent={form.Field}
                name="tags"
                label="Tags"
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
                    onChange={(event) => handleChange(event.target.value)}
                    aria-invalid={invalid}
                    aria-describedby={invalid ? errorId : undefined}
                    placeholder="Optional tags"
                  />
                )}
              />

              <FormField
                fieldComponent={form.Field}
                name="note"
                label="Note"
                render={({
                  name,
                  value,
                  handleBlur,
                  handleChange,
                  invalid,
                  errorId,
                  inputId,
                }) => (
                  <Textarea
                    id={inputId}
                    name={name}
                    value={value}
                    onBlur={handleBlur}
                    onChange={(event) => handleChange(event.target.value)}
                    aria-invalid={invalid}
                    aria-describedby={invalid ? errorId : undefined}
                    placeholder="Optional note"
                    className="min-h-10 resize-none"
                  />
                )}
              />

              <FormField
                fieldComponent={form.Field}
                name="isSplit"
                label="Split expense"
                render={({ name, value, handleChange, handleBlur }) => (
                  <div className="flex items-center justify-between gap-4 rounded-3xl border border-transparent bg-input/40 px-4 py-3">
                    <input
                      type="hidden"
                      name={name}
                      value={String(Boolean(value))}
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Split this expense</p>
                      <p className="text-sm text-muted-foreground">
                        Enable this when the amount is shared.
                      </p>
                    </div>
                    <Switch
                      checked={value === true || value === 'true'}
                      onCheckedChange={(checked) => {
                        handleChange(checked);
                        handleBlur();

                        if (!checked) {
                          form.setFieldValue('paidByUserId', '');
                        }
                      }}
                    />
                  </div>
                )}
              />

              {isSplit ? (
                <FormField
                  fieldComponent={form.Field}
                  name="paidByUserId"
                  label="Paid by"
                  render={({
                    name,
                    value,
                    handleBlur,
                    handleChange,
                    invalid,
                    errorId,
                  }) => (
                    <Select
                      name={name}
                      value={value ?? ''}
                      onValueChange={(nextValue) => {
                        handleChange(nextValue);
                        handleBlur();
                      }}
                    >
                      <SelectTrigger
                        aria-invalid={invalid}
                        aria-describedby={invalid ? errorId : undefined}
                      >
                        <SelectValue placeholder="Choose an expense user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : null}
            </div>

            <div className="w-fit">
              <SubmitButton
                form={form}
                pending={pending}
                text="Add expense"
                submittingText="Saving expense..."
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
