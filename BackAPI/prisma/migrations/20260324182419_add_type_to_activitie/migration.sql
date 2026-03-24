-- ÉTAPE 1 : Ajouter la colonne en acceptant le vide (NULL) temporairement
ALTER TABLE "ActiviteDetente" ADD COLUMN "type" TEXT;

-- ÉTAPE 2 : Remplir toutes les lignes existantes avec une valeur par défaut
-- (Sans ça, l'étape 3 échouera car la colonne ne peut pas être NOT NULL s'il y a des vides)
UPDATE "ActiviteDetente" SET "type" = 'général' WHERE "type" IS NULL;

-- ÉTAPE 3 : Maintenant que c'est rempli, on verrouille la colonne en NOT NULL
ALTER TABLE "ActiviteDetente" ALTER COLUMN "type" SET NOT NULL;

-- ÉTAPE 4 : Correction de la table RefreshToken (ne pas oublier le point-virgule !)
ALTER TABLE "RefreshToken" 
ALTER COLUMN "dateExpiration" SET DEFAULT (NOW() + interval '7 days');