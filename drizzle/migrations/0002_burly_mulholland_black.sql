ALTER TABLE "profiles" RENAME COLUMN "tenant" TO "created_by";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "country" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "height_cm" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "weight_kg" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "onboarding_step" SET DEFAULT 'START';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "residency_status" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "smoking_habits" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "drinking_habits" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "food_preferences" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "is_differently_abled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "differently_abled_details" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "hobbies" text[];