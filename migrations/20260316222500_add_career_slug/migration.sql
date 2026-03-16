-- AlterTable: add nullable slug column first
ALTER TABLE "Career" ADD COLUMN "slug" TEXT;

-- Populate slugs from name: lowercase, replace non-alphanumeric with hyphens, collapse multiples
UPDATE "Career" SET "slug" = LOWER(REGEXP_REPLACE(REGEXP_REPLACE("name", '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'));

-- Make slug required and unique
ALTER TABLE "Career" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Career_slug_key" ON "Career"("slug");
