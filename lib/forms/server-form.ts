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

// `initialFormState` from `@tanstack/react-form-nextjs` includes `values: undefined`.
// If we merge that directly into the live form state, it can overwrite the form's
// own `defaultValues` and flip controlled inputs back to uncontrolled.
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(stripUndefined) as T;
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const entries = Object.entries(value as Record<string, unknown>).filter(
    ([, entry]) => entry !== undefined
  );

  return Object.fromEntries(
    entries.map(([key, entry]) => [key, stripUndefined(entry)])
  ) as T;
}

export function useServerFormTransform(state: Partial<AnyFormApi['state']>) {
  // return useTransform((baseForm) => mergeForm(baseForm, state), [state]);
  return useTransform(
    (baseForm) => mergeForm(baseForm, stripUndefined(state)),
    [state]
  );
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
