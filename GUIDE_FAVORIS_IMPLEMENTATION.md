# Guide d'Implémentation du Bouton Favoris

## 📝 Objectif

Permettre aux utilisateurs d'ajouter/retirer des annonces de leurs favoris directement depuis :
- La page d'accueil (HomePage)
- La page de détail d'une annonce (AnnonceDetailPage)
- Les pages de catégories

## 🔧 Composant Réutilisable

### 1. Créer un composant FavoriteButton

Créez le fichier : `src/components/FavoriteButton.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ annonceId, className = "", size = 20 }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('annonce_id', annonceId)
        .maybeSingle();

      if (!error && data) {
        setIsFavorite(true);
      }
    };

    checkFavorite();
  }, [user, annonceId]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // Empêche la navigation si dans un Link
    e.stopPropagation(); // Empêche la propagation du clic

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour ajouter des favoris.',
      });
      navigate('/connexion');
      return;
    }

    setLoading(true);

    if (isFavorite) {
      // Retirer des favoris
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('annonce_id', annonceId);

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de retirer des favoris.',
        });
      } else {
        setIsFavorite(false);
        toast({
          title: 'Retiré des favoris',
          description: 'L\'annonce a été retirée de vos favoris.',
        });
      }
    } else {
      // Ajouter aux favoris
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          annonce_id: annonceId,
        });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible d\'ajouter aux favoris.',
        });
      } else {
        setIsFavorite(true);
        toast({
          title: 'Ajouté aux favoris',
          description: 'L\'annonce a été ajoutée à vos favoris.',
        });
      }
    }

    setLoading(false);
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`transition-all duration-200 disabled:opacity-50 ${className}`}
      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart
        size={size}
        className={`transition-all ${
          isFavorite
            ? 'text-red-500 fill-red-500'
            : 'text-white hover:text-red-500'
        }`}
      />
    </button>
  );
};

export default FavoriteButton;
```

## 🏠 Utilisation dans HomePage

### Modifier `src/pages/HomePage.jsx`

Ligne ~211, remplacer le bouton statique par :

```jsx
import FavoriteButton from '@/components/FavoriteButton';

// Dans le rendu des annonces, ligne ~211
<FavoriteButton 
  annonceId={annonce.id} 
  className="absolute top-3 right-3 bg-black bg-opacity-40 p-2 rounded-full hover:bg-white"
  size={20}
/>
```

**Avant :**
```jsx
<button className="absolute top-3 right-3 text-white bg-black bg-opacity-40 p-2 rounded-full hover:text-red-500 hover:bg-white transition">
  <Heart size={20} />
</button>
```

**Après :**
```jsx
<FavoriteButton 
  annonceId={annonce.id} 
  className="absolute top-3 right-3 bg-black bg-opacity-40 p-2 rounded-full hover:bg-white"
  size={20}
/>
```

## 📄 Utilisation dans AnnonceDetailPage

### Modifier `src/pages/AnnonceDetailPage.jsx`

Ligne ~144, remplacer par :

```jsx
import FavoriteButton from '@/components/FavoriteButton';

// Dans les boutons d'action, ligne ~144
<FavoriteButton 
  annonceId={annonce.id}
  className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
  size={20}
/>
```

**Avant :**
```jsx
<button onClick={handleAction} className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
  <Heart size={20} />
  <span>Favoris</span>
</button>
```

**Après :**
```jsx
<div className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
  <FavoriteButton 
    annonceId={annonce.id}
    size={20}
  />
  <span>Favoris</span>
</div>
```

## 🎨 Variantes de Style

### Variante 1 : Bouton avec texte
```jsx
<div className="flex items-center space-x-2">
  <FavoriteButton annonceId={annonce.id} size={20} />
  <span>{isFavorite ? 'Retirer' : 'Ajouter'}</span>
</div>
```

### Variante 2 : Badge de compteur
```jsx
<div className="relative">
  <FavoriteButton annonceId={annonce.id} size={24} />
  {favoriteCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
      {favoriteCount}
    </span>
  )}
</div>
```

### Variante 3 : Style outline
```jsx
<FavoriteButton 
  annonceId={annonce.id}
  className="border-2 border-gray-300 rounded-full p-3 hover:border-red-500"
  size={24}
/>
```

## 🔍 Afficher le Nombre de Favoris (Optionnel)

### Ajouter un compteur de favoris sur une annonce

```jsx
const [favoriteCount, setFavoriteCount] = useState(0);

useEffect(() => {
  const fetchFavoriteCount = async () => {
    const { count } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('annonce_id', annonceId);
    
    setFavoriteCount(count || 0);
  };
  
  fetchFavoriteCount();
}, [annonceId]);
```

## 🧪 Tests

### Tester le composant

1. **Non connecté** : Vérifier que cliquer redirige vers /connexion
2. **Connecté** : 
   - Ajouter aux favoris → Cœur se remplit en rouge
   - Retirer des favoris → Cœur redevient vide
   - Vérifier dans `/profil/favoris` que l'annonce apparaît/disparaît
3. **État persistant** : Rafraîchir la page, le cœur doit rester rouge si favori

## 📱 Responsive

Le composant est déjà responsive. Ajustez la taille selon le contexte :

```jsx
// Mobile
<FavoriteButton size={16} />

// Tablette
<FavoriteButton size={20} />

// Desktop
<FavoriteButton size={24} />
```

## 🚀 Amélioration Future : Compteur en Temps Réel

Pour afficher le nombre de personnes qui ont mis en favori :

```jsx
// Dans la table annonces, ajouter une colonne
ALTER TABLE annonces ADD COLUMN favorite_count INTEGER DEFAULT 0;

// Créer un trigger pour mettre à jour automatiquement
CREATE OR REPLACE FUNCTION update_favorite_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE annonces SET favorite_count = favorite_count + 1 WHERE id = NEW.annonce_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE annonces SET favorite_count = favorite_count - 1 WHERE id = OLD.annonce_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER favorite_count_trigger
AFTER INSERT OR DELETE ON favorites
FOR EACH ROW EXECUTE FUNCTION update_favorite_count();
```

## ✅ Checklist d'Implémentation

- [ ] Créer `src/components/FavoriteButton.jsx`
- [ ] Importer dans `HomePage.jsx`
- [ ] Remplacer le bouton statique dans HomePage
- [ ] Importer dans `AnnonceDetailPage.jsx`
- [ ] Remplacer le bouton statique dans AnnonceDetailPage
- [ ] Tester l'ajout/retrait de favoris
- [ ] Vérifier la synchronisation avec la page "Mes Favoris"
- [ ] Tester sur mobile/tablette/desktop

## 💡 Bonus : Animation au Clic

Ajoutez une animation au composant :

```jsx
import { motion } from 'framer-motion';

<motion.button
  whileTap={{ scale: 0.8 }}
  onClick={toggleFavorite}
  className={className}
>
  <Heart ... />
</motion.button>
```

---

**🎉 Avec ce composant, vos utilisateurs pourront facilement gérer leurs favoris partout dans l'application !**
