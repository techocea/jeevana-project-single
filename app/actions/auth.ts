"use server";

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
import { createClient } from "@/utils/supabase";
import { z } from "zod";

export async function registerUser(data: AuthRegisterValues) {
  const parsed = authRegisterSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: "Validation failed",
      fields: z.treeifyError(parsed.error).errors,
    };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: authError?.message || "Registration failed." };
  }

  try {
    await db.insert(users).values({
      id: authData.user.id,
      email,
      onboardingStatus: "INCOMPLETE",
      onboardingStep: "START",
    });
  } catch (dbError: any) {
    console.error("[DRIZZLE_REGISTRATION_MIRROR_FAILURE]:", dbError);

    return {
      error:
        "Account initialization failed. If this persists, your email might already be registered.",
    };
  }
  return {
    success: true,
    // Pass this boolean flag back so your client UI knows if it needs to say
    // "Check your email!" or if it can auto-login/redirect.
    emailVerificationRequired: authData.session === null,
  };
}

export async function loginUser(data: AuthLoginValues) {
  const parsed = authLoginSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: "Validation failed",
      fields: z.treeifyError(parsed.error).errors,
    };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;

  const supabase = await createClient();

  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError || !authData.user) {
    return { error: "Invalid email or password." };
  }

  let dbUser;
  try {
    const [fetchedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, authData.user.id))
      .limit(1);

    dbUser = fetchedUser;
  } catch (error) {
    console.error("[DATABASE_READ_FAILURE]:", error);
    return { error: "A secure connection error occurred. Please try again." };
  }

  let targetRoute = "/my-matches";

  if (!dbUser || dbUser.onboardingStatus === "INCOMPLETE") {
    targetRoute = "/onboarding";
  }

  return {
    success: true,
    targetRoute,
  };
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
