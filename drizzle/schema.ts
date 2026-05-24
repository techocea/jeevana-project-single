import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  date,
  varchar,
  pgSequence,
} from "drizzle-orm/pg-core";

export const profileSeq = pgSequence("profile_id_seq", {
  startWith: 1000,
  increment: 1,
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  profileID: varchar("profile_id", { length: 20 })
    .default(sql`concat('JV', nextval('profile_id_seq'))`)
    .notNull()
    .unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),

  onboardingStatus: varchar("onboarding_status", { length: 20 })
    .default("INCOMPLETE") // INCOMPLETE, VERIFYING, APPROVED
    .notNull(),
  onboardingStep: varchar("onboarding_step", { length: 20 })
    .default("PERSONAL") // 'PERSONAL' | 'RELIGION' | 'ACHIEVEMENTS' | 'LOCATION' | 'FINAL'
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  tenant: text("tenant").notNull(), // "jeevana" or "soulmate"

  // Basic Info (Step 1)
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
  country: text("country").default("Sri Lanka"),
  state: text("state"),
  city: text("city"),

  // Final (Step 5)
  height: integer("height_cm"),
  weight: integer("weight_kg"),
  narrative: text("narrative"),

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
