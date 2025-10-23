import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ annonceId, className = "", size = 20, showText = false }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('annonce_id', annonceId)
        .maybeSingle();

      if (!error && data) {
        setIsFavorite(true);
      }
    };

    checkFavorite();
  }, [user, annonceId]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour ajouter des favoris.',
      });
      navigate('/connexion');
      return;
    }

    setLoading(true);

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('annonce_id', annonceId);

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de retirer des favoris.',
        });
      } else {
        setIsFavorite(false);
        toast({
          title: 'Retiré des favoris',
          description: 'L\'annonce a été retirée de vos favoris.',
        });
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          annonce_id: annonceId,
        });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible d\'ajouter aux favoris.',
        });
      } else {
        setIsFavorite(true);
        toast({
          title: 'Ajouté aux favoris',
          description: 'L\'annonce a été ajoutée à vos favoris.',
        });
      }
    }

    setLoading(false);
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`transition-all duration-200 disabled:opacity-50 ${className}`}
      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      {showText ? (
        <div className="flex items-center space-x-2">
          <Heart
            size={size}
            className={`transition-all ${
              isFavorite
                ? 'text-red-500 fill-red-500'
                : 'hover:text-red-500'
            }`}
          />
          <span>{isFavorite ? 'Retirer' : 'Favoris'}</span>
        </div>
      ) : (
        <Heart
          size={size}
          className={`transition-all ${
            isFavorite
              ? 'text-red-500 fill-red-500'
              : 'text-white hover:text-red-500'
          }`}
        />
      )}
    </button>
  );
};

export default FavoriteButton;
