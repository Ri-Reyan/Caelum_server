/*
  Warnings:

  - Added the required column `profile` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "profile" TEXT NOT NULL;
