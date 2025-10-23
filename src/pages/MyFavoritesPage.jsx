
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Heart, Loader2, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import AnnonceCard from '@/components/AnnonceCard';

const MyFavoritesPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          created_at,
          annonces (
            id,
            title,
            price,
            is_free,
            city,
            images_urls,
            created_at,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites:', error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger vos favoris.' });
      } else {
        // Enrichir les données avec profiles pour AnnonceCard
        const enrichedData = data?.map(fav => ({
          ...fav,
          annonces: {
            ...fav.annonces,
            profiles: null // Les favoris n'incluent pas toujours les profiles
          }
        }));
        setFavorites(enrichedData || []);
      }
      setLoading(false);
    };
    fetchFavorites();
  }, [user, toast]);

  const handleRemoveFavorite = async (favoriteId) => {
    const { error } = await supabase.from('favorites').delete().eq('id', favoriteId);
    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de retirer ce favori.' });
    } else {
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      toast({ title: 'Succès', description: 'Retiré des favoris.' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Mes Favoris - MBOA PLACE</title>
        <meta name="description" content="Retrouvez vos annonces favorites sur MBOA PLACE." />
      </Helmet>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 flex items-center">
            <Heart size={32} className="mr-3 text-red-500" />
            Mes Favoris
          </h1>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-green-700" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Heart size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun favori</h2>
              <p className="text-gray-600 mb-6">
                Vous n'avez pas encore d'annonces favorites. Parcourez les annonces et ajoutez-en à vos favoris !
              </p>
              <Link to="/categories" className="btn-primary inline-block">
                Parcourir les annonces
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((favorite) => {
                const annonce = favorite.annonces;
                if (!annonce) return null;
                
                return (
                  <div key={favorite.id} className="relative">
                    <button
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      className="absolute top-3 right-3 z-20 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition shadow-lg"
                      title="Retirer des favoris"
                    >
                      <X size={16} />
                    </button>
                    <AnnonceCard annonce={annonce} showAnimation={false} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyFavoritesPage;
  