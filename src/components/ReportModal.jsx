import React, { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const REPORT_REASONS = [
  { value: 'scam', label: '🚨 Arnaque ou fraude', description: 'Cette annonce semble frauduleuse' },
  { value: 'inappropriate', label: '🔞 Contenu inapproprié', description: 'Contenu offensant ou illégal' },
  { value: 'spam', label: '📧 Spam ou publicité', description: 'Annonce répétitive ou spam' },
  { value: 'fake', label: '❌ Fausse annonce', description: 'Produit inexistant ou trompeur' },
  { value: 'duplicate', label: '📋 Doublon', description: 'Annonce déjà publiée' },
  { value: 'other', label: '⚠️ Autre raison', description: 'Autre problème à signaler' }
];

const ReportModal = ({ isOpen, onClose, annonceId, annonceTitle }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedReason) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez sélectionner une raison.'
      });
      return;
    }

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Vous devez être connecté pour signaler une annonce.'
      });
      return;
    }

    setLoading(true);

    try {
      // Vérifier si l'utilisateur a déjà signalé cette annonce
      const { data: existing } = await supabase
        .from('reports')
        .select('id')
        .eq('annonce_id', annonceId)
        .eq('reporter_id', user.id)
        .single();

      if (existing) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Vous avez déjà signalé cette annonce.'
        });
        setLoading(false);
        return;
      }

      // Créer le signalement
      const { error } = await supabase
        .from('reports')
        .insert({
          annonce_id: annonceId,
          reporter_id: user.id,
          reason: selectedReason,
          details: details.trim() || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Signalement envoyé',
        description: 'Merci, nous examinerons cette annonce rapidement.',
        variant: 'default'
      });

      // Réinitialiser et fermer
      setSelectedReason('');
      setDetails('');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'envoyer le signalement.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="text-red-500" size={24} />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Signaler une annonce</h2>
                    <p className="text-sm text-gray-500 mt-1">{annonceTitle}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition"
                  disabled={loading}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Raisons */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Quel est le problème ? *
                  </label>
                  <div className="space-y-2">
                    {REPORT_REASONS.map((reason) => (
                      <button
                        key={reason.value}
                        type="button"
                        onClick={() => setSelectedReason(reason.value)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition ${
                          selectedReason === reason.value
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{reason.label}</p>
                            <p className="text-sm text-gray-600 mt-1">{reason.description}</p>
                          </div>
                          {selectedReason === reason.value && (
                            <div className="ml-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Détails */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Détails supplémentaires (optionnel)
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Ajoutez plus d'informations pour nous aider à comprendre le problème..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{details.length}/500 caractères</p>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    ℹ️ Votre signalement sera examiné par notre équipe. Les signalements abusifs peuvent entraîner des sanctions.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !selectedReason}
                    className="flex-1 py-3 px-6 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Envoi...</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={20} />
                        <span>Signaler</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReportModal;
