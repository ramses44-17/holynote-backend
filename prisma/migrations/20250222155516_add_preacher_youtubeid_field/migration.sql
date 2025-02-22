/*
  Warnings:

  - Added the required column `preacher_name` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `youtubeId` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "preacher_name" VARCHAR(60) NOT NULL,
ADD COLUMN     "youtubeId" VARCHAR(60) NOT NULL,
ALTER COLUMN "content" SET DEFAULT '',
ALTER COLUMN "references" SET DEFAULT ARRAY[]::TEXT[];
