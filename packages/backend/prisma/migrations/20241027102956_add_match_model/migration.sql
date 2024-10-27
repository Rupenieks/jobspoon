-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "jobTitle" TEXT,
    "company" TEXT,
    "datePosted" TIMESTAMP(3),
    "finalUrl" TEXT,
    "location" TEXT,
    "shortLocation" TEXT,
    "longLocation" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "postalCode" TEXT,
    "hybrid" BOOLEAN,
    "remote" BOOLEAN,
    "salary" TEXT,
    "countries" TEXT[],
    "country" TEXT,
    "cities" TEXT[],
    "countryCodes" TEXT[],
    "seniority" TEXT,
    "discoveredAt" TIMESTAMP(3),
    "description" TEXT,
    "matchingWords" TEXT[],
    "matchingPhrases" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Match_resumeId_idx" ON "Match"("resumeId");

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
