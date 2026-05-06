CREATE TABLE "buildings" (
	"id" uuid PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"created_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"created_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY,
	"user_id" uuid NOT NULL,
	"room_id" uuid NOT NULL,
	"description" varchar(255),
	"image_url" varchar(255),
	"status" varchar(50),
	"is_urgent" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY,
	"name" varchar(100) NOT NULL,
	"building_id" uuid NOT NULL,
	"created_at" date DEFAULT now(),
	"floor" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_room_id_rooms_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id");--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_building_id_buildings_id_fkey" FOREIGN KEY ("building_id") REFERENCES "buildings"("id");