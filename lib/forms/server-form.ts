'use client';

import {
  mergeForm,
  revalidateLogic,
  useTransform,
  type AnyFormApi,
  type FormValidateOrFn,
} from '@tanstack/react-form-nextjs';

export const serverFormValidationLogic = revalidateLogic({
  mode: 'submit',
  modeAfterSubmission: 'change',
});

export function useServerFormTransform(state: Partial<AnyFormApi['state']>) {
  return useTransform((baseForm) => mergeForm(baseForm, state), [state]);
}

export function useServerFormOptions<TFormData>(
  validationFn: FormValidateOrFn<TFormData>,
  state: Partial<AnyFormApi['state']>
) {
  return {
    validators: { onDynamic: validationFn },
    validationLogic: serverFormValidationLogic,
    transform: useServerFormTransform(state),
  };
}
