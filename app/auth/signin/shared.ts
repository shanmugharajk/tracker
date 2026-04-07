import { formOptions } from '@tanstack/react-form-nextjs';
import { z } from 'zod';

// {
//   email: 'shan@mail.com',
//   password: 'shan@12345',
// }

export const formOpts = formOptions({
  defaultValues: {
    email: '',
    password: '',
  },
});

export const signinSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(5),
});

type Fields = keyof z.infer<typeof signinSchema>;

export type SubmitError = {
  form?: string;
  fields?: Partial<Record<Fields, string>>;
};
