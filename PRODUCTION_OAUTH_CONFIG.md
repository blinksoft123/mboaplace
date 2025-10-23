# 🚀 Configuration Google OAuth - Production mboaplace.com

## 📋 Configuration Google Cloud Console

### 1. Accéder à Google Cloud Console
👉 https://console.cloud.google.com/

### 2. Sélectionner votre projet MBOA PLACE

### 3. Configurer les Authorized JavaScript origins

**APIs & Services** → **Credentials** → **OAuth 2.0 Client IDs** → Votre client

**Authorized JavaScript origins** :
```
http://localhost:3000
https://mboaplace.com
https://www.mboaplace.com
```

### 4. Configurer les Authorized redirect URIs

**Authorized redirect URIs** :
```
http://localhost:3000/auth/callback
https://mboaplace.com/auth/callback
https://www.mboaplace.com/auth/callback
https://ajurfjvmhojaafnswmxi.supabase.co/auth/v1/callback
```

⚠️ **Remplacez** `ajurfjvmhojaafnswmxi` par votre vrai projet ID Supabase

### 5. Sauvegarder
Cliquez sur **Save** et attendez 1-2 minutes pour la propagation.

---

## 📋 Configuration Supabase Dashboard

### 1. Accéder à Supabase
👉 https://app.supabase.com/

### 2. Sélectionner votre projet MBOA PLACE

### 3. Configuration des Providers

**Authentication** → **Providers** → **Google**

- ✅ **Enable Sign in with Google** : ON
- **Client ID (for OAuth)** : `votre-client-id.apps.googleusercontent.com`
- **Client Secret (for OAuth)** : `votre-client-secret`
- Cliquez sur **Save**

### 4. Configuration des URLs

**Authentication** → **URL Configuration**

**Site URL** :
```
https://mboaplace.com
```

**Redirect URLs** (une URL par ligne) :
```
http://localhost:3000/**
https://mboaplace.com/**
https://www.mboaplace.com/**
http://localhost:3000/profil
https://mboaplace.com/profil
https://www.mboaplace.com/profil
http://localhost:3000/auth/callback
https://mboaplace.com/auth/callback
https://www.mboaplace.com/auth/callback
```

**Additional Redirect URLs** (si demandé) :
```
https://mboaplace.com/*
https://www.mboaplace.com/*
```

---

## 🔧 Configuration de votre application

### Variables d'environnement

#### Développement local : `.env.local`
```env
VITE_SUPABASE_URL=https://ajurfjvmhojaafnswmxi.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key
```

#### Production : Variables d'environnement sur votre hébergeur

**Si vous utilisez Vercel** :
- Dashboard → Project Settings → Environment Variables
- Ajouter :
  ```
  VITE_SUPABASE_URL = https://ajurfjvmhojaafnswmxi.supabase.co
  VITE_SUPABASE_ANON_KEY = votre-anon-key
  ```

**Si vous utilisez Netlify** :
- Site settings → Build & deploy → Environment
- Ajouter les mêmes variables

**Si vous utilisez un VPS/serveur** :
- Créer un fichier `.env.production` avec les variables
- Le charger lors du déploiement

---

## 🧪 Tests à effectuer

### Test 1 : Développement local
1. Ouvrir http://localhost:3000
2. Cliquer sur "Se connecter avec Google"
3. ✅ Doit rediriger vers Google
4. ✅ Après autorisation → Retour sur http://localhost:3000/profil
5. ✅ Utilisateur connecté avec avatar et nom Google

### Test 2 : Production
1. Ouvrir https://mboaplace.com
2. Cliquer sur "Se connecter avec Google"
3. ✅ Doit rediriger vers Google
4. ✅ Après autorisation → Retour sur https://mboaplace.com/profil
5. ✅ Utilisateur connecté avec avatar et nom Google

### Test 3 : WWW Subdomain
1. Ouvrir https://www.mboaplace.com
2. Tester le même flow
3. ✅ Doit fonctionner identiquement

---

## 🔐 Écran de Consentement OAuth (si pas encore fait)

**APIs & Services** → **OAuth consent screen**

### Configuration :

**User Type** : External

**App information** :
- **App name** : MBOA PLACE
- **User support email** : votre-email@example.com
- **App logo** : Uploader votre logo (120x120px minimum)

**App domain** :
- **Application home page** : `https://mboaplace.com`
- **Application privacy policy link** : `https://mboaplace.com/politique-confidentialite`
- **Application terms of service link** : `https://mboaplace.com/cgu`

**Authorized domains** :
```
mboaplace.com
supabase.co
```

**Developer contact information** :
- Email : votre-email@example.com

**Scopes** :
- `.../auth/userinfo.email`
- `.../auth/userinfo.profile`
- `openid`

