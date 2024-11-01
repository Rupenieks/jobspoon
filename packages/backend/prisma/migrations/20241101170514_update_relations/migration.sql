-- DropIndex
DROP INDEX "Application_resumeId_key";

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");
