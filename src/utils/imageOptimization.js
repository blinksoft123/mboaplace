import logger from './logger';

/**
 * Utilitaires pour l'optimisation et la compression d'images
 */

/**
 * Compresse une image en maintenant le ratio d'aspect
 * @param {File} file - Fichier image à compresser
 * @param {Object} options - Options de compression
 * @returns {Promise<Blob>} Image compressée
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    outputFormat = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculer les nouvelles dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Créer canvas et dessiner l'image redimensionnée
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir en blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              logger.log(`Image compressed: ${(file.size / 1024).toFixed(2)}KB -> ${(blob.size / 1024).toFixed(2)}KB`);
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          outputFormat,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Vérifie si le navigateur supporte WebP
 * @returns {Promise<boolean>}
 */
export const supportsWebP = async () => {
  if (typeof window === 'undefined') return false;

  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Convertit une URL d'image pour utiliser WebP si supporté
 * @param {string} url - URL de l'image
 * @param {boolean} fallback - Retourner l'URL originale si WebP non supporté
 * @returns {Promise<string>}
 */
export const getOptimalImageUrl = async (url, fallback = true) => {
  if (!url) return url;

  const isWebPSupported = await supportsWebP();
  
  if (!isWebPSupported && fallback) {
    return url;
  }

  // Si c'est une URL Supabase Storage, ajouter le transform pour WebP
  if (url.includes('supabase.co/storage')) {
    // Supabase peut transformer les images à la volée
    // Format: .../storage/v1/object/public/bucket/path?width=X&quality=Y
    const urlObj = new URL(url);
    urlObj.searchParams.set('format', 'webp');
    return urlObj.toString();
  }

  return url;
};

/**
 * Génère un placeholder en base64 pour une image
 * @param {number} width - Largeur du placeholder
 * @param {number} height - Hauteur du placeholder
 * @param {string} color - Couleur de fond (hex)
 * @returns {string} Data URL du placeholder
 */
export const generatePlaceholder = (width = 10, height = 10, color = '#e5e7eb') => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL();
};

/**
 * Valide qu'un fichier est une image valide
 * @param {File} file - Fichier à valider
 * @param {Object} constraints - Contraintes de validation
 * @returns {Object} { valid: boolean, error: string }
 */
export const validateImage = (file, constraints = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB par défaut
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    minWidth = 100,
    minHeight = 100,
    maxWidth = 4000,
    maxHeight = 4000
  } = constraints;

  // Vérifier le type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Type de fichier non supporté. Types autorisés: ${allowedTypes.join(', ')}`
    };
  }

  // Vérifier la taille
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Fichier trop volumineux. Taille max: ${(maxSize / 1024 / 1024).toFixed(1)}MB`
    };
  }

  // Validation des dimensions (nécessite async)
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      if (img.width < minWidth || img.height < minHeight) {
        resolve({
          valid: false,
          error: `Image trop petite. Dimensions minimales: ${minWidth}x${minHeight}px`
        });
        return;
      }

      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({
          valid: false,
          error: `Image trop grande. Dimensions maximales: ${maxWidth}x${maxHeight}px`
        });
        return;
      }

      resolve({ valid: true, error: null });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        valid: false,
        error: 'Impossible de lire le fichier image'
      });
    };

    img.src = url;
  });
};

/**
 * Batch compression de plusieurs images
 * @param {File[]} files - Array de fichiers images
 * @param {Object} options - Options de compression
 * @returns {Promise<Blob[]>}
 */
export const compressImages = async (files, options = {}) => {
  const promises = files.map(file => compressImage(file, options));
  return Promise.all(promises);
};

/**
 * Crée une miniature d'une image
 * @param {File} file - Fichier image
 * @param {Object} options - Options de la miniature
 * @returns {Promise<Blob>}
 */
export const createThumbnail = async (file, options = {}) => {
  const {
    width = 200,
    height = 200,
    quality = 0.7,
    outputFormat = 'image/jpeg'
  } = options;

  return compressImage(file, {
    maxWidth: width,
    maxHeight: height,
    quality,
    outputFormat
  });
};

/**
 * Extrait les métadonnées EXIF d'une image
 * @param {File} file - Fichier image
 * @returns {Promise<Object>}
 */
export const extractImageMetadata = async (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height,
        size: file.size,
        type: file.type,
        name: file.name
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    img.src = url;
  });
};

export default {
  compressImage,
  compressImages,
  supportsWebP,
  getOptimalImageUrl,
  generatePlaceholder,
  validateImage,
  createThumbnail,
  extractImageMetadata
};
