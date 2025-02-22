/*
  Warnings:

  - Changed the type of `date` on the `notes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "notes" DROP COLUMN "date",
ADD COLUMN     "date" VARCHAR(10) NOT NULL;
