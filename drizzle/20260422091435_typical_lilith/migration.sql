-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL CONSTRAINT "users_email_unique" UNIQUE,
	"password" varchar(255) NOT NULL,
	"role_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_id_unique" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "roles"("id");
*/