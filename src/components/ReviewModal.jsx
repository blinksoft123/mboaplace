import React, { useState } from 'react';
import { X, Star, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const ReviewModal = ({ isOpen, onClose, reviewedUserId, reviewedUserName, annonceId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Vous devez être connecté.' });
      return;
    }

    if (user.id === reviewedUserId) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Vous ne pouvez pas vous évaluer vous-même.' });
      return;
    }

    if (rating === 0) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Veuillez sélectionner une note.' });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('reviews').insert({
        reviewer_id: user.id,
        reviewed_id: reviewedUserId,
        annonce_id: annonceId,
        rating,
        comment: comment.trim() || null
      });

      if (error) {
        if (error.code === '23505') {
          toast({ variant: 'destructive', title: 'Erreur', description: 'Vous avez déjà laissé un avis pour cette annonce.' });
        } else {
          throw error;
        }
      } else {
        toast({ title: 'Avis publié', description: 'Merci pour votre retour !' });
        onClose();
        setRating(0);
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({ variant: 'destructive', title: 'Erreur', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Laisser un avis</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-4">
          Évaluez votre expérience avec <span className="font-semibold">{reviewedUserName}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Note *</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={`${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {rating === 0 && 'Sélectionnez une note'}
              {rating === 1 && '⭐ Très insatisfait'}
              {rating === 2 && '⭐⭐ Insatisfait'}
              {rating === 3 && '⭐⭐⭐ Moyen'}
              {rating === 4 && '⭐⭐⭐⭐ Satisfait'}
              {rating === 5 && '⭐⭐⭐⭐⭐ Excellent !'}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commentaire (optionnel)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Partagez votre expérience..."
              rows={4}
              maxLength={500}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">{comment.length}/500 caractères</p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <><Loader2 size={20} className="animate-spin mr-2" /> Envoi...</> : 'Publier l\'avis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
