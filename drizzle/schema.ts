import { relations, sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  varchar,
  pgSequence,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const profileSeq = pgSequence("profile_id_seq", {
  startWith: 1000,
  increment: 1,
});

export const roleEnum = pgEnum("app_role", ["ADMIN", "STAFF", "USER"]);
export const onboardingEnum = pgEnum("onboarding_status", [
  "INCOMPLETED",
  "COMPLETED",
]);
export const onboardingStepEnum = pgEnum("onboarding_step", [
  "START",
  "RELIGION",
  "ACHIEVEMENTS",
  "LOCATION",
  "PERSONAL",
  "HOBBIES",
  "COMPLETED",
]);
export const profileStatusEnum = pgEnum("profile_status", [
  "pending",
  "approved",
  "rejected",
]);
export const userStatusEnum = pgEnum("user_status", [
  "pending",
  "active",
  "flagged",
  "suspended",
]);
//  pending - grace period to make the payment and continue
//  flagged - after completion of the full process, so later if wanted they can create a another profile
//  suspended - cannot work furthur
export const membershipEnum = pgEnum("membership_plan", [
  "free_tier",
  "classical",
  "heritage",
  "elite",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: roleEnum("role").default("USER").notNull(),

  onboardingStatus: onboardingEnum("onboarding_status")
    .default("INCOMPLETED")
    .notNull(),
  onboardingStep: onboardingStepEnum("onboarding_step")
    .default("START")
    .notNull(),

  status: userStatusEnum("user_status").default("pending").notNull(),
  membership: membershipEnum("membership_plan").default("free_tier").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileID: varchar("profile_id", { length: 20 })
    .default(sql`concat('JV', nextval('profile_id_seq'))`)
    .notNull()
    .unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),

  // Basic Info (Step 1)
  createdBy: text("created_by"), // 'self' | 'parent' | 'guardian' | 'sibling' | 'friend' | 'admin'
  fullName: text("full_name"),
  contact: text("contact"),
  gender: text("gender"),
  profilePic: text("profile_pic"),
  dob: date("dob", { mode: "date" }),

  // Professional (Step 2)
  religion: text("religion"),
  caste: text("caste"),
  motherTongue: text("mother_tongue"),

  // Preferences (Step 3)
  educationLevel: text("education_level"),
  profession: text("profession"),
  annualIncomeRange: text("annual_income_range"),

  // Location (Step 4)
  country: text("country"),
  state: text("state"),
  city: text("city"),
  residencyStatus: text("residency_status"), // citizen, pr, work

  // Final (Step 5)
  height: text("height_cm"),
  weight: text("weight_kg"),
  age: integer("age"),
  narrative: text("narrative"),
  smoking: text("smoking_habits"), // 'never' | 'occasionally' | 'regularly'
  drinking: text("drinking_habits"), // 'never' | 'occasionally' | 'regularly'
  foodPreferences: text("food_preferences"), // 'vegetarian' | 'non-vegetarian' | 'vegan'
  isDifferentlyAbled: boolean("is_differently_abled").default(false),
  differentlyAbledDetails: text("differently_abled_details"),

  hobbies: text("hobbies").array(),

  status: profileStatusEnum("status").default("pending").notNull(), // 'pending' | 'approved' | 'rejected'

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: text("full_name").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  interest: text("interest").notNull(),
  message: text("message").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
