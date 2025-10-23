-- Migration: Ajouter la colonne currency à la table annonces
-- Date: 2025-01-23
-- Description: Permet de stocker la devise choisie lors de la publication d'une annonce

-- Vérifier si la colonne n'existe pas déjà, puis l'ajouter
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'annonces' 
        AND column_name = 'currency'
    ) THEN
        -- Ajouter la colonne currency avec CAD comme valeur par défaut
        ALTER TABLE annonces 
        ADD COLUMN currency VARCHAR(3) DEFAULT 'CAD';
        
        -- Mettre à jour les annonces existantes qui n'ont pas de currency
        UPDATE annonces 
        SET currency = 'CAD' 
        WHERE currency IS NULL;
        
        RAISE NOTICE 'Colonne currency ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne currency existe déjà';
    END IF;
END $$;

-- Optionnel: Ajouter un check constraint pour valider les devises acceptées
-- ALTER TABLE annonces 
-- ADD CONSTRAINT check_currency 
-- CHECK (currency IN ('CAD', 'USD', 'EUR', 'XAF'));

-- Commentaire sur la colonne
COMMENT ON COLUMN annonces.currency IS 'Devise du prix (CAD, USD, EUR, XAF)';
