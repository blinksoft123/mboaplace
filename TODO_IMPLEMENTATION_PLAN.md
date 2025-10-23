# 📝 TODO LIST - PLAN D'IMPLÉMENTATION MBOA PLACE

## 🎯 SPRINT 1 : MVP COMPLET (Priorité Haute - 2 semaines)

### ✅ TODO 1 : Système de Favoris Complet
**Durée estimée** : 2 heures
**Priorité** : 🔴 Critique

#### Tâches
- [ ] **1.1** Créer le composant `FavoriteButton.jsx` réutilisable
  - Vérification si annonce est favorite
  - Toggle ajouter/retirer
  - Gestion états (loading, error)
  - Animation cœur
  
- [ ] **1.2** Intégrer dans `HomePage.jsx`
  - Remplacer bouton statique ligne ~211
  - Import du composant
  - Tester ajout/retrait

- [ ] **1.3** Intégrer dans `AnnonceDetailPage.jsx`
  - Remplacer bouton statique ligne ~144
  - Afficher texte "Favoris" + icône
  - Tester fonctionnement

- [ ] **1.4** Intégrer dans `CategoryDetailPage.jsx`
  - Ajouter sur chaque carte annonce
  - Position top-right
  - Tester responsive

- [ ] **1.5** Ajouter compteur de favoris (optionnel)
  - Afficher nombre de personnes qui ont mis en favori
  - Position sous le prix
  - Format : "❤️ X personnes intéressées"

#### Fichiers à créer/modifier
- `src/components/FavoriteButton.jsx` (CRÉER)
- `src/pages/HomePage.jsx` (MODIFIER)
- `src/pages/AnnonceDetailPage.jsx` (MODIFIER)
- `src/pages/CategoryDetailPage.jsx` (MODIFIER)

#### Tests à effectuer
- [x] Utilisateur non connecté → Redirection vers /connexion
- [x] Ajout favori → Cœur rouge + toast confirmation
- [x] Retrait favori → Cœur vide + toast confirmation
- [x] Synchronisation avec page "Mes Favoris"
- [x] État persistant après refresh page

---

### ✅ TODO 2 : Modification d'Annonce
**Durée estimée** : 4 heures
**Priorité** : 🔴 Critique

#### Tâches
- [ ] **2.1** Créer la page `EditAnnoncePage.jsx`
  - Copier la structure de `PublishPage.jsx`
  - Récupérer l'annonce par ID
  - Pré-remplir tous les champs
  
- [ ] **2.2** Gérer les images existantes
  - Afficher images actuelles
  - Permettre suppression
  - Permettre ajout nouvelles images
  - Limiter total à 10

- [ ] **2.3** Formulaire de modification
  - Tous les champs éditables
  - Validation identique à PublishPage
  - Bouton "Enregistrer les modifications"
  - Bouton "Annuler" → retour

- [ ] **2.4** Route et navigation
  - Ajouter route `/annonce/edit/:id`
  - Lien depuis `MyAnnoncesPage.jsx`
  - Vérification propriété annonce (sécurité)

- [ ] **2.5** Update en base de données
  - Fonction UPDATE Supabase
  - Mise à jour `updated_at` automatique
  - Gestion erreurs
  - Toast succès

#### Fichiers à créer/modifier
- `src/pages/EditAnnoncePage.jsx` (CRÉER)
- `src/App.jsx` ou routeur (MODIFIER - ajouter route)
- `src/pages/MyAnnoncesPage.jsx` (MODIFIER - rendre bouton fonctionnel)

#### Tests à effectuer
- [x] Accès page édition uniquement si propriétaire
- [x] Tous les champs pré-remplis correctement
- [x] Images existantes affichées
- [x] Modifications sauvegardées en BDD
- [x] Retour à "Mes annonces" après succès

---

### ✅ TODO 3 : Initier une Conversation
**Durée estimée** : 3 heures
**Priorité** : 🔴 Critique

#### Tâches
- [ ] **3.1** Fonction création conversation
  - Vérifier si conversation existe déjà
  - Créer conversation si nécessaire
  - Lier à l'annonce
  - Retourner ID conversation

- [ ] **3.2** Bouton "Contacter le vendeur" fonctionnel
  - Dans `AnnonceDetailPage.jsx` ligne ~165
  - Remplacer `handleAction` par fonction réelle
  - Vérifier utilisateur connecté
  - Empêcher contact soi-même

