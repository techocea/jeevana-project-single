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
import { createClient } from "@/utils/supabase";
import { z } from "zod";
import { redirect } from "next/navigation";

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
    });
  } catch (dbError: any) {
    console.error("Drizzle mirror failure:", dbError);

    await supabase.auth.admin.deleteUser(authData.user.id);
    return { error: "Database registration failure. Please try again." };
  }

  // return {
  //   success: true,
  //   message: "Verification email sent! Please check your inbox to confirm your account."
  // };

  redirect("/auth?mode=login");
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

  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, authData.user.id))
    .limit(1);

  if (!dbUser || dbUser.onboardingStatus === "INCOMPLETE") {
    redirect("/onboarding");
  }

  redirect("/profile");
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
