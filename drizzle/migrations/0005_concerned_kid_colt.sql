ALTER TYPE "public"."role" RENAME TO "app_role";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "role" TO "app_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "onboarding_status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "onboarding_step" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "membership_plan" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id");