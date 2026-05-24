ALTER TABLE "users" ADD COLUMN "onboarding_step" varchar(20) DEFAULT 'PERSONAL' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "email";