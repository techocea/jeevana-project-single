import { describe, it, expect } from "vitest";
import {
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
  stepFourSchema,
  stepTwoSchema,
  stepSixSchema,
  stepSevenPreferencesSchema,
  authRegisterSchema,
  authLoginSchema,
  forgotPasswordSchema,
  contactFormSchema,
  createUserByAdminSchema,
} from "@/lib/validation";

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Basic Information
// ─────────────────────────────────────────────────────────────────────────────
describe("stepOneBasicSchema", () => {
  const validBase = {
    createdBy: "self" as const,
    gender: "male" as const,
    maritalStatus: "divorced" as const, // "divorced" is valid in both schema AND DB
    profilePic: "https://cdn.example.com/avatar.jpg",
  };

  it("accepts a minimal valid payload", () => {
    expect(() => stepOneSchema.parse(validBase)).not.toThrow();
  });

  it("accepts all valid createdBy values", () => {
    const values = ["self", "parent", "guardian", "sibling", "friend"] as const;
    values.forEach((v) => {
      const result = stepOneSchema.safeParse({ ...validBase, createdBy: v });
      expect(result.success).toBe(true);
    });
  });

  it("rejects createdBy values outside the enum", () => {
    const result = stepOneSchema.safeParse({
      ...validBase,
      createdBy: "robot",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid profilePic URL", () => {
    const result = stepOneSchema.safeParse({
      ...validBase,
      profilePic: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("accepts null profilePic (photo is optional)", () => {
    const result = stepOneSchema.safeParse({
      ...validBase,
      profilePic: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects a future date of birth", () => {
    const result = stepOneSchema.safeParse({
      ...validBase,
      dob: new Date(Date.now() + 86_400_000),
    });
    expect(result.success).toBe(false);
  });

  it("accepts a past date of birth", () => {
    const result = stepOneSchema.safeParse({
      ...validBase,
      dob: new Date("1990-05-20"),
    });
    expect(result.success).toBe(true);
  });

  // ── KNOWN BUG documented as test ──────────────────────────────────────────
  // The schema uses "single" but the database enum uses "never_married".
  // The test below FAILS until validation.ts is fixed (Task 1).
  it("KNOWN BUG — 'never_married' should be a valid maritalStatus (fails until fixed)", () => {
    const result = stepOneSchema.safeParse({
      ...validBase,
      maritalStatus: "never_married",
    });
    // After the fix this must be true. Currently false because schema uses "single".
    expect(result.success).toBe(true);
  });

  it("CURRENT BEHAVIOR — 'single' is accepted by schema but is wrong DB value", () => {
    const result = stepOneSchema.safeParse({
      ...validBase,
      maritalStatus: "single",
    });
    // Documents current (broken) schema state so the regression is visible.
    expect(result.success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Religion
// ─────────────────────────────────────────────────────────────────────────────
describe("stepTwoReligionSchema", () => {
  it("accepts a fully empty object (all fields optional)", () => {
    expect(() => stepTwoSchema.parse({})).not.toThrow();
  });

  it("accepts valid religion, caste, and motherTongue", () => {
    const result = stepTwoSchema.safeParse({
      religion: "Buddhism",
      caste: "Sinhalese",
      motherTongue: "Sinhala",
    });
    expect(result.success).toBe(true);
  });

  it("rejects religion string longer than 100 characters", () => {
    const result = stepTwoSchema.safeParse({
      religion: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Achievements / Education / Career
// ─────────────────────────────────────────────────────────────────────────────
describe("stepThreeAchievementsSchema", () => {
  it("accepts an empty object (all optional)", () => {
    expect(() => stepThreeSchema.parse({})).not.toThrow();
  });

  it("accepts valid education level and profession", () => {
    const result = stepThreeSchema.safeParse({
      educationLevel: "Bachelor",
      profession: "Software Engineer",
      annualIncomeRange: "LKR 1M–2M",
    });
    expect(result.success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Location
// ─────────────────────────────────────────────────────────────────────────────
describe("stepFourLocationSchema", () => {
  it("accepts an empty object", () => {
    expect(() => stepFourSchema.parse({})).not.toThrow();
  });

  it("accepts valid residencyStatus values", () => {
    (["CITIZEN", "PR", "WORK"] as const).forEach((status) => {
      const result = stepFourSchema.safeParse({ residencyStatus: status });
      expect(result.success).toBe(true);
    });
  });

  it("rejects invalid residencyStatus", () => {
    const result = stepFourSchema.safeParse({
      residencyStatus: "TOURIST",
    });
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — Personal / Physical / Bio
// ─────────────────────────────────────────────────────────────────────────────
describe("stepFivePersonalSchema", () => {
  it("accepts an empty object (all optional)", () => {
    expect(() => stepTwoSchema.parse({})).not.toThrow();
  });

  it("accepts a fully populated valid payload", () => {
    const result = stepTwoSchema.safeParse({
      narrative: "A".repeat(25),
      smoking: "never",
      drinking: "occasionally",
      foodPreferences: "vegetarian",
      isDifferentlyAbled: false,
      height: "170.0",
      weight: "65",
    });
    expect(result.success).toBe(true);
  });

  it("rejects bio narrative shorter than 20 characters", () => {
    const result = stepTwoSchema.safeParse({
      narrative: "Too short",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Bio introduction must be at least 20 characters"
    );
  });

  it("rejects bio narrative longer than 2000 characters", () => {
    const result = stepTwoSchema.safeParse({
      narrative: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid smoking value", () => {
    const result = stepTwoSchema.safeParse({ smoking: "sometimes" });
    expect(result.success).toBe(false);
  });

  it("accepts all valid smoking values", () => {
    (["never", "occasionally", "regularly"] as const).forEach((v) => {
      expect(stepTwoSchema.safeParse({ smoking: v }).success).toBe(true);
    });
  });

  it("rejects invalid foodPreferences value", () => {
    const result = stepTwoSchema.safeParse({
      foodPreferences: "pescatarian",
    });
    expect(result.success).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 6 — Hobbies
// ─────────────────────────────────────────────────────────────────────────────
describe("stepSixHobbiesSchema", () => {
  it("requires at least one hobby", () => {
    const result = stepSixSchema.safeParse({ hobbies: [] });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(
      "Please select at least one hobby"
    );
  });

  it("accepts a single-item hobby array", () => {
    const result = stepSixSchema.safeParse({ hobbies: ["Reading"] });
    expect(result.success).toBe(true);
  });

  it("accepts multiple hobbies", () => {
    const result = stepSixSchema.safeParse({
      hobbies: ["Reading", "Cooking", "Hiking"],
    });
    expect(result.success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 7 — Partner Preferences
// ─────────────────────────────────────────────────────────────────────────────
describe("stepSevenPreferencesSchema", () => {
  it("accepts a minimal valid payload (required field only)", () => {
    const result = stepSevenPreferencesSchema.safeParse({
      preferredMaritalStatus: "never_married",
    });
    expect(result.success).toBe(true);
  });

  it("defaults empty arrays for optional array fields", () => {
    const result = stepSevenPreferencesSchema.parse({
      preferredMaritalStatus: "never_married",
    });
    expect(result.preferredEducationLevels).toEqual([]);
    expect(result.preferredProfessions).toEqual([]);
    expect(result.preferredAnnualIncomeRanges).toEqual([]);
  });

  it("accepts age range fields when provided", () => {
    const result = stepSevenPreferencesSchema.safeParse({
      preferredMaritalStatus: "never_married",
      preferredMinAge: 25,
      preferredMaxAge: 35,
    });
    expect(result.success).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Auth schemas
// ─────────────────────────────────────────────────────────────────────────────
describe("authRegisterSchema", () => {
  it("accepts valid registration data", () => {
    const result = authRegisterSchema.safeParse({
      fullName: "Test User",
      email: "test@example.com",
      password: "securepass123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = authRegisterSchema.safeParse({
      fullName: "Test User",
      email: "test@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = authRegisterSchema.safeParse({
      fullName: "Test User",
      email: "bad-email",
      password: "securepass123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a full name shorter than 2 characters", () => {
    const result = authRegisterSchema.safeParse({
      fullName: "A",
      email: "test@example.com",
      password: "securepass123",
    });
    expect(result.success).toBe(false);
  });
});

describe("authLoginSchema", () => {
  it("accepts valid credentials shape", () => {
    const result = authLoginSchema.safeParse({
      email: "admin@jeevana.lk",
      password: "securepass",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing email", () => {
    const result = authLoginSchema.safeParse({ password: "securepass" });
    expect(result.success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "user@jeevana.lk" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);
  });
});

describe("contactFormSchema", () => {
  const validContact = {
    fullName: "John Doe",
    email: "john@example.com",
    interest: "feedback" as const,
    message: "This is a test message that is long enough.",
  };

  it("accepts a valid contact submission", () => {
    expect(() => contactFormSchema.parse(validContact)).not.toThrow();
  });

  it("rejects message shorter than 10 characters", () => {
    const result = contactFormSchema.safeParse({
      ...validContact,
      message: "short",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid interest values", () => {
    (["partnership", "feedback", "create_advertisement"] as const).forEach(
      (interest) => {
        const result = contactFormSchema.safeParse({ ...validContact, interest });
        expect(result.success).toBe(true);
      }
    );
  });

  it("rejects invalid interest value", () => {
    const result = contactFormSchema.safeParse({
      ...validContact,
      interest: "spam",
    });
    expect(result.success).toBe(false);
  });
});

describe("createUserByAdminSchema", () => {
  const validAdmin = {
    email: "newuser@jeevana.lk",
    fullName: "New User",
    password: "adminpassword",
    role: "user" as const,
    emailConfirm: true,
  };

  it("accepts valid admin-created user payload", () => {
    expect(() => createUserByAdminSchema.parse(validAdmin)).not.toThrow();
  });

  it("accepts role = admin", () => {
    const result = createUserByAdminSchema.safeParse({
      ...validAdmin,
      role: "admin",
    });
    expect(result.success).toBe(true);
  });

  it("rejects password shorter than 8 characters", () => {
    const result = createUserByAdminSchema.safeParse({
      ...validAdmin,
      password: "abc",
    });
    expect(result.success).toBe(false);
  });
});
