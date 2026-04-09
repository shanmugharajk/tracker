'use client';

import type { ReactNode } from 'react';
import type {
  DeepKeys,
  DeepValue,
  FieldComponent,
  FormAsyncValidateOrFn,
  FormValidateOrFn,
} from '@tanstack/react-form';

import {
  Field as FieldShell,
  FieldError,
  FieldLabel,
} from '~/components/ui/field';

type FormFieldAdapter<TFormData, TName extends DeepKeys<TFormData>> = {
  name: TName;
  value: DeepValue<TFormData, TName>;
  handleBlur: () => void;
  handleChange: (value: DeepValue<TFormData, TName>) => void;
  invalid: boolean;
  errorId: string;
  inputId: string;
};

type FormFieldProps<
  TFormData,
  TName extends DeepKeys<TFormData>,
  TFormOnMount extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnChange extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    undefined,
  TFormOnBlur extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    undefined,
  TFormOnSubmit extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    undefined,
  TFormOnDynamic extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    undefined,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TFormData> =
    undefined,
  TSubmitMeta = never,
> = {
  fieldComponent: FieldComponent<
    TFormData,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnDynamic,
    TFormOnDynamicAsync,
    TFormOnServer,
    TSubmitMeta
  >;
  name: TName;
  label: ReactNode;
  render: (field: FormFieldAdapter<TFormData, TName>) => ReactNode;
};

export function FormField<
  TFormData,
  TName extends DeepKeys<TFormData>,
  TFormOnMount extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnChange extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    undefined,
  TFormOnBlur extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    undefined,
  TFormOnSubmit extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    undefined,
  TFormOnDynamic extends undefined | FormValidateOrFn<TFormData> = undefined,
  TFormOnDynamicAsync extends undefined | FormAsyncValidateOrFn<TFormData> =
    undefined,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TFormData> =
    undefined,
  TSubmitMeta = never,
>({
  fieldComponent: FieldComponent,
  name,
  label,
  render,
}: FormFieldProps<
  TFormData,
  TName,
  TFormOnMount,
  TFormOnChange,
  TFormOnChangeAsync,
  TFormOnBlur,
  TFormOnBlurAsync,
  TFormOnSubmit,
  TFormOnSubmitAsync,
  TFormOnDynamic,
  TFormOnDynamicAsync,
  TFormOnServer,
  TSubmitMeta
>) {
  return (
    <FieldShell>
      <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>
      <FieldComponent name={name}>
        {(field) => {
          const inputId = String(field.name);
          const errorId = `${inputId}-error`;
          const invalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <>
              {render({
                name: field.name,
                value: field.state.value,
                handleBlur: field.handleBlur,
                handleChange: field.handleChange,
                invalid,
                errorId,
                inputId,
              })}
              {invalid && (
                <FieldError id={errorId} errors={field.state.meta.errors} />
              )}
            </>
          );
        }}
      </FieldComponent>
    </FieldShell>
  );
}
