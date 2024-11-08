/*
  Warnings:

  - You are about to drop the column `status` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "status",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "stage" TEXT NOT NULL DEFAULT 'not_applied';
