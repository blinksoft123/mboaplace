// Color palette
export const COLORS = {
  PRIMARY: '#1B5E20',
  PRIMARY_HOVER: '#2E7D32',
  SECONDARY: '#FF6F00',
  SECONDARY_HOVER: '#E65100',
  GREEN_900: '#1B5E20',
  GREEN_700: '#2E7D32',
  ORANGE_600: '#FF6F00',
  ORANGE_700: '#E65100',
};

// File upload limits
export const FILE_LIMITS = {
  MAX_IMAGES: 6,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  MAX_IMAGE_SIZE_MB: 5,
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
};

// Form validation
export const VALIDATION = {
  TITLE_MIN_LENGTH: 10,
  TITLE_MAX_LENGTH: 80,
  DESCRIPTION_MIN_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 2000,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/,
};

// Pagination
export const PAGINATION = {
  ANNONCES_PER_PAGE: 8,
  RECENT_ANNONCES_LIMIT: 8,
  PROFILE_ANNONCES_PREVIEW: 3,
};

// Currency options
export const CURRENCIES = [
  { code: 'CAD', symbol: '$', name: 'Dollar Canadien' },
  { code: 'XAF', symbol: 'FCFA', name: 'Franc CFA' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dollar US' },
];

// Password strength levels
export const PASSWORD_STRENGTH = {
  WEAK: { level: 1, label: 'Faible', color: 'bg-red-500', textColor: 'text-red-500', width: '25%' },
  MEDIUM: { level: 2, label: 'Moyen', color: 'bg-yellow-500', textColor: 'text-yellow-500', width: '50%' },
  STRONG: { level: 3, label: 'Fort', color: 'bg-blue-500', textColor: 'text-blue-500', width: '75%' },
  VERY_STRONG: { level: 4, label: 'Très fort', color: 'bg-green-500', textColor: 'text-green-500', width: '100%' },
};

// API endpoints (if needed for future use)
export const API_ROUTES = {
  ANNONCES: '/annonces',
  PROFILES: '/profiles',
  CONVERSATIONS: '/conversations',
  MESSAGES: '/messages',
  REVIEWS: '/reviews',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'mboa_auth_token',
  USER_PREFERENCES: 'mboa_user_prefs',
  DRAFT_ANNONCE: 'mboa_draft_annonce',
};

// Time constants (in milliseconds)
export const TIME = {
  DEBOUNCE_SEARCH: 300,
  TOAST_DURATION: 3000,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
};
