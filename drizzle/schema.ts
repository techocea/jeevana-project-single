import { sql } from "drizzle-orm";
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

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: roleEnum("role").default("USER").notNull(),
  onboardingStatus: varchar("onboarding_status", { length: 20 })
    .default("INCOMPLETE") // INCOMPLETE, VERIFYING, APPROVED
    .notNull(),
  onboardingStep: varchar("onboarding_step", { length: 20 })
    .default("START") // ''START' | 'RELIGION' | 'ACHIEVEMENTS' | 'LOCATION' | 'PERSONAL' | 'COMPLETED'
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  profileID: varchar("profile_id", { length: 20 })
    .default(sql`concat('JV', nextval('profile_id_seq'))`)
    .notNull()
    .unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),

  // Basic Info (Step 1)
  createdBy: text("created_by"), // 'self' | 'parent' | 'guardian' | 'sibling' | 'friend'
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

  status: text("status").default("PENDING"), // 'pending' | 'approved' | 'rejected'
  paymentStatus: text("payment_status").default("UNPAID"), // 'unpaid' | 'paid'

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

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
