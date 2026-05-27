import { z } from "zod";

export const stepOneBasicSchema = z.object({
  createdBy: z.enum(["self", "parent", "guardian", "sibling", "friend"]),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(255)
    .nullable()
    .optional(),
  contact: z
    .string()
    .min(9, "Valid contact number is required")
    .max(20)
    .nullable()
    .optional(),
  gender: z.enum(["MALE", "FEMALE"]).nullable(),
  profilePic: z.url("Invalid image path location").nullable(),
  dob: z.coerce
    .date()
    .max(new Date(), "Date of birth cannot be in the future")
    .nullable()
    .optional(),
});

// Step 2 Schema: Professional / Cultural Background
export const stepTwoReligionSchema = z.object({
  religion: z.string().max(100).nullable().optional(),
  caste: z.string().max(100).nullable().optional(),
  motherTongue: z.string().max(100).nullable().optional(),
});

// Step 3 Schema: Preferences & Career
export const stepThreeAchievementsSchema = z.object({
  educationLevel: z.string().max(100).nullable().optional(),
  profession: z.string().max(100).nullable().optional(),
  annualIncomeRange: z.string().max(100).nullable().optional(),
});

// Step 4 Schema: Location Architecture
export const stepFourLocationSchema = z.object({
  country: z.string().default("Sri Lanka").optional(),
  state: z.string().max(100).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  residencyStatus: z.enum(["CITIZEN", "PR", "WORK"]).nullable().optional(),
});

// Step 5 Schema: Physical Attributes & Bio Narrative
export const stepFivePersonalSchema = z.object({
  height: z.coerce
    .number()
    .int()
    .min(100, "Minimum height is 100cm")
    .max(250)
    .nullable()
    .optional(),
  weight: z.coerce
    .number()
    .int()
    .min(30, "Minimum weight is 30kg")
    .max(300)
    .nullable()
    .optional(),
  narrative: z
    .string()
    .min(20, "Bio introduction must be at least 20 characters")
    .max(2000)
    .nullable()
    .optional(),
  smoking: z.enum(["never", "occasionally", "regularly"]).nullable().optional(),
  drinking: z.enum(["never", "socially", "regularly"]).nullable().optional(),
  foodPreferences: z
    .enum(["vegetarian", "non-vegetarian", "vegan"])
    .nullable()
    .optional(),
  isDifferentlyAbled: z.boolean().default(false).optional(),
  differentlyAbledDetails: z.string().max(1000).nullable().optional(),
});

export const stepSixHobbiesSchema = z.object({
  hobbies: z.array(z.string()).min(1, "Please select at least one hobby"),
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
  .merge(stepThreeAchievementsSchema)
  .merge(stepFourLocationSchema)
  .merge(stepFivePersonalSchema)
  .merge(stepSixHobbiesSchema);

export type OnboardingFormValues = z.infer<typeof completeOnboardingSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type AuthRegisterValues = z.infer<typeof authRegisterSchema>;
export type AuthLoginValues = z.infer<typeof authLoginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
