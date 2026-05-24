import { z } from "zod";

export const stepOneBasicSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  contact: z.string().min(10, { message: "Contact number is required" }),
  gender: z.enum(["MALE", "FEMALE"]),
  dob: z.string(),
});

// Step 2 Schema: Professional / Cultural Background
export const stepTwoReligionSchema = z.object({
  religion: z.string().min(2, { message: "Religion parameter is required" }),
  caste: z
    .string()
    .min(2, { message: "Caste/Community selection is required" }),
  motherTongue: z.string().min(2, { message: "Mother tongue is required" }),
});

// Step 3 Schema: Preferences & Career
export const stepThreePreferencesSchema = z.object({
  educationLevel: z
    .string()
    .min(2, { message: "Education history is required" }),
  profession: z
    .string()
    .min(2, { message: "Current employment field is required" }),
  annualIncomeRange: z
    .string()
    .min(2, { message: "Income bracket selection is required" }),
});

// Step 4 Schema: Location Architecture
export const stepFourLocationSchema = z.object({
  country: z.string().default("Sri Lanka"),
  state: z.string().min(2, { message: "Province/State is required" }),
  city: z.string().min(2, { message: "City is required" }),
});

// Step 5 Schema: Physical Attributes & Bio Narrative
export const stepFiveFinalSchema = z.object({
  height: z
    .number()
    .int()
    .min(100, { message: "Height must be valid in centimeters" }),
  weight: z
    .number()
    .int()
    .min(30, { message: "Weight must be valid in kilograms" }),
  narrative: z.string().min(20, {
    message: "Bio introduction description must be at least 20 characters long",
  }),
});

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

export const completeOnboardingSchema = stepOneBasicSchema
  .merge(stepTwoReligionSchema)
  .merge(stepThreePreferencesSchema)
  .merge(stepFourLocationSchema)
  .merge(stepFiveFinalSchema);

export type OnboardingFormValues = z.infer<typeof completeOnboardingSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type AuthRegisterValues = z.infer<typeof authRegisterSchema>;
export type AuthLoginValues = z.infer<typeof authLoginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
