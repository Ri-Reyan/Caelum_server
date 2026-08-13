/*
  Warnings:

  - Added the required column `categoriId` to the `watches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "watches" ADD COLUMN     "categoriId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_tags_key" ON "categories"("tags");

-- AddForeignKey
ALTER TABLE "watches" ADD CONSTRAINT "watches_categoriId_fkey" FOREIGN KEY ("categoriId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
