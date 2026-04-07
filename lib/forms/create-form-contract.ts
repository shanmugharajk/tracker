import { formOptions } from '@tanstack/react-form-nextjs';
import type { FormValidateOrFn } from '@tanstack/react-form';

type CreateFormContractArgs<
  TFormData extends Record<string, unknown>,
  TSchema extends FormValidateOrFn<TFormData>,
> = {
  schema: TSchema;
  defaultValues: TFormData;
};

export function createFormContract<
  TFormData extends Record<string, unknown>,
  TSchema extends FormValidateOrFn<TFormData>,
>(
  args: CreateFormContractArgs<TFormData, TSchema>
) {
  const formOpts = formOptions({
    defaultValues: args.defaultValues,
  });

  return {
    schema: args.schema,
    defaultValues: args.defaultValues,
    formOpts,
  } as const;
}
