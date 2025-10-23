# Guide d'utilisation ErrorBoundary

## Vue d'ensemble

`ErrorBoundary` est un composant React Class qui capture les erreurs JavaScript dans son arbre de composants enfants, log ces erreurs, et affiche une UI de secours au lieu de crasher toute l'application.

## Fonctionnalités

✅ **Capture automatique des erreurs** React non gérées  
✅ **UI de secours conviviale** pour les utilisateurs  
✅ **Détails d'erreur en développement** pour faciliter le debugging  
✅ **Logging via logger utilitaire** (désactivé en production)  
✅ **Compteur d'erreurs** avec aide progressive  
✅ **Boutons de récupération** (Réessayer, Accueil, Recharger)  
✅ **Support pour UI personnalisée** via prop `fallback`  
✅ **Callback optionnel** pour monitoring externe (Sentry, etc.)

## Installation

L'ErrorBoundary est déjà installé au niveau de l'application dans `App.jsx` :

```jsx
import ErrorBoundary from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

## Utilisation basique

### 1. Protection au niveau global (déjà fait)

```jsx
// App.jsx
<ErrorBoundary>
  <div className="min-h-screen flex flex-col">
    <Header />
    <main>
      <Routes>{/* ... */}</Routes>
    </main>
    <Footer />
  </div>
</ErrorBoundary>
```

### 2. Protection de composants spécifiques

```jsx
import ErrorBoundary from '@/components/ErrorBoundary';

function MyComponent() {
  return (
    <div>
      <h1>Ma page</h1>
      
      {/* Protéger seulement une partie de la page */}
      <ErrorBoundary>
        <ComplexWidget />
      </ErrorBoundary>
      
      <Footer />
    </div>
  );
}
```

### 3. UI de secours personnalisée

```jsx
<ErrorBoundary
  fallback={({ error, errorInfo, resetError }) => (
    <div className="error-container">
      <h2>Oops! Quelque chose s'est mal passé</h2>
      <p>{error.message}</p>
      <button onClick={resetError}>Réessayer</button>
    </div>
  )}
>
  <MyComponent />
</ErrorBoundary>
```

### 4. Avec callback pour monitoring externe

```jsx
// Exemple avec Sentry
import * as Sentry from '@sentry/react';

<ErrorBoundary
  onError={(error, errorInfo) => {
    // Envoyer à Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    });
  }}
>
  <MyApp />
</ErrorBoundary>
```

## Props

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `children` | ReactNode | ✅ | Les composants à protéger |
| `fallback` | Function | ❌ | Fonction qui retourne une UI de secours personnalisée |
| `onError` | Function | ❌ | Callback appelé quand une erreur est capturée |

### Signature de `fallback`

```typescript
fallback: (props: {
  error: Error;
  errorInfo: ErrorInfo;
  resetError: () => void;
}) => ReactNode
```

### Signature de `onError`

```typescript
onError: (error: Error, errorInfo: ErrorInfo) => void
```

## Exemples avancés

### Boundaries multiples pour granularité

```jsx
function Dashboard() {
  return (
    <div>
      <ErrorBoundary fallback={SidebarError}>
        <Sidebar />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={ContentError}>
        <MainContent />
      </ErrorBoundary>
      
      <ErrorBoundary fallback={WidgetError}>
        <LiveDataWidget />
      </ErrorBoundary>
    </div>
  );
}
```

### Recovery avec useEffect

```jsx
function MyComponent() {
  const [hasError, setHasError] = useState(false);

  return (
    <ErrorBoundary
      fallback={({ resetError }) => {
        // Auto-reset après 5 secondes
        useEffect(() => {
          const timer = setTimeout(() => {
            resetError();
          }, 5000);
          return () => clearTimeout(timer);
        }, []);

        return <div>Erreur détectée. Récupération en cours...</div>;
      }}
    >
      <MyContent />
    </ErrorBoundary>
  );
}
```

### Logging enrichi

```jsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log enrichi
    console.group('🔴 Error Boundary Caught');
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.log('User:', getCurrentUser());
    console.log('Route:', window.location.pathname);
    console.groupEnd();
    
    // Analytics
    analytics.track('error_boundary_triggered', {
      error: error.message,
      stack: error.stack,
      component: errorInfo.componentStack
    });
  }}
