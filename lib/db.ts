import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

declare global {
  // eslint-disable-next-line no-var
  var __pgClient: ReturnType<typeof postgres> | undefined;
  // eslint-disable-next-line no-var
  var __drizzle: ReturnType<typeof drizzle> | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in environment variables");
}

const sql = (globalThis.__pgClient ??= postgres(process.env.DATABASE_URL!, {
  max: 5,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
}));

export const db = (globalThis.__drizzle ??= drizzle(sql));
