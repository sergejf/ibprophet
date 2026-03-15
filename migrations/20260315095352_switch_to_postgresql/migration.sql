-- CreateEnum
CREATE TYPE "SubjectCategory" AS ENUM ('HL_ONLY', 'SL_ONLY', 'BOTH');

-- CreateEnum
CREATE TYPE "AIResilience" AS ENUM ('GREEN', 'YELLOW', 'RED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IBSubject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group" INTEGER NOT NULL,
    "category" "SubjectCategory" NOT NULL,

    CONSTRAINT "IBSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityPathway" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "field" TEXT NOT NULL,

    CONSTRAINT "UniversityPathway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Career" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "salaryStartUS" INTEGER NOT NULL,
    "salaryMidUS" INTEGER NOT NULL,
    "salaryStartUK" INTEGER NOT NULL,
    "salaryMidUK" INTEGER NOT NULL,
    "growthPercent10Y" DOUBLE PRECISION NOT NULL,
    "aiResilience" "AIResilience" NOT NULL,
    "pros" TEXT NOT NULL,
    "cons" TEXT NOT NULL,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectPathwayLink" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "pathwayId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,
    "hlRequired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SubjectPathwayLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathwayCareerLink" (
    "id" TEXT NOT NULL,
    "pathwayId" TEXT NOT NULL,
    "careerId" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PathwayCareerLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedLoadout" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subjectConfig" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SavedLoadout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthIdentity" (
    "providerName" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "providerData" TEXT NOT NULL DEFAULT '{}',
    "authId" TEXT NOT NULL,

    CONSTRAINT "AuthIdentity_pkey" PRIMARY KEY ("providerName","providerUserId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IBSubject_name_key" ON "IBSubject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityPathway_name_key" ON "UniversityPathway"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Career_name_key" ON "Career"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectPathwayLink_subjectId_pathwayId_key" ON "SubjectPathwayLink"("subjectId", "pathwayId");

-- CreateIndex
CREATE UNIQUE INDEX "PathwayCareerLink_pathwayId_careerId_key" ON "PathwayCareerLink"("pathwayId", "careerId");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_userId_key" ON "Auth"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- AddForeignKey
ALTER TABLE "SubjectPathwayLink" ADD CONSTRAINT "SubjectPathwayLink_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "IBSubject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectPathwayLink" ADD CONSTRAINT "SubjectPathwayLink_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "UniversityPathway"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathwayCareerLink" ADD CONSTRAINT "PathwayCareerLink_pathwayId_fkey" FOREIGN KEY ("pathwayId") REFERENCES "UniversityPathway"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathwayCareerLink" ADD CONSTRAINT "PathwayCareerLink_careerId_fkey" FOREIGN KEY ("careerId") REFERENCES "Career"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedLoadout" ADD CONSTRAINT "SavedLoadout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auth" ADD CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthIdentity" ADD CONSTRAINT "AuthIdentity_authId_fkey" FOREIGN KEY ("authId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;
