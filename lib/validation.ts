import { z } from "zod";

export const contactFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.email({ message: "Enter a valid email address" }),
  interest: z.enum(["general", "partnership", "feedback", "membership"]),
  message: z.string().min(10, { message: "Message is required" }),
});

export const authRegisterSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const authLoginSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  password: z.string().min(8, { message: "Password is required" }),
});

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type AuthRegisterValues = z.infer<typeof authRegisterSchema>;
export type AuthLoginValues = z.infer<typeof authLoginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
