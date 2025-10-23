/**
 * Utilitaires pour la gestion des dates et du temps
 */

/**
 * Calcule le temps écoulé depuis une date donnée
 * @param {string|Date} date - La date à comparer
 * @returns {string} - Temps écoulé formaté (ex: "Il y a 2 heures")
 */
export const timeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);
  
  let interval = seconds / 31536000; // années
  if (interval > 1) {
    const years = Math.floor(interval);
    return `${years} an${years > 1 ? 's' : ''}`;
  }
  
  interval = seconds / 2592000; // mois
  if (interval > 1) {
    const months = Math.floor(interval);
    return `${months} mois`;
  }
  
  interval = seconds / 86400; // jours
  if (interval > 1) {
    const days = Math.floor(interval);
    return `${days} jour${days > 1 ? 's' : ''}`;
  }
  
  interval = seconds / 3600; // heures
  if (interval > 1) {
    const hours = Math.floor(interval);
    return `${hours} heure${hours > 1 ? 's' : ''}`;
  }
  
  interval = seconds / 60; // minutes
  if (interval > 1) {
    const minutes = Math.floor(interval);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  return `${Math.floor(seconds)} seconde${seconds > 1 ? 's' : ''}`;
};

/**
 * Formate une date au format français
 * @param {string|Date} date - La date à formater
 * @returns {string} - Date formatée (ex: "23 octobre 2025")
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Formate une date avec l'heure
 * @param {string|Date} date - La date à formater
 * @returns {string} - Date et heure formatées (ex: "23 oct. 2025 à 14:30")
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formate uniquement l'heure
 * @param {string|Date} date - La date dont on veut extraire l'heure
 * @returns {string} - Heure formatée (ex: "14:30")
 */
export const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default {
  timeAgo,
  formatDate,
  formatDateTime,
  formatTime
};
