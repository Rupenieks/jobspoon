-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "jobMatchRunId" TEXT;

-- CreateTable
CREATE TABLE "JobMatchRun" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobMatchRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobMatchRun_userId_idx" ON "JobMatchRun"("userId");

-- CreateIndex
CREATE INDEX "JobMatchRun_resumeId_idx" ON "JobMatchRun"("resumeId");

-- CreateIndex
CREATE INDEX "JobMatchRun_createdAt_idx" ON "JobMatchRun"("createdAt");

-- CreateIndex
CREATE INDEX "Match_jobMatchRunId_idx" ON "Match"("jobMatchRunId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_jobMatchRunId_fkey" FOREIGN KEY ("jobMatchRunId") REFERENCES "JobMatchRun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobMatchRun" ADD CONSTRAINT "JobMatchRun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobMatchRun" ADD CONSTRAINT "JobMatchRun_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
