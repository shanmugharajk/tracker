import { useStore, type AnyFormApi } from '@tanstack/react-form';

import { readFormError } from './utils';

type FormErrorProps = {
  form: AnyFormApi;
  pending: boolean;
  className?: string;
};

export function FormError({
  form,
  pending,
  className = 'mb-4 text-sm text-red-500',
}: FormErrorProps) {
  const formError = useStore(form.store, (state) => {
    const { submissionAttempts, isFieldsValid, errors } = state;

    const rawFormError = errors.map(readFormError).find(Boolean);

    return isFieldsValid && submissionAttempts > 0 ? rawFormError : undefined;
  });

  if (pending || !formError) return null;

  return <div className={className}>{formError}</div>;
}
