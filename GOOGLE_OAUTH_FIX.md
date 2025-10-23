# 🔧 Fix Google OAuth - Redirection vers profil

## ✅ Problème Identifié

Vous êtes bien connecté avec Google (le token est présent dans l'URL), mais vous restez bloqué sur la page d'accueil avec le hash `#access_token=...` au lieu d'être redirigé vers `/profil`.

## 🛠️ Solution Appliquée

J'ai modifié `SupabaseAuthContext.jsx` pour :

1. **Détecter le hash OAuth** dans l'URL au chargement
2. **Nettoyer le hash** après récupération du token
3. **Rediriger automatiquement** vers `/profil`
4. **Ajouter des logs** pour déboguer

### Changements effectués :

```javascript
// Au chargement initial
const hashParams = new URLSearchParams(window.location.hash.substring(1));
const hasOAuthCallback = hashParams.has('access_token');

if (currentUser && hasOAuthCallback) {
  // Clean the hash from URL
  window.history.replaceState({}, document.title, window.location.pathname);
  navigate('/profil', { replace: true });
}

// Dans onAuthStateChange
if (event === 'SIGNED_IN') {
  // Clean hash if present
  if (window.location.hash) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  navigate('/profil', { replace: true });
}
```

## 🧪 Test Maintenant

1. **Ouvrir la console du navigateur** (F12 → Console)
2. **Cliquer sur "Se connecter avec Google"**
3. **Observer les logs** :
   ```
   Auth state changed: SIGNED_IN votre-email@gmail.com
   ```
4. **Vérifier la redirection** vers `/profil`
5. **Vérifier que l'URL est propre** (pas de `#access_token=...`)

## 🔍 Si ça ne marche toujours pas

### Étape 1 : Vérifier la console

Dans la console, vérifier les logs :
- Y a-t-il des erreurs rouges ?
- Le log "Auth state changed: SIGNED_IN" apparaît-il ?

### Étape 2 : Vérifier la configuration Supabase

Allez sur https://app.supabase.com → Votre projet → Authentication → URL Configuration

**Vérifiez** :
- **Site URL** : `http://localhost:3000` (dev) ou votre domaine (prod)
- **Redirect URLs** : 
  ```
  http://localhost:3000/**
  http://localhost:3000/profil
  https://votre-domaine.com/**
  ```

### Étape 3 : Vérifier Google Cloud Console

Allez sur https://console.cloud.google.com → APIs & Services → Credentials

**Vérifiez les Authorized redirect URIs** :
```
http://localhost:3000/auth/callback
https://votreprojet.supabase.co/auth/v1/callback
```

⚠️ **IMPORTANT** : Après modification, attendre 1-2 minutes que ça propage.

## 🎯 Configuration Optimale

### Dans Supabase Dashboard

**Authentication → Providers → Google** :
- ✅ Enabled
- ✅ Client ID : `votre-client-id.apps.googleusercontent.com`
- ✅ Client Secret : `votre-secret`

**Authentication → URL Configuration** :
- Site URL : `http://localhost:3000`
- Redirect URLs :
  ```
  http://localhost:3000/**
  http://localhost:3000/profil
  http://localhost:3000/auth/callback
  ```

### Dans Google Cloud Console

**Credentials → OAuth 2.0 Client IDs → Your Client** :

**Authorized JavaScript origins** :
```
http://localhost:3000
https://votre-domaine.com
```

**Authorized redirect URIs** :
```
http://localhost:3000/auth/callback
https://votreprojet.supabase.co/auth/v1/callback
```

## 📊 Résultat Attendu

### Avant (❌)
```
http://localhost:3000/#access_token=eyJ...&refresh_token=...
                       ↑
                   Reste bloqué ici
```

### Après (✅)
```
http://localhost:3000/#access_token=eyJ...
         ↓
    (nettoie le hash)
         ↓
http://localhost:3000/profil
         ↓
    (utilisateur connecté et sur son profil)
```

## 🐛 Debugging Avancé

Si le problème persiste, ajoutez temporairement plus de logs :

```javascript
// Dans SupabaseAuthContext.jsx, ligne ~48
console.log('Hash params:', hashParams.toString());
console.log('Has OAuth callback:', hasOAuthCallback);
console.log('Current user:', currentUser?.email);
console.log('Will redirect:', currentUser && hasOAuthCallback);
```

Puis partagez ces logs pour diagnostic plus poussé.

## ✅ Checklist Finale

- [ ] Build réussi sans erreurs
- [ ] Serveur dev lancé (`npm run dev`)
- [ ] Pas d'erreurs dans la console navigateur
- [ ] Clic sur "Google" → Popup/redirection Google
- [ ] Après autorisation → Retour sur votre site
- [ ] Log "Auth state changed: SIGNED_IN" visible
- [ ] Redirection automatique vers `/profil`
- [ ] URL propre (pas de hash)
- [ ] Profil utilisateur affiché avec nom + avatar Google

## 🎉 Une fois que ça marche

Vous devriez voir :
1. ✅ Avatar Google en haut à droite
2. ✅ Nom complet depuis Google : "BENIS MAGERUS KOGHO NGOUH"
3. ✅ Email : ernestxxx@gmail.com
4. ✅ Ville/Pays : Dschang, Cameroun
5. ✅ Navigation fluide dans l'app

## 📝 Notes

- Le token dans l'URL est **normal** lors du callback OAuth
- Il doit être **nettoyé automatiquement** après traitement
- La redirection doit être **instantanée** (< 1 seconde)
- Si vous voyez l'URL avec le hash même 2 secondes, c'est qu'il y a un problème

---

**Prochaine étape** : Une fois que la connexion Google marche parfaitement, on pourra passer à l'implémentation des uploads d'images dans la messagerie ! 🚀
