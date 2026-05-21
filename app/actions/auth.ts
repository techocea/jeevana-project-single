"use server";

import { createHash } from "crypto";
import { db } from "@/lib/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import {
  authLoginSchema,
  authRegisterSchema,
  forgotPasswordSchema,
  type AuthLoginValues,
  type AuthRegisterValues,
  type ForgotPasswordValues,
} from "@/lib/validation";

export async function registerUser(data: AuthRegisterValues) {
  const parsed = authRegisterSchema.safeParse(data);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const error = new Error("Validation failed");
    (error as any).validation = errors;
    throw error;
  }

  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;

  const existingEmail = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingEmail.length > 0) {
    throw new Error("An account with this email already exists.");
  }

  const hashedPassword = createHash("sha256").update(password).digest("hex");

  await db.insert(users).values({
    email,
    password: hashedPassword,
  });

  return { success: true };
}

export async function loginUser(data: AuthLoginValues) {
  const parsed = authLoginSchema.safeParse(data);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const error = new Error("Validation failed");
    (error as any).validation = errors;
    throw error;
  }

  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;

  const found = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!found.length) {
    throw new Error("Invalid email or password.");
  }

  const hashedPassword = createHash("sha256").update(password).digest("hex");

  if (found[0].password !== hashedPassword) {
    throw new Error("Invalid email or password.");
  }

  return { success: true, userId: found[0].id };
}

export async function requestPasswordReset(data: ForgotPasswordValues) {
  const parsed = forgotPasswordSchema.safeParse(data);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const error = new Error("Validation failed");
    (error as any).validation = errors;
    throw error;
  }

  const email = parsed.data.email.trim().toLowerCase();

  const found = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return {
    success: true,
    emailSent: found.length > 0,
  };
}
