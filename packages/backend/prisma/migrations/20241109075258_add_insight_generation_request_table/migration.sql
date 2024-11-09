-- CreateTable
CREATE TABLE "ApplicationInsightGenerationRequest" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "applicationStage" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'STARTED',
    "generatedInsightId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationInsightGenerationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApplicationInsightGenerationRequest_applicationId_idx" ON "ApplicationInsightGenerationRequest"("applicationId");

-- AddForeignKey
ALTER TABLE "ApplicationInsightGenerationRequest" ADD CONSTRAINT "ApplicationInsightGenerationRequest_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
