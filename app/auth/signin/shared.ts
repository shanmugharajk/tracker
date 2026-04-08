import { z } from 'zod';

import { formOptions } from '@tanstack/react-form-nextjs';

export const signinSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(5),
});

export type SigninFormValues = z.infer<typeof signinSchema>;

export const formOpts = formOptions({
  defaultValues: {
    email: '',
    password: '',
  },
});
