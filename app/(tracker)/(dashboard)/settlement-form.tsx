'use client';

import { useActionState, useEffect, useState } from 'react';
import { initialFormState, useForm } from '@tanstack/react-form-nextjs';
import {
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

import { FormField } from '~/components/form-field';
import { Button } from '~/components/ui/button';
import { FieldGroup } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet';
import { FormError } from '~/lib/forms/form-error';
import { SubmitButton } from '~/lib/forms/submit-button';
import { useServerFormOptions } from '~/lib/forms/server-form';

import { settleExpenseAction } from './settlement-action';
import { formOpts, settlementSchema } from './settlement-shared';

type SettlementFormProps = {
  defaultAmount: number;
  settlementText: string;
};

type ToastState = { kind: 'success' | 'error'; message: string };

function FeedbackToast({ kind, message }: ToastState) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDismissed(true), 5000);

    return () => window.clearTimeout(timeout);
  }, []);

  if (dismissed) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 bottom-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-3xl border border-border/70 bg-background p-4 shadow-xl"
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 rounded-full p-1.5 ${
            kind === 'success'
              ? 'bg-emerald-500/10 text-emerald-600'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          <HugeiconsIcon
            icon={kind === 'success' ? CheckmarkCircle01Icon : AlertCircleIcon}
            strokeWidth={2}
            className="size-4"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">
            {kind === 'success' ? 'Success' : 'Unable to settle'}
          </p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="shrink-0"
          onClick={() => setDismissed(true)}
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          <span className="sr-only">Close toast</span>
        </Button>
      </div>
    </div>
  );
}

export function SettlementForm({
  defaultAmount,
  settlementText,
}: SettlementFormProps) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(
    settleExpenseAction,
    initialFormState
  );

  const form = useForm({
    ...formOpts,
    defaultValues: {
      amount: defaultAmount.toFixed(2),
    },
    ...useServerFormOptions(settlementSchema, state),
  });

  useEffect(() => {
    if (!state?.status) return;

    if (state.status === 'success') {
      queueMicrotask(() => {
        setOpen(false);
        form.reset();
      });
    }
  }, [form, state]);

  useEffect(() => {
    if (!open) return;

    form.setFieldValue('amount', defaultAmount.toFixed(2));
  }, [defaultAmount, form, open]);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="secondary" size="xs" className="h-8 px-3 text-sm">
            Settle
          </Button>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          className="mx-auto h-auto max-h-[90vh] w-full rounded-t-3xl sm:max-w-lg"
          showCloseButton={false}
        >
          <SheetHeader className="px-6 pt-6">
            <SheetTitle>Settle expense</SheetTitle>
            <SheetDescription>{settlementText}</SheetDescription>
          </SheetHeader>

          <div className="px-6 pb-6 pt-4">
            <form action={action} onSubmit={form.handleSubmit} noValidate>
              <FormError form={form} pending={pending} />

              <FieldGroup>
                <FormField
                  fieldComponent={form.Field}
                  name="amount"
                  label="Settlement amount"
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
                      placeholder={defaultAmount.toFixed(2)}
                    />
                  )}
                />

                <input type="hidden" name="settlementFor" value="expense" />

                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <SubmitButton
                    form={form}
                    pending={pending}
                    text="Submit"
                    submittingText="Saving..."
                  />
                </div>
              </FieldGroup>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      {state?.status ? (
        <FeedbackToast
          key={`${state.status}-${state.message}`}
          kind={state.status}
          message={state.message}
        />
      ) : null}
    </>
  );
}
