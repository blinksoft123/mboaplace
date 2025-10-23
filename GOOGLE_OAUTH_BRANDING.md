# Masquer l'URL Supabase dans Google OAuth

## 🔍 Problème
L'URL `xcgloxbhbbvoqzhbrdpf.supabase.co` apparaît sur la page de connexion Google, ce qui expose votre ID de projet Supabase.

## 💡 Pourquoi ça arrive ?
Google affiche toujours le domaine de l'**Application OAuth** enregistrée dans Google Cloud Console, pas l'URL de redirection. Supabase utilise son propre domaine pour gérer l'OAuth.

---

## ✅ Solution 1: Configurer un Domaine Personnalisé (RECOMMANDÉ)

### Étape 1: Configurer un domaine personnalisé dans Supabase

1. Allez sur [Supabase Dashboard](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Custom Domains**
4. Ajoutez votre domaine: `auth.place.mboasend.com` ou `api.place.mboasend.com`
5. Suivez les instructions pour configurer les DNS

### Étape 2: Mettre à jour la configuration Google

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Sélectionnez votre projet
3. Allez dans **APIs & Services** → **Credentials**
4. Trouvez votre OAuth 2.0 Client ID pour Supabase
5. Modifiez les **Authorized redirect URIs**:
   - Remplacez: `https://xcgloxbhbbvoqzhbrdpf.supabase.co/auth/v1/callback`
   - Par: `https://auth.place.mboasend.com/auth/v1/callback`

### Étape 3: Mettre à jour Supabase

1. Dans Supabase Dashboard → **Authentication** → **Providers**
2. Mettez à jour la configuration Google avec le nouveau Client ID/Secret si nécessaire

**Résultat:** Google affichera `auth.place.mboasend.com` au lieu de l'ID Supabase ✨

---

## ✅ Solution 2: Configurer l'Écran de Consentement Google (SOLUTION IMMÉDIATE)

Cette solution masque partiellement l'URL en ajoutant votre branding.

### Étape 1: Configurer l'écran de consentement OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. **APIs & Services** → **OAuth consent screen**
3. Si vous n'avez pas encore configuré l'écran, choisissez **External**
4. Remplissez les informations:

```
Nom de l'application: MBOA PLACE
Email d'assistance utilisateur: [votre email]
Logo de l'application: [Upload votre logo - 120x120px]
Domaine de l'application: place.mboasend.com
Page d'accueil de l'application: https://place.mboasend.com
Politique de confidentialité: https://place.mboasend.com/cgu
Conditions d'utilisation: https://place.mboasend.com/cgu
Domaines autorisés: 
  - place.mboasend.com
  - supabase.co
```

5. **Scopes** (Étape 2): Ajoutez uniquement les scopes nécessaires
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`

6. **Test users** (Étape 3): Ajoutez vos emails de test (si mode test)

7. Sauvegardez

### Étape 2: Publier l'application (optionnel mais recommandé)

1. Retournez sur **OAuth consent screen**
2. Cliquez sur **Publish App**
3. Soumettez pour vérification si vous voulez sortir du mode test

**Note:** En mode test, seuls les utilisateurs ajoutés peuvent se connecter (max 100 utilisateurs)

---

## ✅ Solution 3: URL de Marque dans les Messages (PARTIEL)

Même si l'URL technique est visible, vous pouvez ajouter votre branding pour rassurer les utilisateurs.

### Ajoutez un message informatif avant la connexion:

```javascript
// Dans LoginPage.jsx, avant les boutons OAuth
<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
  <p className="text-sm text-blue-800">
    🔒 <strong>Connexion sécurisée</strong> - Vous serez redirigé vers Google pour vous authentifier en toute sécurité.
  </p>
</div>
```

---

## 🎯 Solution Complète (MEILLEURE APPROCHE)

Combinez les solutions 1 et 2 pour une expérience optimale:

### Configuration Idéale:

1. **Domaine personnalisé Supabase**: `auth.place.mboasend.com`
2. **Écran de consentement Google configuré** avec votre branding
3. **Logo et nom d'application** bien visibles
4. **Application publiée** (pas en mode test)

### Résultat final:

```
✅ Google affiche: "auth.place.mboasend.com" ou "MBOA PLACE"
✅ Logo de votre app visible
✅ Description claire
✅ Aucune mention de Supabase
```

---

## 🔄 Migration Rapide (Sans domaine personnalisé)

Si vous ne pouvez pas configurer un domaine personnalisé tout de suite:

### Option 1: Message explicatif dans l'app

```javascript
// LoginPage.jsx - Ajoutez avant les boutons OAuth
<div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
  <p className="text-sm text-gray-700">
    <strong>Note:</strong> Notre authentification utilise une infrastructure sécurisée. 
    L'URL technique affichée est normale et garantit votre sécurité.
  </p>
</div>
```

### Option 2: Utilisez votre propre serveur OAuth proxy

C'est plus complexe mais donne un contrôle total. Requiert un backend Node.js.

---

## 📋 Checklist de Configuration

### Pour Solution 1 (Domaine personnalisé):
- [ ] Domaine configuré dans DNS
- [ ] Domaine personnalisé ajouté dans Supabase
- [ ] Certificate SSL validé
- [ ] Redirect URIs mis à jour dans Google
- [ ] Tests effectués

### Pour Solution 2 (Écran de consentement):
- [ ] Écran de consentement OAuth configuré
- [ ] Logo uploadé (120x120px)
- [ ] Domaine d'application ajouté
- [ ] Politique de confidentialité accessible
- [ ] Scopes minimum sélectionnés
- [ ] Application publiée (ou utilisateurs test ajoutés)

---

## 🚀 Implémentation Immédiate

Pendant que vous configurez les solutions ci-dessus, ajoutez ce message dans votre app:

```javascript
// src/pages/LoginPage.jsx et RegisterPage.jsx
// Ajoutez juste avant les boutons OAuth

<div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
  <div className="flex items-start space-x-2">
    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <div>
      <p className="text-sm font-semibold text-green-800">Connexion 100% sécurisée</p>
      <p className="text-xs text-green-700 mt-1">
        Nous utilisons les systèmes d'authentification officiels de Google pour protéger votre compte.
      </p>
    </div>
  </div>
</div>
```

---

## 🐛 FAQ

**Q: Est-ce dangereux que l'URL Supabase soit visible ?**  
R: Non, c'est normal. Tous les services (Firebase, Auth0, etc.) montrent leur URL technique. Supabase est sécurisé avec RLS.

**Q: Puis-je complètement cacher l'URL Supabase ?**  
R: Oui, avec un domaine personnalisé (Solution 1).

**Q: Combien coûte un domaine personnalisé Supabase ?**  
R: Disponible sur le plan Pro (25$/mois). Le plan gratuit ne supporte pas les domaines personnalisés.

**Q: Les utilisateurs vont-ils avoir peur de l'URL technique ?**  
R: La plupart des utilisateurs ne remarquent pas. Un bon branding (logo, nom d'app) dans l'écran OAuth suffit généralement.

---

## 📞 Support

Pour plus d'informations:
- [Supabase Custom Domains](https://supabase.com/docs/guides/platform/custom-domains)
- [Google OAuth Consent Screen](https://support.google.com/cloud/answer/10311615)

---

**Recommandation:** Commencez par la Solution 2 (écran de consentement) maintenant, puis migrez vers la Solution 1 (domaine personnalisé) quand vous serez sur le plan Pro de Supabase.
