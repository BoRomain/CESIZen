-- AlterTable
ALTER TABLE "ActiviteDetente" ALTER COLUMN "dateCreation" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Information" ALTER COLUMN "dateCreation" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Utilisateur" ALTER COLUMN "dateCreation" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "utilisateurId" INTEGER NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_utilisateurId_key" ON "RefreshToken"("utilisateurId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