**Test users** (en mode Testing) :
- Ajouter vos emails de test

---

## 🚀 Déploiement Production

### Checklist avant déploiement

- [ ] Google Cloud Console configuré avec `mboaplace.com`
- [ ] Supabase configuré avec `mboaplace.com`
- [ ] Variables d'environnement production définies
- [ ] Build de production réussi : `npm run build`
- [ ] Test OAuth en local OK
- [ ] Code déployé sur production
- [ ] DNS configuré (A record ou CNAME vers votre hébergeur)
- [ ] SSL/HTTPS actif sur mboaplace.com
- [ ] Test OAuth en production OK

### Commandes de déploiement

**Build** :
```bash
npm run build
```

**Vérifier le build** :
```bash
npm run preview
```

**Déployer** (selon votre hébergeur) :

**Vercel** :
```bash
vercel --prod
```

**Netlify** :
```bash
netlify deploy --prod
```

**Autre** :
- Upload le dossier `dist/` vers votre serveur

---

## 🐛 Troubleshooting Production

### Erreur : "redirect_uri_mismatch"

**Cause** : L'URL de callback n'est pas dans la liste autorisée

**Solution** :
1. Vérifier dans Google Cloud Console que `https://mboaplace.com/auth/callback` ET `https://votreprojet.supabase.co/auth/v1/callback` sont bien listés
2. Attendre 1-2 minutes après modification
3. Vider le cache navigateur (Ctrl+Shift+Delete)
4. Réessayer

### Erreur : "invalid_client"

**Cause** : Client ID ou Secret incorrect dans Supabase

**Solution** :
1. Copier à nouveau le Client ID depuis Google Cloud Console
2. Copier à nouveau le Client Secret
3. Coller dans Supabase → Authentication → Providers → Google
4. Save

### L'utilisateur reste sur la page d'accueil

**Cause** : Problème de redirection (déjà corrigé dans le code)

**Solution** :
1. Ouvrir la console navigateur (F12)
2. Vérifier les logs "Auth state changed: SIGNED_IN"
3. Si absent, vérifier que le code mis à jour est bien déployé
4. Forcer un refresh sans cache (Ctrl+Shift+R)

### CORS Error

**Cause** : Domaine non autorisé

**Solution** :
1. Vérifier dans Google Cloud Console → Authorized JavaScript origins
2. Ajouter `https://mboaplace.com` si manquant
3. Dans Supabase → Settings → API → CORS Allowed Origins, ajouter `https://mboaplace.com`

---

## 📊 Monitoring Post-Déploiement

### Vérifications quotidiennes (première semaine)

**Dans Supabase Dashboard** :
- Authentication → Users : Vérifier les nouvelles inscriptions Google
- Logs : Chercher les erreurs auth

**Dans Google Cloud Console** :
- APIs & Services → Credentials → OAuth consent screen
- Metrics : Voir le nombre de connexions

### Métriques à surveiller

- ✅ Taux de succès OAuth (doit être > 95%)
- ✅ Temps de redirection (doit être < 3 secondes)
- ✅ Erreurs 4xx/5xx (doivent être < 1%)

---

## 🎯 Résumé Configuration Complète

### Google Cloud Console
```
JavaScript Origins:
  - https://mboaplace.com
  - https://www.mboaplace.com

Redirect URIs:
  - https://mboaplace.com/auth/callback
  - https://www.mboaplace.com/auth/callback
  - https://votreprojet.supabase.co/auth/v1/callback
```

### Supabase Dashboard
```
Site URL: https://mboaplace.com

Redirect URLs:
  - https://mboaplace.com/**
  - https://www.mboaplace.com/**
```

### Variables Environnement Production
```
VITE_SUPABASE_URL=https://votreprojet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-anon-key
```

---

## ✅ Validation Finale

Une fois tout configuré, testez ce parcours complet :

1. **Utilisateur non connecté** visite https://mboaplace.com
2. Clique sur **"Se connecter avec Google"**
3. **Popup/Redirection** vers Google
4. Sélectionne son compte Google
5. **Autorise** MBOA PLACE
6. **Retour automatique** sur https://mboaplace.com/profil
7. **Avatar + Nom** visibles en haut à droite
8. Peut naviguer dans l'app sans souci

Si toutes ces étapes fonctionnent → **🎉 Google OAuth est 100% opérationnel !**

---

## 📞 Support

En cas de problème persistant :
1. Vérifier les logs navigateur (F12 → Console)
2. Vérifier les logs Supabase (Dashboard → Logs)
3. Copier les messages d'erreur exacts
4. Vérifier que toutes les URLs sont identiques (pas de typo)

**Note** : La propagation des changements Google peut prendre jusqu'à 5 minutes. Si ça ne marche pas immédiatement, attendre un peu et réessayer.
