# Exemples d'utilisation du système de cache

## 1. Utilisation basique avec useCachedSupabaseQuery

```jsx
import { useEffect } from 'react';
import { useCachedSupabaseQuery } from '@/hooks/useCachedSupabaseQuery';
import { supabase } from '@/lib/customSupabaseClient';

function CategoriesPage() {
  const { data, loading, error, execute } = useCachedSupabaseQuery(
    async () => {
      return await supabase
        .from('annonces')
        .select('category', { count: 'exact' })
        .eq('status', 'active');
    },
    {
      cacheKey: 'categories-count',
      cacheTTL: 10 * 60 * 1000, // 10 minutes
      errorMessage: 'Impossible de charger les catégories'
    }
  );

  useEffect(() => {
    execute();
  }, []);

  // Le composant n'effectuera la requête qu'une fois
  // Les visites suivantes utiliseront le cache pendant 10 minutes
}
```

## 2. Invalider le cache après une mutation

```jsx
import { useCachedSupabaseQuery } from '@/hooks/useCachedSupabaseQuery';
import cacheManager from '@/utils/cache';

function PublishPage() {
  // Utiliser le cache pour afficher les annonces existantes
  const { data, execute, invalidateCache } = useCachedSupabaseQuery(
    async () => supabase.from('annonces').select('*'),
    { cacheKey: 'user-annonces' }
  );

  const handlePublish = async (newAnnonce) => {
    // Créer la nouvelle annonce
    await supabase.from('annonces').insert([newAnnonce]);
    
    // Invalider le cache pour forcer un refresh
    invalidateCache();
    
    // Ou invalider tous les caches liés aux annonces
    cacheManager.invalidateByPrefix('annonces');
    
    // Re-fetch les données
    execute();
  };
}
```

## 3. Cache manuel avec cacheManager

```jsx
import cacheManager from '@/utils/cache';

// Générer une clé de cache avec paramètres
const cacheKey = cacheManager.generateKey('annonces', {
  category: 'emploi',
  city: 'Montreal'
});

// Vérifier le cache
const cached = cacheManager.get(cacheKey);
if (cached) {
  console.log('Données en cache:', cached);
} else {
  // Faire la requête
  const { data } = await supabase.from('annonces').select('*');
  
  // Mettre en cache pour 15 minutes
  cacheManager.set(cacheKey, data, 15 * 60 * 1000);
}
```

## 4. Stratégies de cache

### Cache avec refetch au montage
```jsx
useCachedSupabaseQuery(queryFn, {
  cacheKey: 'data',
  refetchOnMount: true // Toujours faire une requête au montage
});
```

### Cache désactivé conditionnellement
```jsx
const isRealTime = true;

useCachedSupabaseQuery(queryFn, {
  cacheKey: 'data',
  cacheEnabled: !isRealTime // Désactiver si temps réel requis
});
```

### Cache de courte durée
```jsx
useCachedSupabaseQuery(queryFn, {
  cacheKey: 'realtime-data',
  cacheTTL: 30 * 1000 // 30 secondes seulement
});
```

## 5. Gestion avancée du cache

```jsx
import cacheManager from '@/utils/cache';

// Statistiques du cache
const stats = cacheManager.getStats();
console.log(`Cache size: ${stats.size} entries`);

// Nettoyer les entrées expirées manuellement
cacheManager.cleanup();

// Vider tout le cache
cacheManager.clear();

// Invalider tous les caches d'une catégorie
cacheManager.invalidateByPrefix('annonces:');
```

## 6. Bonnes pratiques

### ✅ À faire
- Utiliser des clés de cache descriptives et préfixées
- Invalider le cache après les mutations (CREATE, UPDATE, DELETE)
- Ajuster le TTL en fonction de la fraîcheur des données requise
- Utiliser `cacheEnabled: false` pour les données sensibles/temps réel

### ❌ À éviter
- Ne pas mettre en cache des données utilisateur sensibles
- Ne pas utiliser un TTL trop long pour des données fréquemment modifiées
- Ne pas oublier d'invalider le cache après une mutation
- Ne pas utiliser le même cacheKey pour des requêtes différentes

## 7. Cache avec pagination

```jsx
function HomePage() {
  const [page, setPage] = useState(0);
  
  const { data, execute } = useCachedSupabaseQuery(
    async (pageNum) => {
      const from = pageNum * 20;
      const to = from + 19;
      return await supabase
        .from('annonces')
        .select('*')
        .range(from, to);
    },
    {
      cacheKey: `annonces-page-${page}`,
      cacheTTL: 2 * 60 * 1000 // 2 minutes
    }
  );

  useEffect(() => {
    execute(page);
  }, [page]);
}
```

## Avantages du système de cache

1. **Performance** : Réduit les appels réseau répétés
2. **UX améliorée** : Affichage instantané des données en cache
3. **Coûts réduits** : Moins de requêtes = moins de coûts Supabase
4. **Flexibilité** : TTL configurable, invalidation ciblée
5. **Simplicité** : API simple et intuitive
