# Guide d'optimisation des images

## Vue d'ensemble

Ce guide explique comment utiliser les outils d'optimisation d'images pour améliorer les performances de l'application.

## Composant OptimizedImage

### Utilisation basique

```jsx
import OptimizedImage from '@/components/OptimizedImage';

function MyComponent() {
  return (
    <OptimizedImage
      src="https://example.com/image.jpg"
      alt="Description de l'image"
      className="w-full h-64"
    />
  );
}
```

### Props disponibles

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `src` | string | *requis* | URL de l'image |
| `alt` | string | `''` | Texte alternatif |
| `className` | string | `''` | Classes CSS |
| `fallbackSrc` | string | `null` | Image de secours en cas d'erreur |
| `placeholder` | string | `null` | Image placeholder pendant le chargement |
| `lazy` | boolean | `true` | Active le lazy loading |
| `aspectRatio` | number | `null` | Ratio d'aspect (ex: 16/9) |
| `objectFit` | string | `'cover'` | Comportement d'ajustement |
| `onLoad` | function | `null` | Callback après chargement |
| `onError` | function | `null` | Callback en cas d'erreur |

### Exemples

#### 1. Image avec ratio d'aspect fixe

```jsx
<OptimizedImage
  src="/annonce.jpg"
  alt="Annonce"
  aspectRatio={16 / 9}
  className="rounded-lg"
/>
```

#### 2. Image avec fallback

```jsx
<OptimizedImage
  src="/user-avatar.jpg"
  alt="Avatar utilisateur"
  fallbackSrc="/default-avatar.png"
  className="w-20 h-20 rounded-full"
/>
```

#### 3. Image sans lazy loading (above the fold)

```jsx
<OptimizedImage
  src="/hero-banner.jpg"
  alt="Bannière principale"
  lazy={false}
  className="w-full"
/>
```

#### 4. Image avec callbacks

```jsx
<OptimizedImage
  src="/image.jpg"
  alt="Image"
  onLoad={() => console.log('Image chargée')}
  onError={(e) => console.error('Erreur chargement', e)}
/>
```

## Utilitaires d'optimisation

### 1. Compression d'images

```jsx
import { compressImage } from '@/utils/imageOptimization';

const handleUpload = async (file) => {
  try {
    // Compresser l'image avant upload
    const compressedBlob = await compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.8
    });
    
    // Convertir blob en File
    const compressedFile = new File([compressedBlob], file.name, {
      type: 'image/jpeg'
    });
    
    // Upload vers Supabase
    await uploadToStorage(compressedFile);
  } catch (error) {
    console.error('Erreur compression:', error);
  }
};
```

### 2. Validation d'images

```jsx
import { validateImage } from '@/utils/imageOptimization';

const handleFileSelect = async (file) => {
  const validation = await validateImage(file, {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png'],
    minWidth: 300,
    minHeight: 300
  });
  
  if (!validation.valid) {
    alert(validation.error);
    return;
  }
  
  // Continuer avec le fichier validé
};
```

### 3. Créer des miniatures

```jsx
import { createThumbnail } from '@/utils/imageOptimization';

const generateThumbnails = async (file) => {
  try {
    const thumb = await createThumbnail(file, {
      width: 200,
      height: 200,
      quality: 0.7
    });
    
    // Upload de la miniature
    await uploadThumbnail(thumb);
  } catch (error) {
    console.error('Erreur miniature:', error);
  }
};
```

### 4. Support WebP

```jsx
import { supportsWebP, getOptimalImageUrl } from '@/utils/imageOptimization';

// Vérifier le support WebP
const checkWebP = async () => {
  const hasWebP = await supportsWebP();
  console.log('WebP supporté:', hasWebP);
};

// Obtenir URL optimale
const imageUrl = await getOptimalImageUrl(
  'https://example.com/image.jpg'
);
```

### 5. Batch compression

```jsx
import { compressImages } from '@/utils/imageOptimization';

const handleMultipleUploads = async (files) => {
  try {
    // Compresser toutes les images en parallèle
    const compressedBlobs = await compressImages(files, {
      maxWidth: 1920,
      quality: 0.8
    });
    
    // Upload des fichiers compressés
    await uploadMultiple(compressedBlobs);
  } catch (error) {
    console.error('Erreur batch compression:', error);
  }
};
```

### 6. Extraction de métadonnées

```jsx
import { extractImageMetadata } from '@/utils/imageOptimization';

const analyzeImage = async (file) => {
  const metadata = await extractImageMetadata(file);
  
  console.log('Largeur:', metadata.width);
  console.log('Hauteur:', metadata.height);
  console.log('Ratio:', metadata.aspectRatio);
  console.log('Taille:', metadata.size);
};
```

