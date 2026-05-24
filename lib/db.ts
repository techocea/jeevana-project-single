import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

declare global {
  // eslint-disable-next-line no-var
  var __pgClient: ReturnType<typeof postgres> | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in environment variables");
}

// Production Optimization: Use a max connection pool of 1 when running inside a serverless runtime
const clientConnectionLimit = process.env.NODE_ENV === "production" ? 1 : 5;

const sql = (globalThis.__pgClient ??= postgres(process.env.DATABASE_URL, {
  max: clientConnectionLimit,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  prepare: false, // CRITICAL: Supabase Pooler (Port 6543 / Transaction Mode) does not support prepared statements
}));

export const db = drizzle(sql);
