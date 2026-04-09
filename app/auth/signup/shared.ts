import { formOptions } from '@tanstack/react-form-nextjs';
import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email'),
  password: z.string().min(5),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export const formOpts = formOptions({
  defaultValues: {
    name: '',
    email: '',
    password: '',
  },
});
