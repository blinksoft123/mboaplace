import { useState, useCallback } from 'react';
import logger from '@/utils/logger';
import { ERROR_MESSAGES } from '@/utils/constants';

/**
 * Hook personnalisé pour gérer les requêtes Supabase avec gestion d'erreurs centralisée
 * 
 * @param {Function} queryFn - Fonction async qui exécute la requête Supabase
 * @param {Object} options - Options de configuration
 * @param {Function} options.onSuccess - Callback appelé en cas de succès
 * @param {Function} options.onError - Callback appelé en cas d'erreur
 * @param {string} options.errorMessage - Message d'erreur personnalisé
 * @returns {Object} { data, error, loading, execute, reset }
 */
export const useSupabaseQuery = (queryFn, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    onSuccess,
    onError,
    errorMessage = ERROR_MESSAGES.GENERIC
  } = options;

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await queryFn(...args);

      // Vérifier si Supabase a retourné une erreur
      if (result?.error) {
        throw result.error;
      }

      setData(result.data);

      // Callback de succès
      if (onSuccess) {
        onSuccess(result.data);
      }

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
  }, [queryFn, onSuccess, onError, errorMessage]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    error,
    loading,
    execute,
    reset
  };
};

export default useSupabaseQuery;
