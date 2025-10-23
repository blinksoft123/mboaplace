import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Bouton "Load More" réutilisable pour la pagination
 */
const LoadMoreButton = ({
  onClick,
  loading = false,
  disabled = false,
  text = "Voir plus",
  loadingText = "Chargement...",
  className = "",
  variant = "primary"
}) => {
  const baseClasses = "px-8 py-3 rounded-full font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-green-700 text-white hover:bg-green-800",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border-2 border-green-700 text-green-700 hover:bg-green-50"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      <span>{loading ? loadingText : text}</span>
    </button>
  );
};

export default LoadMoreButton;
