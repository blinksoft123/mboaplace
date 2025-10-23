# 🔐 Guide de Configuration Google Sign-In pour MBOA PLACE

## ✅ Ce qui est déjà fait

Votre application a déjà tout le code frontend nécessaire :
- ✅ Boutons Google dans `LoginPage.jsx` et `RegisterPage.jsx`
- ✅ Fonction `signInWithProvider('google')` dans `SupabaseAuthContext.jsx`
- ✅ Gestion des redirections après authentification
- ✅ Client Supabase configuré

## 📋 Ce qu'il reste à faire

### Étape 1 : Configurer Google Cloud Console

1. **Accédez à Google Cloud Console**
   - Allez sur https://console.cloud.google.com/
   - Connectez-vous avec votre compte Google

2. **Créer ou sélectionner un projet**
   - Cliquez sur le sélecteur de projet en haut
   - Créez un nouveau projet ou sélectionnez un projet existant
   - Nom suggéré : "MBOA PLACE"

3. **Activer Google+ API**
   - Dans le menu, allez à "APIs & Services" > "Library"
   - Recherchez "Google+ API"
   - Cliquez sur "Enable"

4. **Configurer l'écran de consentement OAuth**
   - Allez à "APIs & Services" > "OAuth consent screen"
   - Type d'utilisateur : **External** (sauf si vous avez Google Workspace)
   - Cliquez sur "Create"
   
   **Remplissez les informations :**
   - App name: `MBOA PLACE`
   - User support email: votre email
   - Logo (optionnel) : logo de votre app
   - App domain:
     - Application home page: `https://votre-domaine.com`
     - Privacy policy: `https://votre-domaine.com/politique-confidentialite`
     - Terms of service: `https://votre-domaine.com/cgu`
   - Developer contact: votre email
   
   **Scopes (portées) :**
   - Ajoutez les scopes suivants :
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`

5. **Créer les identifiants OAuth**
   - Allez à "APIs & Services" > "Credentials"
   - Cliquez sur "+ CREATE CREDENTIALS" > "OAuth client ID"
   - Application type: **Web application**
   - Name: `MBOA PLACE Web Client`
   
   **Authorized JavaScript origins :**
   ```
   http://localhost:3000
   https://votre-domaine-production.com
   ```
   
   **Authorized redirect URIs :**
   ```
   http://localhost:3000/auth/callback
   https://votre-domaine-production.com/auth/callback
   https://votreprojet.supabase.co/auth/v1/callback
   ```
   
   ⚠️ **IMPORTANT** : Remplacez `votreprojet` par votre vrai projet Supabase

6. **Copier les identifiants**
   - Notez le **Client ID** (ressemble à : `123456789-xxx.apps.googleusercontent.com`)
   - Notez le **Client Secret**

### Étape 2 : Configurer Supabase

1. **Accédez à votre projet Supabase**
   - Allez sur https://app.supabase.com/
   - Sélectionnez votre projet MBOA PLACE

2. **Activer Google Auth Provider**
   - Dans le menu, allez à "Authentication" > "Providers"
   - Trouvez "Google" dans la liste
   - Activez le toggle "Enable Sign in with Google"

3. **Configurer les identifiants Google**
   - Collez le **Google Client ID** (de l'étape 1.6)
   - Collez le **Google Client Secret** (de l'étape 1.6)
   - Cliquez sur "Save"

4. **Configurer les URL de redirection**
   - Allez à "Authentication" > "URL Configuration"
   - Site URL : `https://votre-domaine.com` (ou `http://localhost:3000` pour dev)
   - Redirect URLs : 
     ```
     http://localhost:3000/**
     https://votre-domaine.com/**
     ```

5. **Vérifier la callback URL de Supabase**
   - Notez l'URL callback Supabase (visible dans la config Google provider)
   - Format : `https://votreprojet.supabase.co/auth/v1/callback`
   - Cette URL doit être ajoutée dans Google Cloud Console (voir étape 1.5)

### Étape 3 : Configurer la base de données

Pour que Google Sign-In fonctionne correctement avec les profils, assurez-vous d'avoir un trigger qui crée automatiquement un profil :

```sql
-- Fonction pour créer un profil automatiquement
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger qui s'active à chaque nouvel utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Vérifier la structure de votre table profiles :**

```sql
-- La table doit avoir au minimum ces colonnes
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS provider TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
```

### Étape 4 : Tester l'authentification

1. **En développement local**
   ```bash
   npm run dev
   ```

2. **Testez le flux complet :**
   - Allez sur http://localhost:3000/connexion
   - Cliquez sur le bouton "Google"
   - Vous serez redirigé vers Google pour vous connecter
   - Après autorisation, vous devriez être redirigé vers `/profil`
   - Vérifiez que votre profil est bien créé dans la base de données

3. **Vérifiez dans Supabase Dashboard :**
   - Authentication > Users : votre utilisateur Google doit apparaître
   - Table Editor > profiles : un profil doit être créé avec vos infos Google

## 🔧 Améliorer le flux d'inscription Google (OPTIONNEL)

Si vous voulez demander des informations supplémentaires (téléphone, ville) après une connexion Google, vous pouvez créer une page de complétion de profil.

**Créer une page CompleteProfilePage.jsx :**

```jsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import CityAutocomplete from '@/components/CityAutocomplete';

const CompleteProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const phone = formData.get('phone');

    const { error } = await supabase
      .from('profiles')
      .update({
        phone,
        city: location?.city,
        country: location?.country,
        latitude: location?.latitude,
        longitude: location?.longitude,
      })
      .eq('id', user.id);

    if (!error) {
      navigate('/profil');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6">
      <h1 className="text-2xl font-bold mb-4">Complétez votre profil</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="phone"
          type="tel"
          placeholder="Téléphone"
          className="w-full px-3 py-2 border rounded-md"
        />
        <CityAutocomplete onSelect={setLocation} />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-700 text-white rounded-md"
        >
          Continuer
        </button>
      </form>
    </div>
  );
};

export default CompleteProfilePage;
```

**Modifier SupabaseAuthContext.jsx pour rediriger vers cette page :**

Dans le `useEffect` où vous gérez `onAuthStateChange`, ajoutez une vérification :

```javascript
if (event === 'SIGNED_IN') {
  // Vérifier si le profil est complet
  const profileComplete = currentUser.user_metadata?.phone && currentUser.user_metadata?.city;
  
  if (!profileComplete && currentUser.app_metadata?.provider === 'google') {
    navigate('/completer-profil', { replace: true });
  } else {
    navigate('/profil', { replace: true });
  }
}
```
