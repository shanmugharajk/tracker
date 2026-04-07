import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

import { env } from '~/config/env';

config({ path: '.env' });

export default defineConfig({
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
