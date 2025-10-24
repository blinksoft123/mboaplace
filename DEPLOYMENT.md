# 🚀 DÉPLOIEMENT - MBOA PLACE

## 📊 Vue d'ensemble

Application déployée avec succès sur **Vercel** avec déploiements automatiques depuis GitHub.

---

## 🌐 URLs de Production

### URL Principale (Production)
**https://mboaplace-n4828534o-ernestwandie-gmailcoms-projects.vercel.app**

### Dashboard Vercel
**https://vercel.com/ernestwandie-gmailcoms-projects/mboaplace**

### Repository GitHub
**https://github.com/blinksoft123/mboaplace**

---

## ⚙️ Configuration Vercel

### Variables d'Environnement

Les variables suivantes sont configurées dans Vercel :

| Variable | Description | Environnement |
|----------|-------------|---------------|
| `VITE_SUPABASE_URL` | URL de la base Supabase | Production |
| `VITE_SUPABASE_ANON_KEY` | Clé publique Supabase | Production |
| `VITE_GOOGLE_MAPS_API_KEY` | Clé API Google Maps | Production |

### Configuration Build

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

---

## 🔄 Déploiements Automatiques

### Depuis GitHub

Chaque push sur la branche `master` déclenche automatiquement :

1. **Build** automatique sur Vercel
2. **Tests** de build (si configurés)
3. **Déploiement** en production
4. **URL** de preview générée

### Workflow de Déploiement

```bash
# 1. Faire vos modifications localement
git add .
git commit -m "feat: nouvelle fonctionnalité"

# 2. Pousser vers GitHub
git push origin master

# 3. Vercel détecte le push et déploie automatiquement
# Consulter : https://vercel.com/ernestwandie-gmailcoms-projects/mboaplace
```

---

## 📝 Commandes Utiles

### Déploiement Manuel

```bash
# Déployer en production
vercel --prod

# Déployer en preview
vercel

# Voir les logs
vercel logs

# Lister les déploiements
vercel ls

# Annuler un déploiement
vercel rm [deployment-url]
```

### Variables d'Environnement

```bash
# Lister les variables
vercel env ls

# Ajouter une variable
vercel env add [NOM_VARIABLE] production

# Supprimer une variable
vercel env rm [NOM_VARIABLE] production

# Voir une variable
vercel env pull
```

---

## 🔧 Configuration Supabase pour Production

### 1. Autoriser le domaine Vercel

Dans Supabase Dashboard → Authentication → URL Configuration :

**Site URL** :
```
https://mboaplace-n4828534o-ernestwandie-gmailcoms-projects.vercel.app
```

**Redirect URLs** :
```
https://mboaplace-n4828534o-ernestwandie-gmailcoms-projects.vercel.app/**
https://mboaplace-n4828534o-ernestwandie-gmailcoms-projects.vercel.app/auth/callback
```

### 2. Google OAuth Configuration

Dans Google Cloud Console → Credentials :

**Authorized JavaScript origins** :
```
https://mboaplace-n4828534o-ernestwandie-gmailcoms-projects.vercel.app
```

**Authorized redirect URIs** :
```
https://ajurfjvmhojaafnswmxi.supabase.co/auth/v1/callback
```

---

## 🎯 Domaine Personnalisé (Optionnel)

### Ajouter mboaplace.com

1. **Dans Vercel Dashboard** :
   - Settings → Domains → Add Domain
   - Entrer : `mboaplace.com` et `www.mboaplace.com`

2. **Configurer DNS** :
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Attendre propagation** : 24-48h

### SSL/HTTPS

Vercel configure automatiquement :
- ✅ Certificat SSL Let's Encrypt
- ✅ Renouvellement automatique
- ✅ HTTPS forcé
- ✅ HTTP/2 activé

---

## 📊 Monitoring & Performance

### Analytics Vercel (Inclus)

- **Page views** : Nombre de visites
- **Performance** : Core Web Vitals
- **Errors** : Suivi des erreurs
- **Bandwidth** : Consommation

