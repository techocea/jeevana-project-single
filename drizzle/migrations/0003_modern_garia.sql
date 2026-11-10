ALTER TABLE "users" ALTER COLUMN "onboarding_step" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "onboarding_step" SET DEFAULT 'START'::text;--> statement-breakpoint
DROP TYPE "public"."onboarding_step";--> statement-breakpoint
CREATE TYPE "public"."onboarding_step" AS ENUM('START', 'PHYSICAL_ATTRIBUTES', 'EDUCATION_CAREER', 'ABOUT_ME', 'PARTNER_PREFERENCES', 'COMPLETED');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "onboarding_step" SET DEFAULT 'START'::"public"."onboarding_step";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "onboarding_step" SET DATA TYPE "public"."onboarding_step" USING "onboarding_step"::"public"."onboarding_step";--> statement-breakpoint
ALTER TABLE "partner_preferences" ALTER COLUMN "preferred_marital_statuses" SET DATA TYPE text;