/**
 * Constantes globales de l'application MBOA PLACE
 */

// Statuts des annonces
export const ANNONCE_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  SOLD: 'sold'
};

// Rôles des utilisateurs
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator'
};

// États/conditions des produits
export const PRODUCT_CONDITIONS = {
  NEW: 'neuf',
  VERY_GOOD: 'tres_bon',
  GOOD: 'bon',
  ACCEPTABLE: 'acceptable'
};

// Types de devises
export const CURRENCIES = {
  CAD: 'CAD',
  XAF: 'XAF',
  EUR: 'EUR',
  USD: 'USD'
};

// Limites de fichiers
export const FILE_LIMITS = {
  MAX_IMAGES: 6,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB en bytes
  MAX_IMAGE_SIZE_MB: 5
};

// Validations
export const VALIDATION = {
  TITLE_MIN_LENGTH: 10,
  TITLE_MAX_LENGTH: 80,
  DESCRIPTION_MIN_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 5000,
  PHONE_MIN_LENGTH: 10
};

// URLs de redirection
export const ROUTES = {
  HOME: '/',
  LOGIN: '/connexion',
  REGISTER: '/inscription',
  PROFILE: '/profil',
  PUBLISH: '/publier',
  MESSAGES: '/profil/messages',
  FAVORITES: '/profil/favoris',
  MY_ANNONCES: '/profil/mes-annonces',
  CATEGORIES: '/categories',
  ADMIN: '/admin'
};

// Messages d'erreur communs
export const ERROR_MESSAGES = {
  GENERIC: 'Une erreur est survenue. Veuillez réessayer.',
  NETWORK: 'Problème de connexion réseau. Vérifiez votre connexion internet.',
  AUTH_REQUIRED: 'Vous devez être connecté pour effectuer cette action.',
  PERMISSION_DENIED: 'Vous n\'avez pas les permissions nécessaires.',
  NOT_FOUND: 'La ressource demandée n\'a pas été trouvée.',
  RATE_LIMIT: 'Trop de requêtes. Veuillez patienter quelques instants.'
};

// Messages de succès communs
export const SUCCESS_MESSAGES = {
  SAVED: 'Enregistré avec succès !',
  DELETED: 'Supprimé avec succès !',
  UPDATED: 'Mis à jour avec succès !',
  SENT: 'Envoyé avec succès !'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  HOMEPAGE_LIMIT: 8
};

export default {
  ANNONCE_STATUS,
  USER_ROLES,
  PRODUCT_CONDITIONS,
  CURRENCIES,
  FILE_LIMITS,
  VALIDATION,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION
};
