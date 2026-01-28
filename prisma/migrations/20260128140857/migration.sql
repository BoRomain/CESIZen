/*
  Warnings:

  - You are about to drop the column `nom` on the `ActiviteDetente` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Information` table. All the data in the column will be lost.
  - You are about to drop the column `motDePasse` on the `Information` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `Information` table. All the data in the column will be lost.
  - You are about to drop the column `prenom` on the `Information` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Information` table. All the data in the column will be lost.
  - Added the required column `difficulte` to the `ActiviteDetente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duree` to the `ActiviteDetente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `ActiviteDetente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titre` to the `ActiviteDetente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categorie` to the `Information` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Information` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Information` table without a default value. This is not possible if the table is not empty.
  - Added the required column `texte` to the `Information` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titre` to the `Information` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Information_email_key";

-- AlterTable
ALTER TABLE "ActiviteDetente" DROP COLUMN "nom",
ADD COLUMN     "difficulte" INTEGER NOT NULL,
ADD COLUMN     "duree" INTEGER NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "titre" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Information" DROP COLUMN "email",
DROP COLUMN "motDePasse",
DROP COLUMN "nom",
DROP COLUMN "prenom",
DROP COLUMN "role",
ADD COLUMN     "categorie" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "texte" TEXT NOT NULL,
ADD COLUMN     "titre" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Favori" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "activiteDetenteId" INTEGER NOT NULL,

    CONSTRAINT "Favori_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favori_utilisateurId_activiteDetenteId_key" ON "Favori"("utilisateurId", "activiteDetenteId");

-- AddForeignKey
ALTER TABLE "Favori" ADD CONSTRAINT "Favori_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favori" ADD CONSTRAINT "Favori_activiteDetenteId_fkey" FOREIGN KEY ("activiteDetenteId") REFERENCES "ActiviteDetente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
