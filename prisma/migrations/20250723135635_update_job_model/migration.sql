/*
  Warnings:

  - You are about to drop the column `Qualification` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `Skils` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Job` table. All the data in the column will be lost.
  - Added the required column `company` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobtitle` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualification` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skils` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "Qualification",
DROP COLUMN "Skils",
DROP COLUMN "title",
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "jobtitle" TEXT NOT NULL,
ADD COLUMN     "qualification" TEXT NOT NULL,
ADD COLUMN     "skils" TEXT NOT NULL;
