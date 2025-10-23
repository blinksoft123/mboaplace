# Configuration de la Base de Données Supabase pour MBOA PLACE

## Instructions d'installation

### Étape 1 : Accéder à votre projet Supabase

1. Connectez-vous à [Supabase](https://supabase.com)
2. Ouvrez votre projet : `ajurfjvmhojaafnswmxi`

### Étape 2 : Ouvrir l'éditeur SQL

1. Dans le menu latéral gauche, cliquez sur **SQL Editor** (icône 🔍)
2. Cliquez sur **+ New query** pour créer une nouvelle requête

### Étape 3 : Exécuter le script de configuration

1. Ouvrez le fichier `supabase_setup.sql` dans ce dossier
2. Copiez **tout** le contenu du fichier
3. Collez-le dans l'éditeur SQL de Supabase
4. Cliquez sur **Run** (ou appuyez sur Ctrl/Cmd + Enter)

⏱️ L'exécution prendra quelques secondes.

### Étape 4 : Vérifier la création des tables

1. Dans le menu latéral, cliquez sur **Table Editor** (icône 📊)
2. Vous devriez voir les tables suivantes :
   - ✅ `profiles`
   - ✅ `annonces`
   - ✅ `conversations`
   - ✅ `messages`
   - ✅ `reviews`
   - ✅ `favorites`
   - ✅ `reports`

### Étape 5 : Vérifier les buckets de storage

1. Dans le menu latéral, cliquez sur **Storage** (icône 📦)
2. Vous devriez voir les buckets :
   - ✅ `avatars` (Public)
   - ✅ `annonce_images` (Public)

## Structure de la Base de Données

### Tables créées

| Table | Description | Relations |
|-------|-------------|-----------|
| **profiles** | Profils utilisateurs étendus | Lié à `auth.users` |
| **annonces** | Annonces/Petites annonces | `user_id` → `profiles.id` |
| **conversations** | Fils de discussion | `buyer_id`, `seller_id` → `profiles.id` |
| **messages** | Messages individuels | `conversation_id` → `conversations.id` |
| **reviews** | Évaluations utilisateurs | `reviewer_id`, `reviewed_id` → `profiles.id` |
| **favorites** | Annonces favorites | `user_id` → `profiles.id`, `annonce_id` → `annonces.id` |
| **reports** | Signalements | `reporter_id` → `profiles.id` |

### Politiques de sécurité (RLS)

✅ **Row Level Security (RLS)** est activé sur toutes les tables

- Les utilisateurs peuvent voir leur propre profil et mettre à jour leurs informations
- Les annonces actives sont visibles par tous, mais seul le propriétaire peut les modifier
- Les conversations et messages sont privés (visibles uniquement par les participants)
- Les avis sont publics mais seul l'auteur peut créer un avis

### Déclencheurs (Triggers)

- ✅ Création automatique du profil lors de l'inscription
- ✅ Mise à jour automatique des timestamps `updated_at`

### Fonctions personnalisées

- `increment_view_count(ad_id)` : Incrémente le compteur de vues d'une annonce

## Fonctionnalités du Dashboard

Après la configuration, ces fonctionnalités seront opérationnelles :

### ✅ Dashboard Utilisateur (ProfilePage)
- Statistiques : annonces actives, vues totales, messages non lus, note moyenne
- Liste des annonces de l'utilisateur
- Navigation vers mes annonces, favoris, messages, avis

### ✅ Publication d'annonces (PublishPage)
- Upload d'images vers le bucket `annonce_images`
- Sauvegarde complète des détails de l'annonce
- Géolocalisation (ville, pays, coordonnées GPS)

### ✅ Page d'accueil (HomePage)
- Affichage des 8 dernières annonces avec profil du vendeur
- Compteur de vues automatique

### ✅ Détails d'une annonce (AnnonceDetailPage)
- Affichage complet avec images
- Informations du vendeur
- Incrémentation automatique des vues

## Problèmes potentiels et solutions

### Si l'exécution du script échoue :

1. **Erreur : "relation already exists"**
   - Normal si vous ré-exécutez le script
   - Les tables existantes ne seront pas modifiées grâce à `IF NOT EXISTS`

2. **Erreur sur les politiques de storage**
   - Allez dans **Storage** > **Policies**
   - Supprimez les politiques existantes manuellement
   - Ré-exécutez le script

3. **Erreur d'authentification**
   - Vérifiez que vous êtes bien connecté à Supabase
   - Assurez-vous d'avoir les droits d'administration sur le projet

## Tests recommandés

Après l'installation, testez les fonctionnalités suivantes :

1. ✅ Inscription d'un nouvel utilisateur
2. ✅ Connexion
3. ✅ Modification du profil avec upload d'avatar
4. ✅ Publication d'une annonce avec images
5. ✅ Visualisation du dashboard avec statistiques
6. ✅ Consultation d'une annonce (compteur de vues)

## Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12) pour les erreurs
2. Consultez les logs Supabase dans l'onglet **Logs**
3. Vérifiez que toutes les tables ont bien été créées

---

**🎉 Une fois configuré, votre application MBOA PLACE sera pleinement fonctionnelle !**
