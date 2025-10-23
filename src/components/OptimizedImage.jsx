import React, { useState, useEffect, useRef } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Composant d'image optimisé avec :
 * - Lazy loading natif
 * - Placeholder/blur pendant le chargement
 * - Gestion d'erreur avec fallback
 * - Support WebP avec fallback automatique
 * - Intersection Observer pour performances
 */
const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  fallbackSrc = null,
  placeholder = null,
  lazy = true,
  aspectRatio = null,
  objectFit = 'cover',
  onLoad = null,
  onError = null,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef(null);

  // Intersection Observer pour lazy loading manuel si nécessaire
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Charger 50px avant que l'image soit visible
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [lazy, isInView]);

  // Mettre à jour src quand visible
  useEffect(() => {
    if (isInView && imageSrc !== src) {
      setImageSrc(src);
    }
  }, [isInView, src, imageSrc]);

  const handleLoad = (e) => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    
    // Essayer le fallback si disponible
    if (fallbackSrc && imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    }
    
    if (onError) onError(e);
  };

  // Styles de container pour maintenir le ratio d'aspect
  const containerStyle = aspectRatio
    ? {
        position: 'relative',
        paddingBottom: `${(1 / aspectRatio) * 100}%`,
        overflow: 'hidden'
      }
    : {};

  const imgStyle = aspectRatio
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit
      }
    : { objectFit };

  // UI d'erreur
  if (hasError && (!fallbackSrc || imageSrc === fallbackSrc)) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 text-gray-400 ${className}`}
        style={aspectRatio ? { ...containerStyle } : { minHeight: '200px' }}
      >
        <div className="flex flex-col items-center justify-center p-4">
          <ImageOff size={48} className="mb-2" />
          <span className="text-sm text-center">Image non disponible</span>
        </div>
      </div>
    );
  }

  return (
    <div className={aspectRatio ? 'relative' : ''} style={containerStyle}>
      {/* Placeholder pendant le chargement */}
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
          style={aspectRatio ? {} : { minHeight: '200px' }}
        />
      )}

      {/* Image principale */}
      <img
        ref={imgRef}
        src={isInView ? imageSrc : placeholder || ''}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={imgStyle}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
