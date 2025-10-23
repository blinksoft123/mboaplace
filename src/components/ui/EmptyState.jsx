import React from 'react';
import { Search, Inbox, AlertCircle, FileQuestion, ShoppingBag } from 'lucide-react';

/**
 * Composant EmptyState réutilisable pour afficher des états vides
 */
const EmptyState = ({
  icon: Icon = Inbox,
  title = "Aucun résultat",
  description = "Il n'y a rien à afficher pour le moment.",
  actionLabel = null,
  onAction = null,
  actionVariant = "primary",
  secondaryActionLabel = null,
  onSecondaryAction = null,
  size = "md"
}) => {
  const sizes = {
    sm: {
      container: "py-8",
      icon: 32,
      title: "text-lg",
      description: "text-sm"
    },
    md: {
      container: "py-12",
      icon: 48,
      title: "text-xl",
      description: "text-base"
    },
    lg: {
      container: "py-20",
      icon: 64,
      title: "text-2xl",
      description: "text-lg"
    }
  };

  const currentSize = sizes[size] || sizes.md;

  const variants = {
    primary: "bg-green-700 hover:bg-green-800 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    outline: "border-2 border-green-700 text-green-700 hover:bg-green-50"
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-8 text-center ${currentSize.container}`}>
      {/* Icône */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon size={currentSize.icon} className="text-gray-400" />
        </div>
      </div>

      {/* Titre */}
      <h3 className={`font-bold text-gray-900 mb-2 ${currentSize.title}`}>
        {title}
      </h3>

      {/* Description */}
      <p className={`text-gray-600 mb-6 max-w-md mx-auto ${currentSize.description}`}>
        {description}
      </p>

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className={`px-6 py-3 rounded-lg font-semibold transition ${variants[actionVariant]}`}
            >
              {actionLabel}
            </button>
          )}
          
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="px-6 py-3 rounded-lg font-semibold transition bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Variantes pré-configurées
export const NoSearchResults = ({ onReset }) => (
  <EmptyState
    icon={Search}
    title="Aucun résultat trouvé"
    description="Essayez de modifier vos critères de recherche ou réinitialisez les filtres."
    actionLabel="Réinitialiser les filtres"
    onAction={onReset}
  />
);

export const NoAnnonces = ({ onPublish }) => (
  <EmptyState
    icon={ShoppingBag}
    title="Aucune annonce disponible"
    description="Soyez le premier à publier une annonce dans cette catégorie !"
    actionLabel="Publier une annonce"
    onAction={onPublish}
  />
);

export const NoFavorites = ({ onBrowse }) => (
  <EmptyState
    icon={Inbox}
    title="Aucun favori"
    description="Vous n'avez pas encore ajouté d'annonces à vos favoris. Parcourez les annonces pour trouver ce qui vous intéresse."
    actionLabel="Parcourir les annonces"
    onAction={onBrowse}
  />
);

export const NoMessages = () => (
  <EmptyState
    icon={Inbox}
    title="Aucun message"
    description="Vous n'avez pas encore de conversations. Contactez un vendeur pour commencer."
    size="sm"
  />
);

export const ErrorState = ({ onRetry, errorMessage }) => (
  <EmptyState
    icon={AlertCircle}
    title="Une erreur s'est produite"
    description={errorMessage || "Impossible de charger les données. Veuillez réessayer."}
    actionLabel="Réessayer"
    onAction={onRetry}
    actionVariant="outline"
  />
);

export const NotFound = ({ onGoHome }) => (
  <EmptyState
    icon={FileQuestion}
    title="Page introuvable"
    description="La page que vous recherchez n'existe pas ou a été déplacée."
    actionLabel="Retour à l'accueil"
    onAction={onGoHome}
    size="lg"
  />
);

export default EmptyState;
