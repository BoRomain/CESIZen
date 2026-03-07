-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "dateExpiration" SET DEFAULT NOW() + interval '7 days';
