-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_resumeId_fkey";

-- DropIndex
DROP INDEX "Resume_userId_idx";

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
