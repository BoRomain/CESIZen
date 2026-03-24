-- AlterTable
ALTER TABLE "ActiviteDetente" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Information" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RefreshToken" ALTER COLUMN "dateExpiration" SET DEFAULT NOW() + interval '7 days';
