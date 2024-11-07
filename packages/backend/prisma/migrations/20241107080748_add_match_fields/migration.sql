-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "company" JSONB,
ADD COLUMN     "datePosted" TEXT,
ADD COLUMN     "dateReposted" TEXT,
ADD COLUMN     "hiringTeam" JSONB,
ADD COLUMN     "hybrid" BOOLEAN,
ADD COLUMN     "remote" BOOLEAN,
ADD COLUMN     "reposted" BOOLEAN,
ADD COLUMN     "salary" TEXT;
