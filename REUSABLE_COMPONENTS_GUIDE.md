# Guide des composants UI réutilisables

Ce guide présente les composants UI réutilisables créés pour améliorer la cohérence et la maintenabilité du code.

## 1. LoadMoreButton

Bouton standardisé pour la pagination "Load More".

### Import
```jsx
import LoadMoreButton from '@/components/ui/LoadMoreButton';
```

### Props
| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `onClick` | function | *requis* | Callback au clic |
| `loading` | boolean | `false` | État de chargement |
| `disabled` | boolean | `false` | Désactiver le bouton |
| `text` | string | `"Voir plus"` | Texte du bouton |
| `loadingText` | string | `"Chargement..."` | Texte pendant le chargement |
| `className` | string | `""` | Classes CSS additionnelles |
| `variant` | string | `"primary"` | Variante (`primary`, `secondary`, `outline`) |

### Exemples
```jsx
// Utilisation basique
<LoadMoreButton
  onClick={handleLoadMore}
  loading={isLoading}
/>

// Avec texte personnalisé
<LoadMoreButton
  onClick={handleLoadMore}
  loading={isLoading}
  text="Afficher plus d'annonces"
  loadingText="Chargement des annonces..."
/>

// Variante outline
<LoadMoreButton
  onClick={handleLoadMore}
  variant="outline"
/>
```

---

## 2. SkeletonLoaders

Collection de loaders animés pour différents types de contenu.

### Import
```jsx
import {
  Skeleton,
  AnnonceCardSkeleton,
  ProfileSkeleton,
  AnnonceListSkeleton,
  MessageSkeleton,
  TableRowSkeleton,
  AnnonceDetailSkeleton,
  CategoryCardSkeleton,
  TextSkeleton
} from '@/components/ui/SkeletonLoaders';
```

### Composants disponibles

#### Skeleton (générique)
```jsx
<Skeleton width="100%" height="20px" />
<Skeleton width="200px" height="40px" className="rounded-full" />
```

#### AnnonceCardSkeleton
```jsx
{loading ? (
  <div className="grid grid-cols-4 gap-4">
    <AnnonceCardSkeleton />
    <AnnonceCardSkeleton />
    <AnnonceCardSkeleton />
    <AnnonceCardSkeleton />
  </div>
) : (
  // Annonces réelles
)}
```

#### AnnonceListSkeleton
```jsx
{loading ? (
  <AnnonceListSkeleton count={8} />
) : (
  // Liste d'annonces
)}
```

#### ProfileSkeleton
```jsx
{loadingProfile ? <ProfileSkeleton /> : <UserProfile data={profile} />}
```

#### TextSkeleton
```jsx
{loadingDescription ? (
  <TextSkeleton lines={5} />
) : (
  <p>{description}</p>
)}
```

#### MessageSkeleton
```jsx
{loadingMessages ? (
  <>
    <MessageSkeleton />
    <MessageSkeleton />
    <MessageSkeleton />
  </>
) : (
  messages.map(msg => <Message key={msg.id} {...msg} />)
)}
```

---

## 3. EmptyState

Composant pour afficher des états vides avec icône, texte et actions.

### Import
```jsx
import EmptyState, {
  NoSearchResults,
  NoAnnonces,
  NoFavorites,
  NoMessages,
  ErrorState,
  NotFound
} from '@/components/ui/EmptyState';
```

### Props (EmptyState)
| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `icon` | Component | `Inbox` | Composant d'icône Lucide |
| `title` | string | `"Aucun résultat"` | Titre |
| `description` | string | `"..."` | Description |
| `actionLabel` | string | `null` | Texte du bouton principal |
| `onAction` | function | `null` | Action du bouton principal |
| `actionVariant` | string | `"primary"` | Variante du bouton |
| `secondaryActionLabel` | string | `null` | Texte du bouton secondaire |
| `onSecondaryAction` | function | `null` | Action du bouton secondaire |
| `size` | string | `"md"` | Taille (`sm`, `md`, `lg`) |

### Exemples

#### EmptyState personnalisé
```jsx
<EmptyState
  icon={ShoppingBag}
  title="Aucune annonce trouvée"
  description="Essayez de modifier vos critères de recherche."
  actionLabel="Réinitialiser"
  onAction={handleReset}
  secondaryActionLabel="Retour"
  onSecondaryAction={goBack}
  size="lg"
/>
```

#### Variantes pré-configurées
```jsx
// Aucun résultat de recherche
{annonces.length === 0 && (
  <NoSearchResults onReset={handleResetFilters} />
)}

// Aucune annonce
{annonces.length === 0 && (
  <NoAnnonces onPublish={() => navigate('/publier')} />
)}

// Aucun favori
{favorites.length === 0 && (
  <NoFavorites onBrowse={() => navigate('/categories')} />
)}

// Aucun message
{messages.length === 0 && <NoMessages />}

// État d'erreur
{error && (
  <ErrorState
    onRetry={fetchData}
    errorMessage={error.message}
  />
)}

// Page non trouvée
<NotFound onGoHome={() => navigate('/')} />
```

---

## 4. ErrorMessage

Messages d'erreur/alerte inline avec icône et actions.

### Import
```jsx
import ErrorMessage, {
  NetworkError,
  ValidationError,
  PermissionError,
  SuccessMessage,
  InfoMessage
} from '@/components/ui/ErrorMessage';
```

