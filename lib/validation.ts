import { z } from "zod";

export const stepOneSchema = z.object({
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
  gender: z.enum(["male", "female"]).nullable(),
  maritalStatus: z.enum(["divorced", "widowed", "single"]).nullable(),
  dob: z.coerce
    .date()
    .max(new Date(), "Date of birth cannot be in the future")
    .nullable()
    .optional(),
  age: z.number().int().positive().optional(),
  religion: z.string().max(100).nullable().optional(),
  caste: z.string().max(100).nullable().optional(),
  subCaste: z.string().max(100).nullable().optional(),
  motherTongue: z.string().max(100).nullable().optional(),
});

// Step 2 Schema: Habbits & Physical Attributes
export const stepTwoSchema = z.object({
  height: z.string().optional(),
  weight: z.string().optional(),
  smoking: z.enum(["never", "occasionally", "regularly"]).nullable().optional(),
  complexion: z.enum(["fair", "dark", "chocolate"]).nullable().optional(),
  bodyType: z.enum(["slim", "chubby", "regular"]).nullable().optional(),
  bloodGroup: z.enum(["O+", "O-", "A+","A-","B+","B-"]).nullable().optional(),
  drinking: z
      .enum(["never", "occasionally", "regularly"])
      .nullable()
      .optional(),
  foodPreferences: z
      .enum(["vegetarian", "non-vegetarian", "vegan"])
      .nullable()
      .optional(),
  isDifferentlyAbled: z.boolean().default(false).optional(),
  differentlyAbledDetails: z.string().max(1000).nullable().optional(),
});

// Step 3 Schema: Education & Career
export const stepThreeSchema = z.object({
  educationQualification: z.string().max(100).nullable().optional(),
  institute: z.string().max(100).nullable().optional(),
  profession: z.string().max(100).nullable().optional(),
  employedIn: z.string().max(100).nullable().optional(),
  annualIncomeRange: z.string().max(100).nullable().optional(),
});

// Step 4 Schema: Location Architecture
export const stepFourSchema = z.object({
  country: z.string().optional(),
  state: z.string().max(100).nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  residencyStatus: z.enum(["CITIZEN", "PR_VISA", "WORK_VISA","STUDENT_VISA","ASYLUM"]).nullable().optional(),
});

// Step 5 Schema: About me & Photograph
export const stepFiveSchema = z.object({
  narrative: z
      .string()
      .min(20, "Bio introduction must be at least 20 characters")
      .max(2000)
      .nullable()
      .optional(),
  profilePic: z.url("Invalid image path location").nullable(),
});

// Step 6 Schema: Partner Preferences
export const stepSixSchema = z.object({
  preferredMinAge: z.number().int().positive().optional(),
  preferredMaxAge: z.number().int().positive().optional(),
  preferredMinHeight: z.string().optional(),
  preferredMaxHeight: z.string().optional(),
  preferredEducationLevels: z.array(z.string()).default([]),
  preferredProfessions: z.array(z.string()).default([]),
  preferredAnnualIncomeRanges: z.array(z.string()).default([]),
  preferredResidencyCountry: z.array(z.string()).default([]),
  preferredResidencyStatus: z.array(z.string()).default([]),
});


export const contactFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
  email: z.email({ message: "Enter a valid email address" }),
  interest: z.enum(["partnership", "feedback", "create_advertisement"]),
  message: z.string().min(10, { message: "Message is required" }),
});

export const createUserByAdminSchema = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  fullName: z.string().min(2, "Full name required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["user", "admin"]).default("user"),
  emailConfirm: z.boolean().default(true), // Skip manual confirmation link for admin-created users
});

export const authRegisterSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required" }),
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

export const completeOnboardingSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema)
  .merge(stepFourSchema)
  .merge(stepFiveSchema)
  .merge(stepSixSchema);

export type OnboardingFormValues = z.infer<typeof completeOnboardingSchema>;
export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type AuthRegisterValues = z.infer<typeof authRegisterSchema>;
export type AuthLoginValues = z.infer<typeof authLoginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type CreateUserByAdminValues = z.infer<typeof createUserByAdminSchema>;
