ALTER TABLE "reports" RENAME COLUMN "user_id" TO "reporter_id";--> statement-breakpoint
-- ALTER TABLE "reports" ADD COLUMN "category_id" uuid NOT NULL;--> statement-breakpoint
-- ALTER TABLE "reports" ADD CONSTRAINT "reports_category_id_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id");