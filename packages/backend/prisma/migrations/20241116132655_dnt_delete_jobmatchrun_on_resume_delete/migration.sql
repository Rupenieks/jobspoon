-- DropForeignKey
ALTER TABLE "JobMatchRun" DROP CONSTRAINT "JobMatchRun_resumeId_fkey";

-- AddForeignKey
ALTER TABLE "JobMatchRun" ADD CONSTRAINT "JobMatchRun_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
