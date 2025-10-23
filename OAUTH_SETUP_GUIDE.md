# Guide de Configuration OAuth - MBOA PLACE

## 🔧 Problèmes Résolus

### ✅ 1. ID Supabase visible lors de la connexion Google
**Solution:** Utilisation de `window.location.origin` au lieu d'URL hardcodée

### ⚠️ 2. Connexion Facebook ne fonctionne pas
**Raison:** Facebook OAuth n'est pas configuré dans Supabase

---

## 📋 Configuration Facebook OAuth dans Supabase

### Étape 1: Créer une Application Facebook

1. Allez sur [Facebook Developers](https://developers.facebook.com/)
2. Cliquez sur **"My Apps"** → **"Create App"**
3. Choisissez **"Consumer"** comme type d'application
4. Donnez un nom à votre app: **"MBOA PLACE"**
5. Ajoutez un email de contact
6. Cliquez sur **"Create App"**

### Étape 2: Configurer Facebook Login

1. Dans le tableau de bord de votre app, cherchez **"Facebook Login"**
2. Cliquez sur **"Set Up"**
3. Choisissez **"Web"**
4. Entrez l'URL de votre site: `https://place.mboasend.com`
5. Cliquez sur **"Save"** et **"Continue"**

### Étape 3: Récupérer les Identifiants

1. Allez dans **Settings** → **Basic**
2. Notez votre **App ID**
3. Cliquez sur **"Show"** pour voir votre **App Secret**
4. **Copiez ces deux valeurs** (vous en aurez besoin)

### Étape 4: Configurer les URLs de Redirection

Dans **Facebook Login** → **Settings**:

Ajoutez ces URLs dans **Valid OAuth Redirect URIs**:
```
https://xcgloxbhbbvoqzhbrdpf.supabase.co/auth/v1/callback
http://localhost:3000/profil
https://place.mboasend.com/profil
```

**Sauvegardez les modifications**

### Étape 5: Passer en Mode Production

1. Dans le tableau de bord, en haut → Basculez de **"In Development"** à **"Live"**
2. Vous devrez peut-être fournir une politique de confidentialité
3. Acceptez les conditions de Facebook

### Étape 6: Configurer dans Supabase

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet **xcgloxbhbbvoqzhbrdpf**
3. Allez dans **Authentication** → **Providers**
4. Trouvez **Facebook** dans la liste
5. Activez-le (toggle ON)
6. Collez:
   - **Facebook Client ID** (App ID de Facebook)
   - **Facebook Client Secret** (App Secret de Facebook)
7. Cliquez sur **"Save"**

---

## 🔒 URLs de Redirection Autorisées dans Supabase

Assurez-vous que ces URLs sont autorisées dans **Authentication** → **URL Configuration**:

```
http://localhost:3000/*
https://place.mboasend.com/*
```

---

## 🧪 Tester la Configuration

### Test Google OAuth
1. Allez sur `/connexion`
2. Cliquez sur le bouton Google
3. ✅ L'URL ne devrait plus montrer l'ID Supabase
4. ✅ Vous devriez voir directement la page Google Sign-In

### Test Facebook OAuth
1. Allez sur `/connexion`
2. Cliquez sur le bouton Facebook
3. Si non configuré: Message d'erreur clair
4. Si configuré: Redirection vers Facebook Login

---

## ⚡ Alternative : Désactiver Facebook Temporairement

Si vous ne voulez pas configurer Facebook maintenant, vous pouvez cacher le bouton:

### Option 1: Retirer le bouton Facebook (Recommandé)

Éditez `src/pages/LoginPage.jsx` et `src/pages/RegisterPage.jsx`:

```javascript
// Commentez ou supprimez la div du bouton Facebook:
/*
<div>
  <button onClick={() => handleProviderSignIn('facebook')} ...>
    ...
  </button>
</div>
*/
```

### Option 2: Désactiver avec un message

Ajoutez une condition:

```javascript
const FACEBOOK_ENABLED = false; // Changez en true quand configuré

// Dans le render:
{FACEBOOK_ENABLED && (
  <div>
    <button onClick={() => handleProviderSignIn('facebook')} ...>
      ...
    </button>
  </div>
)}
```

---

## 📝 Variables d'Environnement (Optionnel)

Pour plus de flexibilité, ajoutez dans `.env.local`:

```bash
# OAuth Configuration
VITE_GOOGLE_OAUTH_ENABLED=true
VITE_FACEBOOK_OAUTH_ENABLED=false
```

Puis dans le code:

```javascript
const isFacebookEnabled = import.meta.env.VITE_FACEBOOK_OAUTH_ENABLED === 'true';
```

---

## 🐛 Dépannage

### Erreur: "Invalid redirect URI"
- Vérifiez que l'URL est exactement la même dans Facebook et Supabase
- Pas de slash final `/` dans les URLs

### Erreur: "App not configured"
- Assurez-vous que l'app Facebook est en mode **"Live"** (pas "Development")
- Vérifiez que Facebook Login est activé

### L'ID Supabase apparaît toujours
- Videz le cache du navigateur
- Vérifiez que le code est bien déployé
- Vérifiez dans les outils de développement que `window.location.origin` est correct

### Le bouton ne fait rien
- Ouvrez la console (F12) pour voir les erreurs
- Vérifiez que le provider est activé dans Supabase Dashboard

---

## ✅ Checklist de Vérification

- [ ] App Facebook créée
- [ ] Facebook Login configuré
- [ ] App ID et App Secret copiés
- [ ] URLs de redirection ajoutées dans Facebook
- [ ] App passée en mode "Live"
- [ ] Provider Facebook activé dans Supabase
- [ ] Credentials ajoutés dans Supabase
- [ ] URLs de redirection autorisées dans Supabase
- [ ] Tests effectués (Google et Facebook)
- [ ] Cache navigateur vidé

---

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs dans Supabase Dashboard → Logs
3. Consultez la [documentation Supabase OAuth](https://supabase.com/docs/guides/auth/social-login/auth-facebook)

---

**Note:** La configuration Google devrait déjà fonctionner si elle était activée dans Supabase. Seul Facebook nécessite une configuration supplémentaire.
