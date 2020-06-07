CREATE TABLE "recipes" (
    "id" SERIAL PRIMARY KEY,
    "chef_id" int,
    "image" text,
    "title" text,
    "ingredients" text[],
    "preparation" text[],
    "information" text,
    "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
    "id" SERIAL PRIMARY KEY,
    "name" text,
    "avatar_url" text,
    "created_at" timestamp DEFAULT (now())
);

ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");