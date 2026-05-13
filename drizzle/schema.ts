import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  date,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  tenant: text("tenant").notNull(), // "jeevana" or "soulmate"

  // Basic Info (Step 1)
  fullName: text("full_name").notNull(),
  email: text("email"),
  contact: text("contact").notNull(),
  gender: text("gender").notNull(),
  dob: date("dob", { mode: "date" }).notNull(),

  // Professional (Step 2)
  religion: text("religion").notNull(),
  caste: text("caste").notNull(),
  motherTongue: text("mother_tongue").notNull(),

  // Preferences (Step 3)
  educationLevel: text("education_level").notNull(),
  profession: text("profession").notNull(),
  annualIncomeRange: text("annual_income_range").notNull(),

  // Location (Step 4)
  country: text("country").default("Sri Lanka"),
  state: text("state").notNull(),
  city: text("city").notNull(),

  // Final (Step 5)
  height: integer("height_cm").notNull(),
  weight: integer("weight_kg").notNull(),
  narrative: text("narrative"),

  status: text("status").default("pending"), // 'pending' | 'approved' | 'rejected'
  paymentStatus: text("payment_status").default("unpaid"), // 'unpaid' | 'paid'

  createdAt: timestamp("created_at").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
