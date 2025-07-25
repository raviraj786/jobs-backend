-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "category" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "jobMode" TEXT,
ADD COLUMN     "level" TEXT,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "jobProfile" DROP NOT NULL,
ALTER COLUMN "company" DROP NOT NULL,
ALTER COLUMN "qualification" DROP NOT NULL,
ALTER COLUMN "skils" DROP NOT NULL;
