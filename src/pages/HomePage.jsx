
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { ArrowRight, Star, Users, Shield, Zap, Search } from 'lucide-react';
import { categoriesData } from '@/data/categories';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import AnnonceCard from '@/components/AnnonceCard';
import { ANNONCE_STATUS, PAGINATION } from '@/utils/constants';
import logger from '@/utils/logger';

const HomePage = () => {
  const [annonces, setAnnonces] = useState([]);
  const [loadingAnnonces, setLoadingAnnonces] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoadingAnnonces(true);
    }

    const currentPage = isLoadMore ? page + 1 : 0;
    const from = currentPage * PAGINATION.HOMEPAGE_LIMIT;
    const to = from + PAGINATION.HOMEPAGE_LIMIT - 1;

    const { data, error, count } = await supabase
      .from('annonces')
      .select(`
        id,
        title,
        price,
        is_free,
        city,
        created_at,
        images_urls,
        category,
        profiles ( full_name, avatar_url )
      `, { count: 'exact' })
      .eq('status', ANNONCE_STATUS.ACTIVE)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      logger.error("Error fetching annonces", error);
    } else {
      if (isLoadMore) {
        setAnnonces(prev => [...prev, ...data]);
        setPage(currentPage);
      } else {
        setAnnonces(data);
        setPage(0);
      }
      
      // Vérifier s'il reste des annonces
      const totalLoaded = isLoadMore ? annonces.length + data.length : data.length;
      setHasMore(totalLoaded < count);
    }

    if (isLoadMore) {
      setLoadingMore(false);
    } else {
      setLoadingAnnonces(false);
    }
  };

  const handleLoadMore = () => {
    fetchAnnonces(true);
  };


  const testimonials = [
    {
      quote: "Grâce à MBOA PLACE j'ai trouvé un voyageur fiable pour envoyer un colis à ma famille. Transaction parfaite !",
      author: "Marie K.",
      location: "Montréal",
      role: "Utilisatrice depuis 2024",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      quote: "Je vends mes produits africains et j'ai doublé ma clientèle en 2 mois. Interface facile !",
      author: "Paul D.",
      location: "Toronto",
      role: "Vendeur depuis 2023",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    {
      quote: "Excellent pour trouver des partenaires de change. Plus besoin de chercher dans 10 groupes WhatsApp !",
      author: "Sarah M.",
      location: "Paris",
      role: "Utilisatrice depuis 2024",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
  ];

  const whyUsItems = [
    {
      icon: Users,
      title: "100% Communautaire",
      description: "Rejoignez des milliers d'Africains de la diaspora et du continent."
    },
    {
      icon: Shield,
      title: "Sécurisé & Fiable",
      description: "Profils vérifiés et système d'avis pour échanger en toute confiance."
    },
    {
      icon: Zap,
      title: "Simple & Rapide",
      description: "Interface intuitive, publiez une annonce en moins de 2 minutes."
    },
    {
      icon: '🆓',
      title: "Publiez Gratuitement",
      description: "Publiez autant d'annonces que vous voulez sans frais cachés."
    }
  ];

  return (
    <>
      <Helmet>
        <title>MBOA PLACE - Petites annonces pour la diaspora africaine</title>
        <meta name="description" content="Achetez, vendez, échangez et connectez-vous avec la communauté africaine mondiale. Emploi, immobilier, services, colis et plus encore." />
      </Helmet>
      
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-white text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover" alt="Diverse group of African people smiling and connecting" src="https://images.unsplash.com/photo-1637235334945-8e1b41589a29?q=80&w=2070&auto=format&fit=crop" />
          <div className="absolute inset-0 bg-black opacity-60"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-shadow">La place des Africains d'ici et d'ailleurs</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-shadow">Échangez, vendez et connectez-vous avec la communauté, où que vous soyez.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? "/publier" : "/connexion"} className="bg-[#FF6F00] hover:bg-[#E65100] text-white px-8 py-3 rounded-full font-bold transition text-lg flex items-center justify-center space-x-2 shadow-lg">
              <span>Publier une annonce</span>
              <ArrowRight size={20} />
            </Link>
            <Link to="/categories" className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white px-8 py-3 rounded-full font-bold transition text-lg flex items-center justify-center space-x-2 shadow-lg">
              <Search size={20} />
              <span>Rechercher</span>
            </Link>
          </div>
        </motion.div>
      </section>
      
      <section id="categories" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Parcourir les catégories</h2>
            <p className="text-lg text-gray-600">Trouvez ce dont vous avez besoin.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categoriesData.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/categorie/${cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="group block text-center p-4 rounded-xl transition-transform duration-300 hover:-translate-y-2">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:shadow-lg" style={{ backgroundColor: `${cat.color}20` }}>
                    <span className="text-4xl" style={{ color: cat.color }}>{cat.icon}</span>
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: cat.color }}>{cat.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section id="recent-annonces" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Annonces récentes</h2>
            <p className="text-lg text-gray-600">Découvrez les dernières opportunités publiées.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {loadingAnnonces ? (
              Array(8).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="border-t my-2"></div>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              annonces.map(annonce => (
                <AnnonceCard key={annonce.id} annonce={annonce} showAnimation={true} />
              ))
            )}
          </div>
          
          {/* Bouton Load More */}
          <div className="text-center mt-16 space-y-4">
            {hasMore && !loadingAnnonces && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-green-700 text-white px-8 py-3 rounded-full font-bold transition hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? 'Chargement...' : 'Voir plus d\'annonces'}
              </button>
            )}
            
            <div>
              <Link to="/categories" className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-full font-bold transition hover:bg-green-700 hover:text-white inline-block">
                Voir toutes les annonces
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Comment ça marche ?</h2>
            <p className="text-lg text-gray-600">Publier et échanger en 3 étapes simples.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-green-700 text-4xl font-black">1</div>
              <h3 className="text-xl font-bold mb-2">Créez votre annonce</h3>
              <p className="text-gray-600">Choisissez une catégorie, ajoutez des photos et une description en moins de 2 minutes.</p>
            </div>
            <div className="p-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-green-700 text-4xl font-black">2</div>
              <h3 className="text-xl font-bold mb-2">Recevez des messages</h3>
              <p className="text-gray-600">Discutez avec des membres intéressés via notre messagerie sécurisée.</p>
            </div>
            <div className="p-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg text-green-700 text-4xl font-black">3</div>
              <h3 className="text-xl font-bold mb-2">Finalisez l'échange</h3>
              <p className="text-gray-600">Rencontrez-vous en personne ou finalisez la transaction en ligne en toute confiance.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="why-us" className="py-20 bg-gradient-to-br from-green-700 to-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Pourquoi choisir MBOA PLACE ?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {whyUsItems.map(item => (
              <div key={item.title} className="p-6">
                {typeof item.icon === 'string' ? (
                  <div className="text-5xl mb-4">{item.icon}</div>
                ) : (
                  <item.icon size={48} className="mx-auto mb-4" />
                )}
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Ils nous font confiance</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-8 shadow-sm"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <p className="italic text-gray-700 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img src={testimonial.avatar} alt={testimonial.author} className="w-14 h-14 rounded-full mr-4" />
                  <div>
                    <p className="font-bold">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.location} • {testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="cta-final" className="py-24 bg-green-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt à rejoindre la communauté ?</h2>
          <p className="text-xl opacity-80 mb-8 max-w-2xl mx-auto">Des milliers de membres publient et échangent chaque jour. Ne manquez aucune opportunité.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? "/publier" : "/connexion"} className="bg-[#FF6F00] hover:bg-[#E65100] text-white px-8 py-3 rounded-full font-bold transition text-lg">Publier une annonce</Link>
            <Link to={user ? "/profil" : "/inscription"} className="bg-transparent border-2 border-white hover:bg-white hover:text-black text-white px-8 py-3 rounded-full font-bold transition text-lg">
              {user ? 'Mon Profil' : 'Créer mon compte gratuit'}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
