-- CreateEnum
CREATE TYPE "RationaleSource" AS ENUM ('OWN', 'KARPATHY_JOBS');

-- AlterTable
ALTER TABLE "Career" ADD COLUMN     "rationaleSource" "RationaleSource" NOT NULL DEFAULT 'OWN';


-- Backfill provenance. The column defaults to 'OWN', which is correct for 22 of
-- the 29 careers; these 7 rationales are reproduced verbatim from karpathy/jobs
-- and must not be presented as our own analysis. Matched on slug, which is
-- unique and stable (it is the public URL segment).
UPDATE "Career" SET "rationaleSource" = 'KARPATHY_JOBS'
WHERE "slug" IN (
  'accountant',
  'actuary',
  'architect',
  'biologist-lab-scientist',
  'civil-engineer',
  'data-analyst',
  'environmental-scientist'
);