>
  <App />
</ErrorBoundary>
```

## Ce que ErrorBoundary capture

✅ Erreurs dans les méthodes de rendu  
✅ Erreurs dans les lifecycle methods  
✅ Erreurs dans les constructeurs  
✅ Erreurs dans les hooks (useEffect, useMemo, etc.)

## Ce que ErrorBoundary NE capture PAS

❌ Erreurs dans les event handlers (onClick, onChange, etc.)  
❌ Erreurs asynchrones (setTimeout, Promise, async/await)  
❌ Erreurs server-side rendering  
❌ Erreurs dans l'ErrorBoundary lui-même  

Pour ces cas, utilisez try/catch classique :

```jsx
// Event handler
const handleClick = async () => {
  try {
    await riskyOperation();
  } catch (error) {
    logger.error('Error in handler:', error);
    // Gérer l'erreur
  }
};

// Async operation
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await api.fetchData();
      setData(data);
    } catch (error) {
      logger.error('Error fetching data:', error);
      setError(error);
    }
  };
  
  fetchData();
}, []);
```

## Bonnes pratiques

### ✅ À faire

1. **Placer au niveau racine** : Toujours avoir un ErrorBoundary au niveau App
2. **Granularité** : Ajouter des boundaries autour de composants critiques
3. **Logging** : Utiliser `onError` pour envoyer à un service de monitoring
4. **UI contextuelle** : Adapter l'UI de secours au contexte (widget vs page complète)
5. **Recovery paths** : Fournir des chemins clairs pour récupérer (boutons, liens)

### ❌ À éviter

1. **Trop de boundaries** : N'enveloppez pas chaque petit composant
2. **Boundaries vides** : Toujours fournir une UI de secours significative
3. **Ignorer les erreurs** : Ne pas juste cacher les erreurs, les logger
4. **Boundaries dans boucles** : Éviter de créer des boundaries dans des `.map()`
5. **Dépendre uniquement de boundaries** : Utiliser try/catch pour async/events

## Mode développement vs Production

### Développement (NODE_ENV !== 'production')
- Affiche les détails complets de l'erreur
- Stack trace visible
- Composant stack affiché

### Production (NODE_ENV === 'production')
- Message générique et convivial
- Pas de stack trace exposée
- Erreurs loggées via logger (qui peut envoyer à Sentry/etc.)

## Intégration avec monitoring

### Exemple avec Sentry

```jsx
import * as Sentry from '@sentry/react';

// Wrapper ErrorBoundary avec Sentry
const SentryErrorBoundary = Sentry.ErrorBoundary;

function App() {
  return (
    <SentryErrorBoundary
      fallback={({ error, resetError }) => (
        <CustomErrorUI error={error} onReset={resetError} />
      )}
      showDialog
    >
      <YourApp />
    </SentryErrorBoundary>
  );
}
```

### Exemple avec service custom

```jsx
import { reportError } from '@/services/errorReporting';

<ErrorBoundary
  onError={(error, errorInfo) => {
    reportError({
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }}
>
  <App />
</ErrorBoundary>
```

## Test de l'ErrorBoundary

```jsx
// Composant de test (à utiliser seulement en dev)
function ThrowError() {
  const [shouldThrow, setShouldThrow] = useState(false);
  
  if (shouldThrow) {
    throw new Error('Test error from ThrowError component');
  }
  
  return (
    <button onClick={() => setShouldThrow(true)}>
      Déclencher une erreur
    </button>
  );
}

// Utilisation
function TestPage() {
  return (
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
}
```

## Résumé

L'ErrorBoundary est votre filet de sécurité pour les erreurs React imprévues. Il améliore l'expérience utilisateur en évitant les écrans blancs et fournit des informations précieuses pour le debugging et le monitoring.

Pour toute question ou amélioration, consultez la documentation React officielle sur les Error Boundaries.
