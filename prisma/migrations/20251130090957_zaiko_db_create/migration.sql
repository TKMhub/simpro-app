/*
  Warnings:

  - You are about to drop the `zaiko_profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."zaiko_families" DROP CONSTRAINT "zaiko_families_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "public"."zaiko_family_members" DROP CONSTRAINT "zaiko_family_members_userId_fkey";

-- DropTable
DROP TABLE "public"."zaiko_profiles";

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "joinedApps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "zaiko_families" ADD CONSTRAINT "zaiko_families_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zaiko_family_members" ADD CONSTRAINT "zaiko_family_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
