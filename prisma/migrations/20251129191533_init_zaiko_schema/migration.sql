-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('Tool', 'Template', 'Service');

-- CreateEnum
CREATE TYPE "ProductActionType" AS ENUM ('transition', 'download');

-- CreateEnum
CREATE TYPE "ZaikoFamilyRole" AS ENUM ('ADMIN', 'EDITOR', 'VIEWER');

-- CreateTable
CREATE TABLE "ProductPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "author" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT '',
    "type" "ProductType" NOT NULL,
    "tags" TEXT[],
    "status" "PostStatus" NOT NULL DEFAULT 'draft',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "goodCount" INTEGER NOT NULL DEFAULT 0,
    "headerImagePath" TEXT,
    "notionPageId" TEXT NOT NULL,
    "contentLink" TEXT,
    "actionType" "ProductActionType" NOT NULL DEFAULT 'transition',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zaiko_profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zaiko_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zaiko_families" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "inviteCode" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zaiko_families_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zaiko_family_members" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ZaikoFamilyRole" NOT NULL DEFAULT 'EDITOR',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zaiko_family_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zaiko_items" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "threshold" INTEGER NOT NULL DEFAULT 1,
    "category" TEXT NOT NULL DEFAULT '日用品',
    "location" TEXT,
    "icon" TEXT NOT NULL DEFAULT 'box',
    "memo" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zaiko_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductPost_slug_key" ON "ProductPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductPost_notionPageId_key" ON "ProductPost"("notionPageId");

-- CreateIndex
CREATE INDEX "ProductPost_category_idx" ON "ProductPost"("category");

-- CreateIndex
CREATE INDEX "ProductPost_status_isPublic_idx" ON "ProductPost"("status", "isPublic");

-- CreateIndex
CREATE INDEX "ProductPost_slug_idx" ON "ProductPost"("slug");

-- CreateIndex
CREATE INDEX "ProductPost_tags_idx" ON "ProductPost"("tags");

-- CreateIndex
CREATE INDEX "ProductPost_type_idx" ON "ProductPost"("type");

-- CreateIndex
CREATE UNIQUE INDEX "zaiko_families_inviteCode_key" ON "zaiko_families"("inviteCode");

-- CreateIndex
CREATE UNIQUE INDEX "zaiko_family_members_familyId_userId_key" ON "zaiko_family_members"("familyId", "userId");

-- CreateIndex
CREATE INDEX "zaiko_items_familyId_idx" ON "zaiko_items"("familyId");

-- AddForeignKey
ALTER TABLE "zaiko_families" ADD CONSTRAINT "zaiko_families_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "zaiko_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zaiko_family_members" ADD CONSTRAINT "zaiko_family_members_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "zaiko_families"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zaiko_family_members" ADD CONSTRAINT "zaiko_family_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "zaiko_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zaiko_items" ADD CONSTRAINT "zaiko_items_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "zaiko_families"("id") ON DELETE CASCADE ON UPDATE CASCADE;
