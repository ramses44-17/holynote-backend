/*
  Warnings:

  - You are about to drop the column `biblical_references` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `preacher` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `youtubeUrl` on the `notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "biblical_references",
DROP COLUMN "date",
DROP COLUMN "preacher",
DROP COLUMN "youtubeUrl";