- [ ] **3.3** Redirection vers messagerie
  - Créer/récupérer conversation
  - Naviguer vers `/profil/messages`
  - Sélectionner automatiquement la conversation
  - Option : pré-remplir message ("Bonjour, je suis intéressé par...")

- [ ] **3.4** Boutons alternatifs (Email, WhatsApp)
  - Email : `mailto:` avec sujet pré-rempli
  - WhatsApp : lien `wa.me` si numéro disponible
  - Afficher seulement si numéro renseigné

#### Fichiers à modifier
- `src/pages/AnnonceDetailPage.jsx`
- `src/pages/MessagesPage.jsx` (sélection conversation)
- Possiblement créer `src/utils/conversations.js` (helper functions)

#### Tests à effectuer
- [x] Utilisateur non connecté → Redirection /connexion
- [x] Contact vendeur → Conversation créée
- [x] Pas de doublon conversation
- [x] Impossible de se contacter soi-même
- [x] Redirection vers messagerie fonctionnelle

---

### ✅ TODO 4 : Système d'Avis (Reviews)
**Durée estimée** : 6 heures
**Priorité** : 🔴 Haute

#### Tâches
- [ ] **4.1** Page "Laisser un avis"
  - Sélection étoiles (1-5)
  - Champ commentaire (optionnel)
  - Validation (impossible avis sur soi-même)
  - Lien vers utilisateur évalué

- [ ] **4.2** Affichage avis sur profil vendeur
  - Section "Avis reçus" dans ProfilePage
  - Liste des avis avec note, commentaire, date
  - Avatar et nom de l'évaluateur
  - Pagination si > 5 avis

- [ ] **4.3** Page `MyReviewsPage.jsx` fonctionnelle
  - Remplacer contenu placeholder
  - Onglets : "Avis reçus" / "Avis donnés"
  - Affichage complet avec annonce liée
  - Stats : note moyenne, total avis

- [ ] **4.4** Calcul note moyenne automatique
  - Mettre à jour `profiles.average_rating` (ajouter colonne)
  - Trigger SQL automatique sur INSERT/UPDATE/DELETE reviews
  - Affichage étoiles dans ProfilePage et cards

- [ ] **4.5** Accès depuis annonces
  - Bouton "Laisser un avis" visible après transaction
  - Lien depuis détail annonce
  - Notification "Laissez un avis !"

#### Fichiers à créer/modifier
- `src/pages/LeaveReviewPage.jsx` (CRÉER)
- `src/pages/MyReviewsPage.jsx` (MODIFIER)
- `src/pages/ProfilePage.jsx` (AJOUTER section avis)
- `src/pages/AnnonceDetailPage.jsx` (afficher note vendeur)
- SQL : Ajouter colonne `average_rating` à profiles
- SQL : Créer trigger calcul automatique

#### Tests à effectuer
- [x] Impossible de s'auto-évaluer
- [x] Note obligatoire, commentaire optionnel
- [x] Avis visible sur profil évalué
- [x] Note moyenne calculée correctement
- [x] Un seul avis par couple utilisateur/annonce

---

### ✅ TODO 5 : Recherche Avancée
**Durée estimée** : 6 heures
**Priorité** : 🔴 Haute

#### Tâches
- [ ] **5.1** Améliorer `SearchPage.jsx`
  - Ajouter sidebar filtres
  - Filtres : catégorie, prix min/max, ville, date
  - Checkboxes : "Gratuit uniquement", "Négociable"
  - Bouton "Réinitialiser filtres"

- [ ] **5.2** Requête Supabase avec filtres
  - Construire query dynamique
  - Gérer multiple filtres simultanés
  - Optimisation avec indexes
  - Pagination (20 résultats/page)

- [ ] **5.3** Tri des résultats
  - Dropdown tri : "Plus récent", "Prix croissant", "Prix décroissant", "Pertinence"
  - Appliquer tri sur query
  - État tri persistant

- [ ] **5.4** Sauvegarde recherches (optionnel)
  - Table `saved_searches` en BDD
  - Bouton "Sauvegarder cette recherche"
  - Page "Mes recherches sauvegardées"
  - Notifications nouvelles annonces

- [ ] **5.5** Recherche dans CategoriesPage
  - Activer barre recherche ligne ~92
  - Filtrer catégories par mot-clé
  - Redirection vers SearchPage avec filtre

#### Fichiers à modifier
- `src/pages/SearchPage.jsx`
- `src/pages/CategoriesPage.jsx`
- SQL : Créer table `saved_searches` (optionnel)

