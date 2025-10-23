import React from 'react';
import { AlertCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

/**
 * Composant ErrorMessage réutilisable pour afficher des messages d'erreur/alerte
 */
const ErrorMessage = ({
  type = "error",
  title = null,
  message,
  onRetry = null,
  onDismiss = null,
  icon: CustomIcon = null,
  className = ""
}) => {
  const types = {
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-600",
      Icon: XCircle,
      defaultTitle: "Erreur"
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
      Icon: AlertTriangle,
      defaultTitle: "Attention"
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      iconColor: "text-blue-600",
      Icon: Info,
      defaultTitle: "Information"
    },
    danger: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      iconColor: "text-red-600",
      Icon: AlertCircle,
      defaultTitle: "Danger"
    }
  };

  const config = types[type] || types.error;
  const Icon = CustomIcon || config.Icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        {/* Icône */}
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>

        {/* Contenu */}
        <div className="ml-3 flex-1">
          {displayTitle && (
            <h3 className={`text-sm font-semibold ${config.textColor} mb-1`}>
              {displayTitle}
            </h3>
          )}
          <p className={`text-sm ${config.textColor}`}>
            {message}
          </p>

          {/* Actions */}
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`text-sm font-medium ${config.textColor} hover:underline`}
                >
                  Réessayer
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className={`text-sm font-medium ${config.textColor} hover:underline`}
                >
                  Fermer
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bouton fermer si onDismiss fourni */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={`flex-shrink-0 ml-3 ${config.iconColor} hover:opacity-75`}
          >
            <span className="sr-only">Fermer</span>
            <XCircle className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Variantes pré-configurées
export const NetworkError = ({ onRetry }) => (
  <ErrorMessage
    type="error"
    title="Erreur de connexion"
    message="Impossible de se connecter au serveur. Vérifiez votre connexion internet."
    onRetry={onRetry}
  />
);

export const ValidationError = ({ message }) => (
  <ErrorMessage
    type="warning"
    title="Validation échouée"
    message={message || "Veuillez vérifier les informations saisies."}
  />
);

export const PermissionError = () => (
  <ErrorMessage
    type="danger"
    title="Accès refusé"
    message="Vous n'avez pas les permissions nécessaires pour effectuer cette action."
  />
);

export const SuccessMessage = ({ message, onDismiss }) => (
  <ErrorMessage
    type="info"
    title="Succès"
    message={message || "L'opération a été effectuée avec succès."}
    onDismiss={onDismiss}
    className="bg-green-50 border-green-200 text-green-800"
    icon={Info}
  />
);

export const InfoMessage = ({ title, message }) => (
  <ErrorMessage
    type="info"
    title={title}
    message={message}
  />
);

export default ErrorMessage;
