/*
  Warnings:

  - You are about to drop the column `color` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `preacher_name` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `references` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `youtubeId` on the `notes` table. All the data in the column will be lost.
  - Added the required column `preacher` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "color",
DROP COLUMN "content",
DROP COLUMN "preacher_name",
DROP COLUMN "references",
DROP COLUMN "youtubeId",
ADD COLUMN     "biblical_references" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "content_html" TEXT,
ADD COLUMN     "content_json" JSONB,
ADD COLUMN     "content_text" TEXT,
ADD COLUMN     "preacher" VARCHAR(60) NOT NULL,
ADD COLUMN     "youtubeUrl" VARCHAR(60);