#### Tests à effectuer
- [x] Filtres appliqués correctement
- [x] Combinaison multiple filtres
- [x] Tri fonctionnel
- [x] Pagination sans erreur
- [x] Résultats pertinents

---

### ✅ TODO 6 : Signalement & Modération
**Durée estimée** : 4 heures
**Priorité** : 🔴 Haute

#### Tâches
- [ ] **6.1** Composant modal de signalement
  - Créer `ReportModal.jsx`
  - Raisons prédéfinies (spam, arnaque, contenu inapproprié, autre)
  - Champ description
  - Bouton "Envoyer le signalement"

- [ ] **6.2** Bouton "Signaler" fonctionnel
  - Dans `AnnonceDetailPage.jsx` ligne ~145
  - Ouvrir modal signalement
  - Enregistrer en BDD table `reports`
  - Toast confirmation

- [ ] **6.3** Dashboard admin - Signalements
  - Section dans `AdminDashboardPage.jsx`
  - Liste signalements : statut, date, utilisateur, raison
  - Filtres : pending, reviewed, resolved, dismissed
  - Actions : "Valider", "Rejeter", "Contacter utilisateur"

- [ ] **6.4** Actions admin
  - Changer statut signalement
  - Suspendre annonce signalée
  - Bannir utilisateur (optionnel, sévère)
  - Envoyer email notification

- [ ] **6.5** Historique signalements utilisateur
  - Page pour voir ses signalements
  - Statut traitement
  - Réponse admin si applicable

#### Fichiers à créer/modifier
- `src/components/ReportModal.jsx` (CRÉER)
- `src/pages/AnnonceDetailPage.jsx` (MODIFIER)
- `src/pages/AdminDashboardPage.jsx` (AJOUTER section)
- `src/pages/MyReportsPage.jsx` (CRÉER - optionnel)

#### Tests à effectuer
- [x] Signalement enregistré en BDD
- [x] Admin voit tous les signalements
- [x] Actions admin fonctionnelles
- [x] Notifications envoyées
- [x] Impossible signaler plusieurs fois même annonce

---

## 📊 SUIVI DE PROGRESSION

```
SPRINT 1 - MVP COMPLET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0/6

1. ⭐ Favoris complet         [░░░░░░░░░░] 0/5 tâches
2. ✏️ Modification annonce    [░░░░░░░░░░] 0/5 tâches  
3. 💬 Initier conversation    [░░░░░░░░░░] 0/4 tâches
4. ⭐ Système avis            [░░░░░░░░░░] 0/5 tâches
5. 🔍 Recherche avancée       [░░░░░░░░░░] 0/5 tâches
6. 🚨 Signalement             [░░░░░░░░░░] 0/5 tâches

Total : 0/29 sous-tâches complétées
Temps estimé restant : 25 heures
```

---

## 🎯 SPRINT 2 : FONCTIONNALITÉS PREMIUM (Priorité Moyenne - 3 semaines)

### ✅ TODO 7 : Notifications
**Durée estimée** : 6 heures
**Priorité** : 🟡 Moyenne

#### Tâches
- [ ] **7.1** Table notifications en BDD
- [ ] **7.2** Bell icon avec badge compteur
- [ ] **7.3** Dropdown liste notifications
- [ ] **7.4** Types : nouveau message, favori, avis, annonce vendue
- [ ] **7.5** Marquer comme lu
- [ ] **7.6** Préférences notifications (SettingsPage)

---

### ✅ TODO 8 : Système d'Emails
**Durée estimée** : 4 heures
**Priorité** : 🟡 Moyenne

#### Tâches
- [ ] **8.1** Configuration Supabase Edge Functions ou service externe (SendGrid/Resend)
- [ ] **8.2** Template email confirmation inscription
- [ ] **8.3** Template reset password
- [ ] **8.4** Template notification nouveau message
- [ ] **8.5** Email résumé hebdomadaire (optionnel)

---

### ✅ TODO 9 : Dashboard Admin Complet
**Durée estimée** : 8 heures
**Priorité** : 🟡 Moyenne

#### Tâches
- [ ] **9.1** Statistiques globales (users, annonces, messages)
- [ ] **9.2** Graphiques (Chart.js ou Recharts)
- [ ] **9.3** Gestion utilisateurs (liste, bannir, promouvoir)
- [ ] **9.4** Validation annonces (si workflow validation)
- [ ] **9.5** Logs activité

---

### ✅ TODO 10 : Carte Interactive
**Durée estimée** : 6 heures
**Priorité** : 🟡 Moyenne

