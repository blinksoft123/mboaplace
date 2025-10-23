import { useState, useCallback, useEffect } from 'react';
import logger from '@/utils/logger';
import cacheManager from '@/utils/cache';
import { ERROR_MESSAGES } from '@/utils/constants';

/**
 * Hook avec cache intégré pour les requêtes Supabase
 * Extension de useSupabaseQuery avec support de cache automatique
 * 
 * @param {Function} queryFn - Fonction async qui exécute la requête Supabase
 * @param {Object} options - Options de configuration
 * @param {string} options.cacheKey - Clé de cache (obligatoire pour activer le cache)
 * @param {number} options.cacheTTL - Durée de vie du cache en ms (défaut: 5 min)
 * @param {boolean} options.cacheEnabled - Active/désactive le cache (défaut: true)
 * @param {boolean} options.refetchOnMount - Re-fetch au montage même si en cache (défaut: false)
 * @param {Function} options.onSuccess - Callback appelé en cas de succès
 * @param {Function} options.onError - Callback appelé en cas d'erreur
 * @param {string} options.errorMessage - Message d'erreur personnalisé
 * @returns {Object} { data, error, loading, execute, reset, invalidateCache }
 */
export const useCachedSupabaseQuery = (queryFn, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const {
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minutes par défaut
    cacheEnabled = true,
    refetchOnMount = false,
    onSuccess,
    onError,
    errorMessage = ERROR_MESSAGES.GENERIC
  } = options;

  // Charger depuis le cache au montage si disponible
  useEffect(() => {
    if (cacheEnabled && cacheKey && !initialLoadDone) {
      const cachedData = cacheManager.get(cacheKey);
      if (cachedData && !refetchOnMount) {
        logger.debug(`Loading from cache: ${cacheKey}`);
        setData(cachedData);
        setInitialLoadDone(true);
      }
    }
  }, [cacheKey, cacheEnabled, refetchOnMount, initialLoadDone]);

  const execute = useCallback(async (...args) => {
    // Vérifier le cache en premier
    if (cacheEnabled && cacheKey && !refetchOnMount) {
      const cachedData = cacheManager.get(cacheKey);
      if (cachedData) {
        logger.debug(`Using cached data: ${cacheKey}`);
        setData(cachedData);
        return { data: cachedData, error: null };
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await queryFn(...args);

      // Vérifier si Supabase a retourné une erreur
      if (result?.error) {
        throw result.error;
      }

      setData(result.data);

      // Mettre en cache si activé
      if (cacheEnabled && cacheKey) {
        cacheManager.set(cacheKey, result.data, cacheTTL);
      }

      // Callback de succès
      if (onSuccess) {
        onSuccess(result.data);
      }

      setInitialLoadDone(true);
      return { data: result.data, error: null };
    } catch (err) {
      const errorObj = {
        message: err.message || errorMessage,
        code: err.code,
        details: err.details,
        hint: err.hint
      };

      setError(errorObj);
      logger.error('Supabase query error:', err);

      // Callback d'erreur
      if (onError) {
        onError(errorObj);
      }

      return { data: null, error: errorObj };
    } finally {
      setLoading(false);
    }
  }, [queryFn, cacheKey, cacheEnabled, cacheTTL, refetchOnMount, onSuccess, onError, errorMessage]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setInitialLoadDone(false);
  }, []);

  const invalidateCache = useCallback(() => {
    if (cacheKey) {
      cacheManager.invalidate(cacheKey);
      logger.debug(`Cache invalidated for: ${cacheKey}`);
    }
  }, [cacheKey]);

  return {
    data,
    error,
    loading,
    execute,
    reset,
    invalidateCache
  };
};

export default useCachedSupabaseQuery;
