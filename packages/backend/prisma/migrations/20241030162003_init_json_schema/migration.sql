/*
  Warnings:

  - You are about to drop the column `address` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `education` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `positionName` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `previewImage` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `references` on the `Resume` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `Resume` table. All the data in the column will be lost.
  - Added the required column `data` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resume" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "education",
DROP COLUMN "email",
DROP COLUMN "experience",
DROP COLUMN "fullName",
DROP COLUMN "phoneNumber",
DROP COLUMN "positionName",
DROP COLUMN "previewImage",
DROP COLUMN "profileImage",
DROP COLUMN "references",
DROP COLUMN "skills",
ADD COLUMN     "data" JSONB NOT NULL;
