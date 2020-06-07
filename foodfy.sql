CREATE TABLE "recipes" (
    "id" SERIAL PRIMARY KEY,
    "chef_id" int,
    "image" text,
    "title" text,
    "ingredients" text[],
    "preparation" text[],
    "information" text,
    "created_at" timestamp
);

CREATE TABLE "chefs" (
    "id" SERIAL PRIMARY KEY,
    "name" text,
    "avatar_url" text,
    "created_at" timestamp
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");