**Accès** : https://vercel.com/ernestwandie-gmailcoms-projects/mboaplace/analytics

### Lighthouse Scores

Objectifs à maintenir :

| Métrique | Score Cible |
|----------|-------------|
| Performance | > 90 |
| Accessibility | > 90 |
| Best Practices | > 90 |
| SEO | > 90 |

---

## 🐛 Troubleshooting

### Build Failed

```bash
# Vérifier les logs
vercel logs

# Tester en local
npm run build

# Vérifier les variables d'environnement
vercel env pull
```

### Variables d'environnement manquantes

```bash
# Ajouter les variables manquantes
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_GOOGLE_MAPS_API_KEY production

# Redéployer
vercel --prod
```

### OAuth ne fonctionne pas en production

1. Vérifier les URLs autorisées dans Supabase
2. Vérifier les origins dans Google Cloud Console
3. Tester le hash cleanup dans SupabaseAuthContext.jsx

### Cache issues

```bash
# Purger le cache Vercel
# Dashboard → Deployments → [Select deployment] → Redeploy
```

---

## 🔐 Sécurité

### ✅ Bonnes Pratiques Appliquées

- [x] Variables d'environnement dans Vercel (pas dans le code)
- [x] `.env.local` dans `.gitignore`
- [x] HTTPS forcé sur Vercel
- [x] Headers de sécurité configurés
- [x] CORS configuré dans Supabase

### ⚠️ À Faire

- [ ] Configurer rate limiting (Supabase)
- [ ] Ajouter monitoring d'erreurs (Sentry)
- [ ] Configurer backups automatiques (Supabase)
- [ ] Mettre en place CI/CD tests

---

## 📈 Quotas Vercel (Hobby Plan)

| Resource | Limite | Usage Actuel |
|----------|--------|--------------|
| Bandwidth | 100 GB/mois | ~0% |
| Builds | 6000 min/mois | ~1% |
| Serverless Functions | 100 GB-hours | N/A (static) |
| Deployments | Illimité | ✓ |

---

## 🎯 Checklist Déploiement

### Initial Deploy ✅

- [x] Créer compte Vercel
- [x] Connecter repository GitHub
- [x] Configurer variables d'environnement
- [x] Premier déploiement réussi
- [x] Tester URL de production

### Configuration Supabase ⚠️

- [ ] Ajouter URL Vercel dans Supabase Dashboard
- [ ] Tester OAuth Google en production
- [ ] Tester OAuth Facebook (si configuré)
- [ ] Vérifier CORS

### Google Maps ⚠️

- [ ] Restreindre API Key aux domaines Vercel
- [ ] Vérifier quotas Google Maps
- [ ] Tester CityAutocomplete en production

### Tests Post-Déploiement ⚠️

- [ ] Inscription/Connexion fonctionne
- [ ] Upload d'images fonctionne
- [ ] Messagerie temps réel fonctionne
- [ ] Recherche fonctionne
- [ ] Favoris fonctionnent
- [ ] Performance > 90 (Lighthouse)

---

## 🔄 Rollback

En cas de problème avec un déploiement :

```bash
# Lister les déploiements
vercel ls

# Promouvoir un ancien déploiement en production
vercel promote [deployment-url]

# Ou via Dashboard
# Deployments → [Select old deployment] → Promote to Production
```

---

## 📞 Support

### Vercel
- **Documentation** : https://vercel.com/docs
- **Support** : https://vercel.com/support
- **Status** : https://vercel-status.com

### Supabase
- **Documentation** : https://supabase.com/docs
- **Discord** : https://discord.supabase.com
- **Status** : https://status.supabase.com

---

## 📅 Changelog Déploiements

### v2.0 - 24 Octobre 2025
- ✅ Déploiement initial sur Vercel
- ✅ Configuration variables d'environnement
- ✅ Optimisations de performance (code splitting, lazy loading)
- ✅ Connexion repository GitHub
- ✅ Déploiements automatiques activés

---

**Dernière mise à jour** : 24 octobre 2025
**Version** : 2.0
**Environnement** : Production
**Status** : 🟢 En ligne
