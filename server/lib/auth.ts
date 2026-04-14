import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

import { db, userTypes } from '~/server/db';

const authUserTypes: ['expense', 'loan'] = [...userTypes];

export const auth = betterAuth({
  plugins: [nextCookies()],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      userType: {
        type: authUserTypes,
        defaultValue: 'expense',
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
});
