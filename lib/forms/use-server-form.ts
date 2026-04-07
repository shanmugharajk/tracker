'use client';

import { mergeForm, revalidateLogic, useForm, useStore } from '@tanstack/react-form';
import {
  initialFormState,
  useTransform,
} from '@tanstack/react-form-nextjs';
import type { FormValidateOrFn } from '@tanstack/react-form';
import { useActionState } from 'react';

type FormContractLike<
  TFormData extends Record<string, unknown>,
  TSchema extends FormValidateOrFn<TFormData>,
> = {
  schema: TSchema;
  formOpts: {
    defaultValues: TFormData;
  };
};

export type ServerFormStatePayload<TFormData extends Record<string, unknown>> = {
  values?: TFormData;
  errors?: ReadonlyArray<unknown>;
  errorMap?: {
    onServer?: unknown;
    onSubmit?: {
      form?: string;
    };
  };
};

export type ServerFormAction<TFormData extends Record<string, unknown>> = (
  previousState: ServerFormStatePayload<TFormData>,
  formData: FormData
) => Promise<ServerFormStatePayload<TFormData>>;

function readFormError(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('form' in error)) {
    return undefined;
  }

  const form = (error as { form?: unknown }).form;

  return typeof form === 'string' ? form : undefined;
}

export function useServerForm<
  TFormData extends Record<string, unknown>,
  TSchema extends FormValidateOrFn<TFormData>,
>(
  contract: FormContractLike<TFormData, TSchema>,
  serverAction: ServerFormAction<TFormData>
) {
  const [state, action, pending] = useActionState<
    ServerFormStatePayload<TFormData>,
    FormData
  >(serverAction, initialFormState as ServerFormStatePayload<TFormData>);

  const form = useForm({
    ...contract.formOpts,
    validators: { onDynamic: contract.schema },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    transform: useTransform((baseForm) => mergeForm(baseForm, state as never), [
      state,
    ]),
  });

  const {
    canSubmit,
    formError,
    submissionAttempts,
    isSubmitting,
    isValidating,
  } = useStore(form.store, (currentState) => {
    const rawFormError = currentState.errors.map(readFormError).find(Boolean);

    return {
      canSubmit: currentState.canSubmit,
      submissionAttempts: currentState.submissionAttempts,
      isSubmitting: currentState.isSubmitting,
      isValidating: currentState.isValidating,
      formError:
        currentState.isFieldsValid && currentState.submissionAttempts > 0
          ? rawFormError
          : undefined,
    };
  });

  const isBusy = pending || isSubmitting;
  const disableSubmit =
    isBusy ||
    (submissionAttempts > 0 && !formError && (!canSubmit || isValidating));

  return {
    action,
    canSubmit,
    disableSubmit,
    form,
    formError,
    isBusy,
    isSubmitting,
    isValidating,
    pending,
    submissionAttempts,
  };
}
