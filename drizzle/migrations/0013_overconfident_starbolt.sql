ALTER TYPE "public"."app_role" ADD VALUE 'staff' BEFORE 'admin';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false;