## Intégration dans PublishPage

Exemple d'intégration complète dans le formulaire de publication :

```jsx
import { useState } from 'react';
import { compressImage, validateImage } from '@/utils/imageOptimization';

function PublishPage() {
  const [images, setImages] = useState([]);
  
  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      // 1. Valider
      const validation = await validateImage(file);
      if (!validation.valid) {
        alert(validation.error);
        continue;
      }
      
      // 2. Compresser
      const compressed = await compressImage(file, {
        maxWidth: 1920,
        quality: 0.85
      });
      
      // 3. Créer preview
      const preview = URL.createObjectURL(compressed);
      
      setImages(prev => [...prev, {
        file: compressed,
        preview,
        name: file.name
      }]);
    }
  };
  
  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageSelect}
      />
      
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, i) => (
          <OptimizedImage
            key={i}
            src={img.preview}
            alt={img.name}
            aspectRatio={1}
            className="rounded-lg"
          />
        ))}
      </div>
    </div>
  );
}
```

## Bonnes pratiques

### ✅ À faire

1. **Toujours compresser avant upload**
   ```jsx
   const compressed = await compressImage(file);
   await upload(compressed);
   ```

2. **Utiliser OptimizedImage partout**
   ```jsx
   <OptimizedImage src={url} alt="..." />
   ```

3. **Lazy load sauf above-the-fold**
   ```jsx
   <OptimizedImage src={hero} lazy={false} />
   <OptimizedImage src={image1} lazy={true} />
   ```

4. **Définir des ratios d'aspect**
   ```jsx
   <OptimizedImage src={url} aspectRatio={16/9} />
   ```

5. **Valider avant traitement**
   ```jsx
   const valid = await validateImage(file);
   if (!valid.valid) return;
   ```

### ❌ À éviter

1. **Upload d'images non compressées**
   ```jsx
   // ❌ Mauvais
   await upload(originalFile);
   
   // ✅ Bon
   const compressed = await compressImage(originalFile);
   await upload(compressed);
   ```

2. **Balises `<img>` classiques**
   ```jsx
   // ❌ Mauvais
   <img src={url} alt="..." />
   
   // ✅ Bon
   <OptimizedImage src={url} alt="..." />
   ```

3. **Pas de gestion d'erreur**
   ```jsx
   // ❌ Mauvais
   <img src={brokenUrl} />
   
   // ✅ Bon
   <OptimizedImage
     src={url}
     fallbackSrc="/placeholder.jpg"
     onError={handleError}
   />
   ```

## Performance attendue

### Avant optimisation
- Image originale : 3.5 MB
- Temps de chargement : 2-4s
- LCP (Largest Contentful Paint) : 3.2s

### Après optimisation
- Image compressée : 250 KB (93% de réduction)
- Temps de chargement : 0.3-0.6s
- LCP : 1.1s
- Lazy loading : Images hors écran non chargées

## Configuration recommandée

### Pour annonces
```jsx
{
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.85,
  outputFormat: 'image/jpeg'
}
```

### Pour avatars
```jsx
{
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.8,
  outputFormat: 'image/jpeg'
}
```

### Pour miniatures
```jsx
{
  width: 200,
  height: 200,
  quality: 0.7,
  outputFormat: 'image/jpeg'
}
```

## Checklist d'intégration

- [ ] Remplacer tous les `<img>` par `<OptimizedImage>`
- [ ] Ajouter compression dans PublishPage
- [ ] Ajouter validation d'images
- [ ] Configurer lazy loading approprié
- [ ] Définir ratios d'aspect pour éviter CLS
- [ ] Ajouter images de fallback
- [ ] Tester avec connexion lente (DevTools)
- [ ] Vérifier WebP support
- [ ] Optimiser images existantes en base

## Outils de test

### Chrome DevTools
```
1. Ouvrir DevTools (F12)
2. Network tab
3. Throttling : "Slow 3G"
4. Filtrer : "Img"
5. Observer les temps de chargement
```

### Lighthouse
```
1. DevTools > Lighthouse
2. Run analysis
3. Vérifier "Properly size images"
4. Vérifier "Efficiently encode images"
5. Vérifier "Defer offscreen images"
```

## Support navigateurs

- ✅ Chrome 76+
- ✅ Firefox 65+
- ✅ Safari 13+
- ✅ Edge 79+
- ✅ Opera 64+

Le lazy loading natif (`loading="lazy"`) est supporté par 95%+ des navigateurs modernes.
