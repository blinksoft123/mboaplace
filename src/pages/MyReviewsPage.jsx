
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Star, Loader2, User } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const MyReviewsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'given'
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [givenReviews, setGivenReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ avgRating: 0, totalReviews: 0 });

  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;
      setLoading(true);

      try {
        // Avis reçus
        const { data: received, error: receivedError } = await supabase
          .from('reviews')
          .select(`
            id,
            rating,
            comment,
            created_at,
            reviewer:profiles!reviewer_id (full_name, avatar_url),
            annonces (title)
          `)
          .eq('reviewed_id', user.id)
          .order('created_at', { ascending: false });

        if (receivedError) throw receivedError;
        setReceivedReviews(received || []);

        // Calculer stats
        if (received && received.length > 0) {
          const avg = received.reduce((acc, r) => acc + r.rating, 0) / received.length;
          setStats({ avgRating: avg.toFixed(1), totalReviews: received.length });
        }

        // Avis donnés
        const { data: given, error: givenError } = await supabase
          .from('reviews')
          .select(`
            id,
            rating,
            comment,
            created_at,
            reviewed:profiles!reviewed_id (full_name, avatar_url),
            annonces (title)
          `)
          .eq('reviewer_id', user.id)
          .order('created_at', { ascending: false });

        if (givenError) throw givenError;
        setGivenReviews(given || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les avis.' });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user, toast]);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const ReviewCard = ({ review, isReceived }) => {
    const otherUser = isReceived ? review.reviewer : review.reviewed;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6 mb-4"
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {otherUser?.avatar_url ? (
              <img src={otherUser.avatar_url} alt={otherUser.full_name} className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold">
                {otherUser?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold">{otherUser?.full_name || 'Utilisateur'}</p>
                <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
              </div>
              {renderStars(review.rating)}
            </div>
            {review.annonces?.title && (
              <p className="text-sm text-gray-600 mb-2">
                📄 <span className="font-medium">{review.annonces.title}</span>
              </p>
            )}
            {review.comment && (
              <p className="text-gray-700 mt-2 bg-gray-50 p-3 rounded-lg">"{review.comment}"</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Mes Avis - MBOA PLACE</title>
        <meta name="description" content="Consultez les avis que vous avez reçus sur MBOA PLACE." />
      </Helmet>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <Star size={32} className="mr-3 text-yellow-400" />
            Mes Avis
          </h1>

          {/* Stats */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <p className="text-4xl font-bold text-[#1B5E20]">{stats.avgRating}</p>
                <div className="flex items-center justify-center mt-2">
                  {renderStars(Math.round(stats.avgRating))}
                </div>
                <p className="text-sm text-gray-600 mt-1">Note moyenne</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[#1B5E20]">{stats.totalReviews}</p>
                <p className="text-sm text-gray-600 mt-1">Avis reçus</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-[#1B5E20]">{givenReviews.length}</p>
                <p className="text-sm text-gray-600 mt-1">Avis donnés</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                activeTab === 'received'
                  ? 'bg-[#1B5E20] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Avis reçus ({receivedReviews.length})
            </button>
            <button
              onClick={() => setActiveTab('given')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                activeTab === 'given'
                  ? 'bg-[#1B5E20] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Avis donnés ({givenReviews.length})
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-green-700" />
            </div>
          ) : (
            <div>
              {activeTab === 'received' ? (
                receivedReviews.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Star size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun avis reçu</h2>
                    <p className="text-gray-600">
                      Vous n'avez pas encore reçu d'avis. Continuez à offrir un excellent service !
                    </p>
                  </div>
                ) : (
                  receivedReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} isReceived={true} />
                  ))
                )
              ) : (
                givenReviews.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <Star size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun avis donné</h2>
                    <p className="text-gray-600">
                      Vous n'avez pas encore laissé d'avis. Partagez votre expérience avec la communauté !
                    </p>
                  </div>
                ) : (
                  givenReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} isReceived={false} />
                  ))
                )
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyReviewsPage;
  