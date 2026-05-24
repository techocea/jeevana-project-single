CREATE SEQUENCE "public"."profile_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1000 CACHE 1;--> statement-breakpoint
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
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"tenant" text NOT NULL,
	"profile_pic" text,
	"full_name" text,
	"email" text,
	"contact" text,
	"gender" text,
	"dob" date,
	"religion" text,
	"caste" text,
	"mother_tongue" text,
	"education_level" text,
	"profession" text,
	"annual_income_range" text,
	"country" text DEFAULT 'Sri Lanka',
	"state" text,
	"city" text,
	"height_cm" integer,
	"weight_kg" integer,
	"narrative" text,
	"status" text DEFAULT 'PENDING',
	"payment_status" text DEFAULT 'UNPAID',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" varchar(20) DEFAULT concat('JV', nextval('profile_id_seq')) NOT NULL,
	"email" varchar(255) NOT NULL,
	"onboarding_status" varchar(20) DEFAULT 'INCOMPLETE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_profile_id_unique" UNIQUE("profile_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;