### Props (ErrorMessage)
| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `type` | string | `"error"` | Type (`error`, `warning`, `info`, `danger`) |
| `title` | string | `null` | Titre |
| `message` | string | *requis* | Message |
| `onRetry` | function | `null` | Action "Réessayer" |
| `onDismiss` | function | `null` | Action "Fermer" |
| `icon` | Component | `null` | Icône personnalisée |
| `className` | string | `""` | Classes CSS additionnelles |

### Exemples

#### ErrorMessage personnalisé
```jsx
{error && (
  <ErrorMessage
    type="error"
    title="Erreur de chargement"
    message={error.message}
    onRetry={retryFetch}
    onDismiss={() => setError(null)}
  />
)}
```

#### Variantes pré-configurées
```jsx
// Erreur réseau
{networkError && <NetworkError onRetry={retryConnection} />}

// Erreur de validation
{validationError && (
  <ValidationError message="Le titre doit contenir au moins 10 caractères" />
)}

// Erreur de permission
{!canEdit && <PermissionError />}

// Message de succès
{success && (
  <SuccessMessage
    message="Annonce publiée avec succès !"
    onDismiss={() => setSuccess(false)}
  />
)}

// Message d'information
<InfoMessage
  title="Nouveau"
  message="Profitez de 30 jours d'essai gratuit Premium !"
/>
```

#### Différents types
```jsx
// Avertissement
<ErrorMessage
  type="warning"
  message="Votre session expire dans 5 minutes"
/>

// Information
<ErrorMessage
  type="info"
  title="Astuce"
  message="Ajoutez des photos de qualité pour attirer plus d'acheteurs"
/>

// Danger
<ErrorMessage
  type="danger"
  message="Cette action est irréversible"
/>
```

---

## Utilisation combinée

### Exemple : Page avec tous les états

```jsx
import React, { useState, useEffect } from 'react';
import { AnnonceListSkeleton } from '@/components/ui/SkeletonLoaders';
import { NoSearchResults } from '@/components/ui/EmptyState';
import { NetworkError } from '@/components/ui/ErrorMessage';
import LoadMoreButton from '@/components/ui/LoadMoreButton';

function AnnoncesPage() {
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchAnnonces = async () => {
    try {
      setLoading(true);
      const data = await api.getAnnonces();
      setAnnonces(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      const moreData = await api.getAnnonces({ page: page + 1 });
      setAnnonces([...annonces, ...moreData]);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchAnnonces();
  }, []);

  // État de chargement initial
  if (loading) {
    return <AnnonceListSkeleton count={8} />;
  }

  // État d'erreur
  if (error) {
    return <NetworkError onRetry={fetchAnnonces} />;
  }

  // État vide
  if (annonces.length === 0) {
    return <NoSearchResults onReset={handleReset} />;
  }

  // Contenu avec pagination
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {annonces.map(annonce => (
          <AnnonceCard key={annonce.id} {...annonce} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <LoadMoreButton
            onClick={handleLoadMore}
            loading={loadingMore}
          />
        </div>
      )}
    </>
  );
}
```

---

## Bonnes pratiques

### ✅ À faire

1. **Utiliser les composants appropriés**
   ```jsx
   // ✅ Bon
   {loading ? <AnnonceListSkeleton /> : <AnnoncesList />}
   
   // ❌ Mauvais
   {loading && <div>Chargement...</div>}
   ```

2. **Réutiliser les variantes pré-configurées**
   ```jsx
   // ✅ Bon
   <NoSearchResults onReset={reset} />
   
   // ❌ Mauvais
   <EmptyState icon={Search} title="Aucun..." ... />
   ```

3. **Maintenir la cohérence**
   - Utiliser toujours `LoadMoreButton` pour la pagination
   - Utiliser `EmptyState` pour tous les états vides
   - Utiliser `ErrorMessage` pour les erreurs inline

### ❌ À éviter

1. **Dupliquer les composants**
   ```jsx
   // ❌ Ne pas recréer des skeletons à chaque fois
   <div className="animate-pulse">...</div>
   ```

2. **Mélanger les styles**
   ```jsx
   // ❌ Ne pas utiliser des styles différents
   <button>Voir plus</button> // sur une page
   <LoadMoreButton /> // sur une autre page
   ```

3. **Ignorer les états**
   ```jsx
   // ❌ Toujours gérer loading, error, empty
   return <div>{annonces.map(...)}</div>
   ```

---

## Checklist d'intégration

- [ ] Remplacer tous les "Loading..." par les Skeletons appropriés
- [ ] Utiliser `EmptyState` pour tous les états vides
- [ ] Utiliser `ErrorMessage` pour toutes les erreurs inline
- [ ] Utiliser `LoadMoreButton` pour toute la pagination
- [ ] Vérifier la cohérence visuelle
- [ ] Tester tous les états (loading, error, empty, success)

---

## Avantages

1. **Cohérence** : Design uniforme dans toute l'application
2. **Maintenabilité** : Modifier un composant = modifier partout
3. **DRY** : Pas de duplication de code
4. **Accessibilité** : ARIA labels intégrés
5. **Performance** : Composants optimisés
6. **Documentation** : Props bien documentées
