CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."mail_routing" AS ENUM('owner', 'candidate', 'both');--> statement-breakpoint
CREATE TYPE "public"."marital_status" AS ENUM('single', 'divorced', 'widowed');--> statement-breakpoint
CREATE TYPE "public"."membership_plan" AS ENUM('free_tier', 'classical', 'heritage');--> statement-breakpoint
CREATE TYPE "public"."onboarding_status" AS ENUM('INCOMPLETED', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."onboarding_step" AS ENUM('START', 'RELIGION', 'ACHIEVEMENTS', 'LOCATION', 'PERSONAL', 'HOBBIES', 'PREFERENCES', 'COMPLETED');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."profile_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."residency_status" AS ENUM('CITIZEN', 'PR_VISA', 'WORK_VISA', 'STUDENT_VISA', 'ASYLUM');--> statement-breakpoint
CREATE TYPE "public"."app_role" AS ENUM('user', 'staff', 'admin');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('inactive', 'active', 'expired');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'banned');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('pending', 'verified', 'rejected');--> statement-breakpoint
CREATE SEQUENCE "public"."profile_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1000 CACHE 1;--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"favorited_by_profile_id" uuid NOT NULL,
	"target_profile_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"interest" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"package_id" integer NOT NULL,
	"package_name" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"payments_lk_checkout_id" text,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"preferred_min_age" integer,
	"preferred_max_age" integer,
	"preferred_min_height" integer,
	"preferred_max_height" integer,
	"preferred_religion" integer,
	"preferred_caste" integer,
	"preferred_marital_status" "marital_status" DEFAULT 'single',
	"preferred_education_levels" text[],
	"preferred_professions" text[],
	"preferred_annual_income_ranges" text[],
	"preferred_citizenship" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "partner_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "profile_matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"matched_profile_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"match_reasons" text[],
	"viewed_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"viewer_user_id" uuid NOT NULL,
	"viewed_profile_id" uuid NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" varchar(20) DEFAULT concat
        ('JV', nextval('profile_id_seq')) NOT NULL,
	"user_id" uuid,
	"created_by" text,
	"full_name" text,
	"gender" text,
	"marital_status" "marital_status",
	"dob" date,
	"religion" text,
	"caste" text,
	"sub_caste" text,
	"mother_tongue" text,
	"height_cm" text,
	"weight_kg" text,
	"complexion" text,
	"body_type" text,
	"blood_group" text,
	"smoking_habits" text,
	"drinking_habits" text,
	"food_preferences" text,
	"is_differently_abled" boolean DEFAULT false,
	"differently_abled_details" text,
	"education_level" text,
	"education_description" text,
	"profession" text,
	"employed_in" text,
	"annual_income_range" text,
	"country" text,
	"state" text,
	"city" text,
	"residency_status" "residency_status",
	"profile_pic" text,
	"narrative" text,
	"hobbies" text[],
	"mail_routing_target" "mail_routing" DEFAULT 'owner',
	"secondary_email" text,
	"status" "profile_status" DEFAULT 'pending' NOT NULL,
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_profile_id_unique" UNIQUE("profile_id"),
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"package_id" integer,
	"package_name" text,
	"status" "subscription_status" DEFAULT 'inactive' NOT NULL,
	"started_at" timestamp,
	"expires_at" timestamp,
	"last_order_id" uuid,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text,
	"email" varchar(255) NOT NULL,
	"app_role" "app_role" DEFAULT 'user' NOT NULL,
	"onboarding_status" "onboarding_status" DEFAULT 'INCOMPLETED',
	"onboarding_step" "onboarding_step" DEFAULT 'START',
	"user_status" "user_status" DEFAULT 'active' NOT NULL,
	"membership_plan" "membership_plan" DEFAULT 'free_tier',
	"is_verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
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
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_favorited_by_profile_id_profiles_id_fk" FOREIGN KEY ("favorited_by_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_target_profile_id_profiles_id_fk" FOREIGN KEY ("target_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_sender_profile_id_profiles_id_fk" FOREIGN KEY ("sender_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_receiver_profile_id_profiles_id_fk" FOREIGN KEY ("receiver_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_preferences" ADD CONSTRAINT "partner_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_matches" ADD CONSTRAINT "profile_matches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_matches" ADD CONSTRAINT "profile_matches_matched_profile_id_profiles_id_fk" FOREIGN KEY ("matched_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_views" ADD CONSTRAINT "profile_views_viewer_user_id_users_id_fk" FOREIGN KEY ("viewer_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_views" ADD CONSTRAINT "profile_views_viewed_profile_id_profiles_id_fk" FOREIGN KEY ("viewed_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_last_order_id_orders_id_fk" FOREIGN KEY ("last_order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_favorite_pair_idx" ON "favorites" USING btree ("favorited_by_profile_id","target_profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_invitation_pair_idx" ON "invitations" USING btree ("sender_profile_id","receiver_profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_match_idx" ON "profile_matches" USING btree ("user_id","matched_profile_id");--> statement-breakpoint
CREATE INDEX "profile_views_viewed_profile_idx" ON "profile_views" USING btree ("viewed_profile_id");--> statement-breakpoint
CREATE INDEX "profile_views_viewer_profile_idx" ON "profile_views" USING btree ("viewer_user_id","viewed_profile_id");