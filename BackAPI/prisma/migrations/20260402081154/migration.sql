/*
  Warnings:

  - Added the required column `lieu` to the `ActiviteDetente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActiviteDetente" ADD COLUMN     "lieu" TEXT;

UPDATE "ActiviteDetente" SET "lieu" = 'publique' WHERE "lieu" IS NULL;

ALTER TABLE "ActiviteDetente" ALTER COLUMN "lieu" SET NOT NULL;

-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "dateExpiration" SET DEFAULT NOW() + interval '7 days';
