import { AnyFormApi, useStore } from '@tanstack/react-form';

import { Button } from '~/components/ui/button';

import { readFormError } from './utils';

type SubmitButtonProps = {
  form: AnyFormApi;
  pending: boolean;
  text?: string;
  submittingText?: string;
};

export function SubmitButton({
  form,
  pending,
  text = 'Submit',
  submittingText = 'Submitting...',
}: SubmitButtonProps) {
  const { disableSubmit, isBusy } = useStore(form.store, (state) => {
    const {
      canSubmit,
      submissionAttempts,
      isFieldsValid,
      isSubmitting,
      isValidating,
      errors,
    } = state;

    const isBusy = pending || isSubmitting;

    const rawFormError = errors.map(readFormError).find(Boolean);

    const formError =
      isFieldsValid && submissionAttempts > 0 ? rawFormError : undefined;

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

    return {
      disableSubmit,
      isBusy,
    };
  });

  return (
    <Button type="submit" disabled={disableSubmit}>
      {isBusy ? submittingText : text}
    </Button>
  );
}
