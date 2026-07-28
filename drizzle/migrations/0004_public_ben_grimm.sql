CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."mail_routing" AS ENUM('owner', 'candidate', 'both');--> statement-breakpoint
CREATE TYPE "public"."marital_status" AS ENUM('never_married', 'divorced', 'widowed');--> statement-breakpoint
CREATE TYPE "public"."membership_plan" AS ENUM('free_tier', 'classical', 'heritage');--> statement-breakpoint
CREATE TYPE "public"."onboarding_status" AS ENUM('INCOMPLETED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."onboarding_step" AS ENUM('START', 'RELIGION', 'ACHIEVEMENTS', 'LOCATION', 'PERSONAL', 'HOBBIES', 'PREFERENCES', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."profile_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'banned');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('unverified', 'pending', 'verified', 'rejected');--> statement-breakpoint
ALTER TYPE "public"."app_role" RENAME TO "role";--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"favorited_by_profile_id" uuid NOT NULL,
	"target_profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sender_profile_id" uuid NOT NULL,
	"receiver_profile_id" uuid NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"preferred_min_age" integer,
	"preferred_max_age" integer,
	"preferred_marital_status" "marital_status" DEFAULT 'never_married',
	"preferred_education_levels" text[],
	"preferred_professions" text[],
	"preferred_annual_income_ranges" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"id_type" text NOT NULL,
	"id_number" text NOT NULL,
	"document_front_url" text NOT NULL,
	"document_back_url" text,
	"status" "verification_status" DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verifications_profile_id_unique" UNIQUE("profile_id")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::text;--> statement-breakpoint
DROP TYPE "public"."role";--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'::"public"."role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."profile_status";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "status" SET DATA TYPE "public"."profile_status" USING "status"::"public"."profile_status";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "onboarding_status" SET DEFAULT 'INCOMPLETED'::"public"."onboarding_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "onboarding_status" SET DATA TYPE "public"."onboarding_status" USING "onboarding_status"::"public"."onboarding_status";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "onboarding_step" SET DEFAULT 'START'::"public"."onboarding_step";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "onboarding_step" SET DATA TYPE "public"."onboarding_step" USING "onboarding_step"::"public"."onboarding_step";--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "mail_routing_target" "mail_routing" DEFAULT 'owner';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "secondary_email" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "full_name" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_status" "user_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "membership_plan" "membership_plan" DEFAULT 'free_tier' NOT NULL;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_favorited_by_profile_id_profiles_id_fk" FOREIGN KEY ("favorited_by_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_target_profile_id_profiles_id_fk" FOREIGN KEY ("target_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_sender_profile_id_profiles_id_fk" FOREIGN KEY ("sender_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_receiver_profile_id_profiles_id_fk" FOREIGN KEY ("receiver_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_preferences" ADD CONSTRAINT "partner_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_favorite_pair_idx" ON "favorites" USING btree ("favorited_by_profile_id","target_profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_invitation_pair_idx" ON "invitations" USING btree ("sender_profile_id","receiver_profile_id");--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "payment_status";

-- Drop trigger before altering column
DROP TRIGGER IF EXISTS on_drizzle_user_role_update ON users;

-- Drizzle's alter column statement
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE ...;

-- Re-create your trigger
CREATE TRIGGER on_drizzle_user_role_update
AFTER UPDATE OF role ON users
FOR EACH ROW
EXECUTE FUNCTION your_trigger_function();