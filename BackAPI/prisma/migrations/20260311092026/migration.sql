-- AlterTable
ALTER TABLE "ActiviteDetente" ADD COLUMN     "dateModification" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Information" ADD COLUMN     "dateModification" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "dateExpiration" SET DEFAULT NOW() + interval '7 days';
