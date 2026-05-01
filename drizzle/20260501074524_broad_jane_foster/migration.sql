ALTER TABLE "users" ADD COLUMN "nim" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_nim_key" UNIQUE("nim");