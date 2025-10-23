-- =============================================
-- FIX PROFILES - Script de Correction
-- =============================================
-- Ce script corrige le problème de foreign key
-- en créant les profils manquants pour tous les
-- utilisateurs existants
-- =============================================

-- 1. Créer les profils manquants pour tous les utilisateurs existants
INSERT INTO public.profiles (id, full_name, avatar_url, created_at)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'full_name', 'Utilisateur'),
    au.raw_user_meta_data->>'avatar_url',
    au.created_at
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
);

-- 2. Vérifier que tous les utilisateurs ont un profil
SELECT 
    COUNT(*) as total_users,
    (SELECT COUNT(*) FROM public.profiles) as total_profiles
FROM auth.users;

-- 3. Afficher les utilisateurs sans profil (devrait être vide)
SELECT au.id, au.email, au.created_at
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = au.id
);

-- =============================================
-- Si vous voyez des résultats dans la requête 3,
-- cela signifie qu'il y a encore des utilisateurs
-- sans profil. Dans ce cas, réexécutez la requête 1.
-- =============================================
