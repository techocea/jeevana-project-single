ALTER TABLE "partner_preferences" RENAME COLUMN "preferred_religion" TO "preferred_religions";--> statement-breakpoint
ALTER TABLE "partner_preferences" RENAME COLUMN "preferred_caste" TO "preferred_castes";--> statement-breakpoint
ALTER TABLE "partner_preferences" RENAME COLUMN "preferred_marital_status" TO "preferred_marital_statuses";--> statement-breakpoint
ALTER TABLE "partner_preferences" RENAME COLUMN "preferred_citizenship" TO "preferred_residency_statuses";--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "photo_visible" boolean DEFAULT false NOT NULL;