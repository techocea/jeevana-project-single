CREATE TABLE "profile_matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"matched_profile_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"match_reasons" text[],
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_matches" ADD CONSTRAINT "profile_matches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_matches" ADD CONSTRAINT "profile_matches_matched_profile_id_profiles_id_fk" FOREIGN KEY ("matched_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_match_idx" ON "profile_matches" USING btree ("user_id","matched_profile_id");