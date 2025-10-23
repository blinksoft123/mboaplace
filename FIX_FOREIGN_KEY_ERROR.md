# 🔧 Résolution de l'Erreur Foreign Key

## ❌ Erreur rencontrée

```
Erreur de publication: insert or update on table 'annonces' violates 
foreign key constraint 'annonces_user_id_fkey'
```

## 🔍 Cause du problème

Cette erreur se produit quand :
- Vous vous êtes inscrit **avant** d'exécuter le script `supabase_setup.sql`
- Le profil de l'utilisateur n'existe pas dans la table `profiles`
- La contrainte de clé étrangère empêche la création d'une annonce sans profil valide

## ✅ Solution Rapide

### Option 1 : Créer les profils manquants (Recommandé)

1. **Ouvrir Supabase SQL Editor**
   - Aller sur https://supabase.com
   - Ouvrir votre projet `ajurfjvmhojaafnswmxi`
   - Cliquer sur **SQL Editor**

2. **Exécuter le script de correction**
   - Copier le contenu de `fix_profiles.sql`
   - Coller dans l'éditeur SQL
   - Cliquer sur **Run**

3. **Vérifier le résultat**
   - Vous devriez voir : `total_users = total_profiles`
   - La 3ème requête doit retourner 0 résultat

4. **Tester à nouveau**
   - Retourner sur l'application
   - Essayer de publier une annonce
   - ✅ Ça devrait fonctionner !

### Option 2 : Se reconnecter

Si l'option 1 ne fonctionne pas :

1. **Se déconnecter de l'application**
2. **Se reconnecter**
3. Le trigger devrait créer le profil automatiquement
4. Essayer de publier une annonce

### Option 3 : Créer un nouveau compte

En dernier recours :

1. **Se déconnecter**
2. **Créer un nouveau compte** avec un nouvel email
3. Le profil sera automatiquement créé
4. Essayer de publier une annonce

## 🔍 Diagnostic Approfondi

### Vérifier si votre profil existe

Dans Supabase SQL Editor, exécutez :

```sql
-- Remplacer YOUR_EMAIL par votre email
SELECT 
    au.id as user_id,
    au.email,
    p.id as profile_id,
    p.full_name,
    CASE 
        WHEN p.id IS NULL THEN '❌ Profil manquant'
        ELSE '✅ Profil OK'
    END as status
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE au.email = 'YOUR_EMAIL';
```

### Créer manuellement votre profil

Si le script automatique ne fonctionne pas, créez-le manuellement :

```sql
-- 1. Récupérer votre ID utilisateur
SELECT id, email FROM auth.users WHERE email = 'YOUR_EMAIL';

-- 2. Créer le profil (remplacer USER_ID par l'ID de l'étape 1)
INSERT INTO public.profiles (id, full_name, phone, city, country)
VALUES (
    'USER_ID',
    'Votre Nom',
    '+1234567890',
    'Ville',
    'Pays'
);
```

## 🛠️ Prévenir le problème à l'avenir

Le trigger automatique devrait créer les profils. Vérifiez qu'il existe :

```sql
-- Vérifier que le trigger existe
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

Si le trigger n'existe pas, réexécutez cette partie du script `supabase_setup.sql` :

```sql
-- Recréer le trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## ✅ Vérification finale

Après avoir appliqué la solution, vérifiez que tout est OK :

1. **Dans Table Editor** : Ouvrir la table `profiles`
2. **Compter les lignes** : Doit correspondre au nombre d'utilisateurs
3. **Tester la publication d'annonce** : Doit fonctionner sans erreur

## 📊 Commandes de Diagnostic Utiles

```sql
-- 1. Compter les utilisateurs et profils
SELECT 
    (SELECT COUNT(*) FROM auth.users) as total_users,
    (SELECT COUNT(*) FROM public.profiles) as total_profiles;

-- 2. Lister les utilisateurs sans profil
SELECT au.id, au.email, au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;

-- 3. Vérifier vos annonces existantes
SELECT 
    a.id,
    a.title,
    a.user_id,
    p.full_name,
    CASE 
        WHEN p.id IS NULL THEN '❌ Profil manquant'
        ELSE '✅ Profil OK'
    END as profile_status
FROM public.annonces a
LEFT JOIN public.profiles p ON p.id = a.user_id;
```

## 🚨 Si rien ne fonctionne

1. **Supprimer et recréer les tables** (⚠️ Perte de données)
   ```sql
   DROP TABLE IF EXISTS public.annonces CASCADE;
   DROP TABLE IF EXISTS public.profiles CASCADE;
   -- Puis réexécuter supabase_setup.sql
   ```

2. **Contacter le support Supabase**
   - Vérifier que les permissions sont correctes
   - Vérifier que RLS n'interfère pas

3. **Créer un nouveau projet Supabase**
   - En dernier recours si le projet est corrompu

## 📞 Besoin d'aide ?

Si le problème persiste après avoir essayé ces solutions :

1. Vérifier les logs Supabase (onglet Logs)
2. Ouvrir la console du navigateur (F12) pour voir les erreurs détaillées
3. Vérifier que vous êtes bien connecté (user.id existe)

---

**🎯 Dans 99% des cas, l'Option 1 (exécuter `fix_profiles.sql`) résout le problème !**
