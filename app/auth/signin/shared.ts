import { z } from 'zod';

import { createFormContract } from '~/lib/forms/create-form-contract';

export const signinSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(5),
});

export type SigninFormValues = z.infer<typeof signinSchema>;

export const signinContract = createFormContract({
  schema: signinSchema,
  defaultValues: {
    email: 'shan@mail.com',
    password: 'shan@1234',
  },
});
