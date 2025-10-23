
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2, TrendingUp, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const MyAnnoncesPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnonces = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('annonces')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user annonces:', error);
        toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger vos annonces.' });
      } else {
        setAnnonces(data);
      }
      setLoading(false);
    };
    fetchAnnonces();
  }, [user, toast]);

  const handleDelete = async (annonceId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible.")) {
      return;
    }
    const { error } = await supabase.from('annonces').delete().eq('id', annonceId);
    if (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'La suppression a échoué.' });
    } else {
      setAnnonces(annonces.filter(ad => ad.id !== annonceId));
      toast({ title: 'Succès', description: 'Annonce supprimée.' });
    }
  };

  const handleAction = () => {
    toast({
      title: "🚧 Fonctionnalité en cours de développement",
      description: "Cette fonctionnalité n'est pas encore implémentée. Revenez bientôt !",
    });
  };

  return (
    <>
      <Helmet>
        <title>Mes annonces - MBOA PLACE</title>
        <meta name="description" content="Gérez vos annonces sur MBOA PLACE" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Mes annonces</h1>
            <Link to="/publier" className="btn-primary">Publier une annonce</Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20"><Loader2 className="h-12 w-12 animate-spin text-green-700" /></div>
          ) : annonces.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 text-lg">Vous n'avez aucune annonce pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {annonces.map((annonce, index) => (
                <motion.div
                  key={annonce.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
                      <img className="w-full h-full object-cover" alt={annonce.title} src={annonce.images_urls?.[0] || 'https://placehold.co/192x192'} />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{annonce.title}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                            <span><span className="font-semibold">Catégorie:</span> {annonce.category}</span>
                            <span className="flex items-center space-x-1"><Eye size={16} /><span>{annonce.views || 0} vues</span></span>
                          </div>
                          <p className="text-sm text-gray-500">Publiée le {new Date(annonce.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={handleAction} className="flex items-center space-x-2 px-4 py-2 bg-[#FF6F00] hover:bg-[#E65100] text-white rounded-lg font-semibold transition text-sm"><TrendingUp size={16} /><span>Booster</span></button>
                        <Link to={`/annonce/edit/${annonce.id}`} className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition text-sm"><Edit size={16} /><span>Modifier</span></Link>
                        <Link to={`/annonce/${annonce.id}`} className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition text-sm"><Eye size={16} /><span>Voir</span></Link>
                        <button onClick={() => handleDelete(annonce.id)} className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition text-sm"><Trash2 size={16} /><span>Supprimer</span></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyAnnoncesPage;
  