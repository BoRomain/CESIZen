-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "dateExpiration" SET DEFAULT NOW() + interval '7 days';

-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "dateModification" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
