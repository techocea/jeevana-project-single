CREATE TABLE "profile_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"viewer_user_id" uuid NOT NULL,
	"viewed_profile_id" uuid NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile_views" ADD CONSTRAINT "profile_views_viewer_user_id_users_id_fk" FOREIGN KEY ("viewer_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_views" ADD CONSTRAINT "profile_views_viewed_profile_id_profiles_id_fk" FOREIGN KEY ("viewed_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profile_views_viewed_profile_idx" ON "profile_views" USING btree ("viewed_profile_id");--> statement-breakpoint
CREATE INDEX "profile_views_viewer_profile_idx" ON "profile_views" USING btree ("viewer_user_id","viewed_profile_id");