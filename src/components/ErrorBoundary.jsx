import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import logger from '@/utils/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error avec logger utilitaire
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState(prevState => ({
      error: error,
      errorInfo: errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Callback optionnel pour monitoring externe (Sentry, etc.)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // UI de secours personnalisée via props
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          errorInfo: this.state.errorInfo,
          resetError: this.handleReset
        });
      }

      // UI de secours par défaut
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle size={40} className="text-red-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Oups ! Quelque chose s'est mal passé
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Une erreur inattendue s'est produite. Ne vous inquiétez pas, notre équipe a été informée et travaille sur une solution.
              </p>

              {import.meta.env.MODE === 'development' && this.state.error && (
                <details className="w-full mb-8 text-left">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-700 mb-2 hover:text-gray-900">
                    Détails de l'erreur (mode développement)
                  </summary>
                  <div className="bg-gray-100 rounded p-4 overflow-auto max-h-64">
                    <p className="text-xs text-red-600 font-mono mb-2">
                      <strong>Erreur:</strong> {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center space-x-2 bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  <RefreshCw size={20} />
                  <span>Réessayer</span>
                </button>
                
                <Link
                  to="/"
                  className="flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition"
                >
                  <Home size={20} />
                  <span>Retour à l'accueil</span>
                </Link>
              </div>

              {/* Aide supplémentaire si erreurs répétées */}
              {this.state.errorCount > 2 && (
                <div className="mt-6 w-full p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                  <p className="text-sm text-yellow-800 mb-2">
                    <strong>Toujours un problème ?</strong> Essayez de recharger la page complètement.
                  </p>
                  <button
                    onClick={this.handleReload}
                    className="text-sm text-yellow-700 underline hover:text-yellow-900"
                  >
                    Recharger la page
                  </button>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-8">
                Si le problème persiste, veuillez{' '}
                <Link to="/contact" className="text-green-700 hover:underline font-semibold">
                  contacter le support
                </Link>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
