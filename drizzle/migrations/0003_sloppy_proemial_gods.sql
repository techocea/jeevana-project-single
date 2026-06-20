CREATE TYPE "public"."app_role" AS ENUM('ADMIN', 'STAFF', 'USER');--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "profile_id" TO "role";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_profile_id_unique";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "payment_status" SET DEFAULT 'paif';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "profile_id" varchar(20) DEFAULT concat('JV', nextval('profile_id_seq')) NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "age" integer;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_unique" UNIQUE("profile_id");