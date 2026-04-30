ALTER TABLE "users" RENAME CONSTRAINT "users_role_id_roles_id_fk" TO "users_role_id_roles_id_fkey";--> statement-breakpoint
ALTER TABLE "users" RENAME CONSTRAINT "users_id_unique" TO "users_pkey";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();