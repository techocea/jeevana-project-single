"use server";

import { contactFormSchema, type ContactFormValues } from "@/lib/validation";
import { db } from "@/lib/db";
import { contacts } from "@/drizzle/schema";

export async function createContactInquiry(data: ContactFormValues) {
  const parsed = contactFormSchema.safeParse(data);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const error = new Error("Validation failed");
    (error as any).validation = errors;
    throw error;
  }

  await db.insert(contacts).values({
    fullName: parsed.data.fullName.trim(),
    email: parsed.data.email.trim().toLowerCase(),
    interest: parsed.data.interest,
    message: parsed.data.message.trim(),
  });

  return { success: true };
}
