import { defineConfig } from 'drizzle-kit';
import { env } from './src/shared/config/env.js'; // We will use ts-node/tsx, wait, env.js might not work without tsx? Let's stick to dotenv here just in case. Or just process.env since it's a config file.
import 'dotenv/config';

export default defineConfig({
  out: './drizzle',
  schema: './src/shared/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
});
