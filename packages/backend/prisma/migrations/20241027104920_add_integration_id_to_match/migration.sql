/*
  Warnings:

  - You are about to drop the column `cities` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `countries` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `countryCodes` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `datePosted` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `discoveredAt` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `finalUrl` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `hybrid` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `longLocation` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `matchingPhrases` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `matchingWords` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `remote` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `shortLocation` on the `Match` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[resumeId,integrationId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `integrationId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `positionTitle` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Made the column `country` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "cities",
DROP COLUMN "company",
DROP COLUMN "countries",
DROP COLUMN "countryCodes",
DROP COLUMN "datePosted",
DROP COLUMN "discoveredAt",
DROP COLUMN "finalUrl",
DROP COLUMN "hybrid",
DROP COLUMN "jobTitle",
DROP COLUMN "latitude",
DROP COLUMN "location",
DROP COLUMN "longLocation",
DROP COLUMN "longitude",
DROP COLUMN "matchingPhrases",
DROP COLUMN "matchingWords",
DROP COLUMN "postalCode",
DROP COLUMN "remote",
DROP COLUMN "salary",
DROP COLUMN "shortLocation",
ADD COLUMN     "applyUrl" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "companyUrl" TEXT,
ADD COLUMN     "integrationId" TEXT NOT NULL,
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "positionTitle" TEXT NOT NULL,
ADD COLUMN     "provider" TEXT NOT NULL,
ALTER COLUMN "country" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Match_resumeId_integrationId_key" ON "Match"("resumeId", "integrationId");
