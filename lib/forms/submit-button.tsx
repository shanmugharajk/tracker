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
