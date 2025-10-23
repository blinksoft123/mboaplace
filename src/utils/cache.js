/**
 * Système de cache en mémoire simple pour éviter les requêtes répétées
 * Utilise un Map avec expiration TTL (Time To Live)
 */

import logger from './logger';

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes par défaut
  }

  /**
   * Génère une clé de cache à partir des paramètres
   * @param {string} prefix - Préfixe de la clé (ex: 'annonces', 'categories')
   * @param {Object} params - Paramètres de la requête
   * @returns {string} Clé de cache unique
   */
  generateKey(prefix, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});
    
    return `${prefix}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Récupère une valeur du cache
   * @param {string} key - Clé de cache
   * @returns {any|null} Valeur en cache ou null si expirée/inexistante
   */
  get(key) {
    const cached = this.cache.get(key);
    
    if (!cached) {
      logger.debug(`Cache miss: ${key}`);
      return null;
    }

    // Vérifier si le cache est expiré
    if (Date.now() > cached.expiresAt) {
      logger.debug(`Cache expired: ${key}`);
      this.cache.delete(key);
      return null;
    }

    logger.debug(`Cache hit: ${key}`);
    return cached.value;
  }

  /**
   * Ajoute une valeur au cache
   * @param {string} key - Clé de cache
   * @param {any} value - Valeur à mettre en cache
   * @param {number} ttl - Durée de vie en millisecondes (optionnel)
   */
  set(key, value, ttl = this.defaultTTL) {
    const expiresAt = Date.now() + ttl;
    
    this.cache.set(key, {
      value,
      expiresAt,
      createdAt: Date.now()
    });

    logger.debug(`Cache set: ${key} (expires in ${ttl}ms)`);
  }

  /**
   * Invalide une clé de cache spécifique
   * @param {string} key - Clé à invalider
   */
  invalidate(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      logger.debug(`Cache invalidated: ${key}`);
    }
    return deleted;
  }

  /**
   * Invalide toutes les clés correspondant à un préfixe
   * @param {string} prefix - Préfixe des clés à invalider
   */
  invalidateByPrefix(prefix) {
    let count = 0;
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }

    if (count > 0) {
      logger.debug(`Cache invalidated ${count} entries with prefix: ${prefix}`);
    }
    
    return count;
  }

  /**
   * Vide complètement le cache
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    logger.debug(`Cache cleared: ${size} entries removed`);
  }

  /**
   * Nettoie les entrées expirées du cache
   */
  cleanup() {
    let cleaned = 0;
    const now = Date.now();

    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expiresAt) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug(`Cache cleanup: ${cleaned} expired entries removed`);
    }

    return cleaned;
  }

  /**
   * Retourne les statistiques du cache
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, cached]) => ({
        key,
        expiresIn: cached.expiresAt - Date.now(),
        age: Date.now() - cached.createdAt
      }))
    };
  }
}

// Instance singleton
const cacheManager = new CacheManager();

// Nettoyer le cache toutes les 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.cleanup();
  }, 10 * 60 * 1000);
}

export default cacheManager;
export { CacheManager };
