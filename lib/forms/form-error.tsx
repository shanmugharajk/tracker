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
  /**
   * Show server error only when:
   * - user has attempted submit
   * - current fields are valid
   *
   * Reason:
   * Server errors are only meaningful for valid input.
   * If user changes input to invalid, hide stale server error.
   */
  const formError = useStore(form.store, (state) => {
    const { submissionAttempts, isFieldsValid, errors } = state;

    const rawFormError = errors.map(readFormError).find(Boolean);

    return isFieldsValid && submissionAttempts > 0 ? rawFormError : undefined;
  });

  if (pending || !formError) return null;

  return <div className={className}>{formError}</div>;
}