#### Tâches
- [ ] **10.1** Intégrer Google Maps (déjà API key configurée)
- [ ] **10.2** Afficher markers annonces
- [ ] **10.3** Clustering si > 100 annonces
- [ ] **10.4** Toggle vue carte/liste
- [ ] **10.5** Clic marker → popup annonce

---

### ✅ TODO 11 : Partage Social
**Durée estimée** : 2 heures
**Priorité** : 🟡 Moyenne

#### Tâches
- [ ] **11.1** Bouton partage Facebook fonctionnel
- [ ] **11.2** Bouton partage WhatsApp
- [ ] **11.3** Copier lien annonce
- [ ] **11.4** Génération QR code (optionnel)
- [ ] **11.5** Open Graph meta tags (SEO)

---

### ✅ TODO 12 : Système Premium
**Durée estimée** : 12 heures
**Priorité** : 🟡 Moyenne

#### Tâches
- [ ] **12.1** Intégration Stripe ou PayPal
- [ ] **12.2** Plans tarifaires (page Premium)
- [ ] **12.3** Checkout et webhook paiement
- [ ] **12.4** Badge "Premium" sur profil
- [ ] **12.5** Fonctionnalités premium (remontée auto, stats avancées)
- [ ] **12.6** Gestion abonnements (annulation, renouvellement)

---

## 🎯 SPRINT 3 : OPTIMISATION & SCALE (Priorité Basse - 4 semaines)

### ✅ TODO 13 : Application Mobile PWA
- [ ] Manifest.json
- [ ] Service Worker
- [ ] Mode offline
- [ ] Installation prompt
- [ ] Push notifications mobile

### ✅ TODO 14 : Analytics Utilisateur
- [ ] Dashboard analytics personnel
- [ ] Graphiques performances annonces
- [ ] Taux de conversion
- [ ] Export CSV données

### ✅ TODO 15 : Galerie Photos Avancée
- [ ] Drag & drop réorganisation
- [ ] Lightbox zoom
- [ ] Édition images (crop)
- [ ] Compression automatique

### ✅ TODO 16 : Booster Annonce
- [ ] Système paiement boost
- [ ] Remontée automatique
- [ ] Badge "Sponsorisé"
- [ ] Statistiques boost

### ✅ TODO 17 : Personnalisation UI
- [ ] Mode sombre/clair
- [ ] Sélecteur taille police
- [ ] Thèmes couleur
- [ ] Sauvegarde préférences

### ✅ TODO 18 : Optimisations Performance
- [ ] Lazy loading images
- [ ] Code splitting routes
- [ ] Cache Supabase queries
- [ ] Optimisation bundle
- [ ] Lighthouse score > 90

---

## 📅 CALENDRIER PRÉVISIONNEL

### Semaine 1-2 : Sprint 1 (MVP Complet)
- Jour 1-2 : Favoris complet
- Jour 3-4 : Modification annonce  
- Jour 5 : Initier conversation
- Jour 6-7 : Système avis
- Jour 8-9 : Recherche avancée
- Jour 10 : Signalement

### Semaine 3-5 : Sprint 2 (Premium)
- Semaine 3 : Notifications + Emails + Dashboard Admin
- Semaine 4 : Carte interactive + Partage social
- Semaine 5 : Système Premium

### Semaine 6-9 : Sprint 3 (Optimisation)
- Semaine 6 : PWA + Analytics
- Semaine 7 : Galerie avancée + Booster
- Semaine 8 : Personnalisation UI
- Semaine 9 : Optimisations performance

---

## 🏆 CRITÈRES DE SUCCÈS

### Fonctionnalités Core (Sprint 1)
- ✅ Utilisateurs peuvent ajouter favoris partout
- ✅ Utilisateurs peuvent modifier leurs annonces
- ✅ Utilisateurs peuvent contacter vendeurs facilement
- ✅ Système d'avis fonctionnel et fiable
- ✅ Recherche avancée avec filtres multiples
- ✅ Signalements traités par admins

### KPIs
- 🎯 Taux conversion visiteur → inscription : > 10%
- 🎯 Taux publication annonce : > 30% inscrits
- 🎯 Taux messages envoyés : > 20% visiteurs annonce
- 🎯 Score Lighthouse : > 90
- 🎯 Temps chargement : < 3s

---

**Date création** : 23 octobre 2025
**Dernière mise à jour** : 23 octobre 2025
**Révision** : v1.0
**Statut global** : 🚀 Prêt à démarrer
