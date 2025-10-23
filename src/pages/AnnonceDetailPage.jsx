
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Flag, Share2, MapPin, Clock, Mail, MessageCircle, Phone, CheckCircle, Star, Shield, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import FavoriteButton from '@/components/FavoriteButton';
import ReviewModal from '@/components/ReviewModal';
import ReportModal from '@/components/ReportModal';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import logger from '@/utils/logger';
import { timeAgo } from '@/utils/dateHelpers';

const AnnonceDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const incrementViewCount = useCallback(async () => {
    await supabase.rpc('increment_view_count', { ad_id: id });
  }, [id]);

  useEffect(() => {
    const fetchAnnonce = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('annonces')
        .select(`
          *,
          profiles (full_name, avatar_url, created_at)
        `)
        .eq('id', id)
        .maybeSingle();
      
      if (error) {
        logger.error("Error fetching annonce:", error);
        toast({ variant: 'destructive', title: 'Erreur', description: "L'annonce n'a pas pu être chargée." });
        navigate('/');
      } else if (!data) {
        toast({ variant: 'destructive', title: 'Annonce non trouvée', description: "Cette annonce n'existe pas ou a été supprimée." });
        navigate('/');
      } else {
        setAnnonce(data);
        incrementViewCount();
      }
      setLoading(false);
    };

    if (id) {
        fetchAnnonce();
    }
  }, [id, toast, navigate, incrementViewCount]);
  
  const handleAction = () => {
    toast({
      title: "🚧 Fonctionnalité en cours de développement",
      description: "Cette fonctionnalité n'est pas encore implémentée. Revenez bientôt !",
    });
  };

  const handleContactSeller = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Connexion requise', description: 'Veuillez vous connecter pour contacter le vendeur.' });
      navigate('/connexion');
      return;
    }

    if (user.id === annonce.seller_id) {
      toast({ variant: 'destructive', title: 'Action impossible', description: 'Vous ne pouvez pas vous contacter vous-même.' });
      return;
    }

    try {
      // Vérifier si conversation existe déjà
      const { data: existingConv, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('annonce_id', annonce.id)
        .or(`and(buyer_id.eq.${user.id},seller_id.eq.${annonce.seller_id}),and(buyer_id.eq.${annonce.seller_id},seller_id.eq.${user.id})`)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      let conversationId;

      if (existingConv) {
        conversationId = existingConv.id;
        toast({ title: 'Redirection', description: 'Ouverture de la conversation existante...' });
      } else {
        // Créer nouvelle conversation
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            annonce_id: annonce.id,
            buyer_id: user.id,
            seller_id: annonce.seller_id
          })
          .select()
          .single();

        if (createError) throw createError;
        conversationId = newConv.id;
        toast({ title: 'Conversation créée', description: 'Redirection vers la messagerie...' });
      }

      // Rediriger vers messagerie avec l'ID de la conversation
      setTimeout(() => {
        navigate('/profil/messages', { state: { conversationId } });
      }, 500);
    } catch (error) {
      logger.error('Error creating conversation:', error);
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de créer la conversation.' });
    }
  };

  
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin text-green-700" /></div>;
  }

  if (!annonce) {
    return <div className="text-center py-20">Annonce non trouvée. Redirection...</div>;
  }

  return (
    <>
      <Helmet>
        <title>{annonce.title} - MBOA PLACE</title>
        <meta name="description" content={annonce.description} />
      </Helmet>

      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-[#1B5E20]">Accueil</Link>
            <span className="mx-2">&gt;</span>
            <Link to="/categories" className="hover:text-[#1B5E20]">{annonce.category}</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900 font-medium">Annonce #{annonce.id}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>Active
                </span>
                <span className="flex items-center text-gray-600 text-sm"><MapPin size={16} className="mr-1" />{annonce.city}</span>
                <span className="flex items-center text-gray-600 text-sm"><Clock size={16} className="mr-1" />Il y a {timeAgo(annonce.created_at)}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-6">{annonce.title}</h1>

              <div className="mb-8">
                <div className="relative h-96 mb-4 rounded-lg overflow-hidden shadow-inner bg-gray-200">
                  <img className="w-full h-full object-cover" alt={annonce.title} src={annonce.images_urls?.[0] || "https://images.unsplash.com/photo-1584988410882-c829a2885288"} />
                </div>
                {annonce.images_urls && annonce.images_urls.length > 1 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {annonce.images_urls.slice(1,6).map((url, index) => (
                             <img key={index} className="h-24 w-full object-cover rounded cursor-pointer hover:opacity-75 transition border-2 border-transparent hover:border-[#FF6F00]" alt={`Annonce image ${index + 2}`} src={url} />
                        ))}
                    </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">Description complète</h2>
                <div className="prose max-w-none text-gray-700 space-y-4">
                  <p>{annonce.description}</p>
                </div>
              </div>

              <div className="border-t border-b py-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Informations clés</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div><p className="text-gray-600 text-sm">Catégorie</p><p className="font-semibold">{annonce.category}</p></div>
                  <div><p className="text-gray-600 text-sm">Sous-catégorie</p><p className="font-semibold">{annonce.subcategory}</p></div>
                  <div><p className="text-gray-600 text-sm">Prix</p><p className="font-semibold text-[#FF6F00]">{annonce.is_free ? 'Gratuit' : `${annonce.price} ${annonce.currency || 'CAD'}`}</p></div>
                  <div><p className="text-gray-600 text-sm">Ville</p><p className="font-semibold">{annonce.city}</p></div>
                  <div><p className="text-gray-600 text-sm">N° annonce</p><p className="font-semibold">#MB-{annonce.id}</p></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
                  <FavoriteButton annonceId={annonce.id} size={20} showText={true} className="" />
                </div>
                <button 
                  onClick={() => {
                    if (!user) {
                      toast({ variant: 'destructive', title: 'Connexion requise', description: 'Veuillez vous connecter pour signaler une annonce.' });
                      navigate('/connexion');
                      return;
                    }
                    setReportModalOpen(true);
                  }} 
                  className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
                >
                  <Flag size={20} /><span>Signaler</span>
                </button>
                <button onClick={handleAction} className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-100 transition"><Share2 size={20} /><span>Partager</span></button>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <img className="w-full h-full rounded-full object-cover" alt="Seller profile picture" src={annonce.profiles?.avatar_url || "https://i.pravatar.cc/150"} />
                    <div className="absolute bottom-0 right-0 bg-green-500 p-1 rounded-full border-2 border-white"><CheckCircle size={16} className="text-white" /></div>
                  </div>
                  <h3 className="text-xl font-bold">{annonce.profiles?.full_name || "Vendeur"}</h3>
                  <div className="flex items-center justify-center space-x-1 my-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={18} className="text-yellow-400 fill-current" />)}
                    <span className="text-sm text-gray-600 ml-2">(12 avis)</span>
                  </div>
                  <p className="text-sm text-gray-600">Membre depuis {new Date(annonce.profiles?.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</p>
                </div>

                <button onClick={handleContactSeller} className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white py-3 rounded-lg font-bold text-lg mb-4 transition flex items-center justify-center space-x-2">
                  <Phone size={20} /><span>CONTACTER LE VENDEUR</span>
                </button>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const subject = encodeURIComponent(`Intéressé par: ${annonce.title}`);
                      const body = encodeURIComponent(`Bonjour,\n\nJe suis intéressé par votre annonce "${annonce.title}".\n\nLien: ${window.location.href}`);
                      window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <Mail size={20} /><span>Email</span>
                  </button>
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(`Bonjour, je suis intéressé par votre annonce "${annonce.title}" sur MBOA PLACE: ${window.location.href}`);
                      window.open(`https://wa.me/?text=${text}`, '_blank');
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <MessageCircle size={20} /><span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!user) {
                        toast({ variant: 'destructive', title: 'Connexion requise', description: 'Veuillez vous connecter pour laisser un avis.' });
                        navigate('/connexion');
                        return;
                      }
                      setReviewModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-2 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <Star size={20} /><span>Laisser un avis</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-[#1B5E20] rounded-full flex items-center justify-center flex-shrink-0"><Shield size={20} className="text-white" /></div>
                  <div>
                    <h4 className="font-bold mb-2">🛡️ CONSEILS DE SÉCURITÉ</h4>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>Rencontrez en lieu public</li>
                      <li>Vérifiez l'identité</li>
                      <li>Ne payez jamais d'avance</li>
                      <li>Signalez les comportements suspects</li>
                    </ul>
                    <Link to="/securite" className="text-[#1B5E20] text-sm font-semibold hover:underline mt-2 inline-block">En savoir plus</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        reviewedUserId={annonce?.seller_id}
        reviewedUserName={annonce?.profiles?.full_name}
        annonceId={annonce?.id}
      />

      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        annonceId={annonce?.id}
        annonceTitle={annonce?.title}
      />
    </>
  );
};

export default AnnonceDetailPage;
  