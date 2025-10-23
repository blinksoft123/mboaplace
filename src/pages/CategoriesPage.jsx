
    import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { DollarSign, Plane, ShoppingBag, Home, Briefcase, ArrowRight, Search, Zap, Loader2 } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/customSupabaseClient';
    import { categoriesData } from '@/data/categories';
    import logger from '@/utils/logger';
    import { ANNONCE_STATUS } from '@/utils/constants';

    const CategoriesPage = () => {
      const { toast } = useToast();
      const [categoryCounts, setCategoryCounts] = useState({});
      const [loading, setLoading] = useState(true);
      
      // Mapping des icônes
      const iconMap = {
        '💱': DollarSign,
        '✈️': Plane,
        '🛍️': ShoppingBag,
        '🏠': Home,
        '💼': Briefcase
      };

      // Mapping des descriptions
      const descriptions = {
        'Échanges & Transferts': 'Échangez des devises entre particuliers de la diaspora et le continent. Économisez sur les frais bancaires et bénéficiez de taux avantageux.',
        'Colis & Voyages': 'Confiez vos colis à des voyageurs vérifiés ou proposez vos services de transport. Solution économique et sécurisée pour vos envois.',
        'Commerce': 'Achetez et vendez des produits africains authentiques : beauté, alimentation, mode, artisanat. Soutenez les entrepreneurs de la diaspora.',
        'Immobilier': 'Trouvez votre logement idéal, investissez au pays ou proposez un accueil aux nouveaux arrivants. Ventes, locations et colocations.',
        'Emploi & Services': 'Offres d\'emploi locales et à distance, missions freelance, services professionnels. Développez votre carrière dans la communauté.'
      };

      useEffect(() => {
        fetchCategoryCounts();
      }, []);

      const fetchCategoryCounts = async () => {
        setLoading(true);
        try {
          // Récupérer le nombre d'annonces actives par catégorie (parallélisé)
          const countPromises = categoriesData.map(category =>
            supabase
              .from('annonces')
              .select('*', { count: 'exact', head: true })
              .eq('status', ANNONCE_STATUS.ACTIVE)
              .eq('category', category.name)
              .then(({ count, error }) => ({
                name: category.name,
                count: error ? 0 : (count || 0),
                error
              }))
          );

          const results = await Promise.all(countPromises);
          
          const counts = {};
          results.forEach(result => {
            counts[result.name] = result.count;
            if (result.error) {
              logger.error(`Error fetching count for ${result.name}:`, result.error);
            }
          });
          
          setCategoryCounts(counts);
        } catch (error) {
          logger.error('Error fetching category counts:', error);
        } finally {
          setLoading(false);
        }
      };

      // Construire les catégories avec les données réelles
      const categories = categoriesData.map((cat, index) => {
        const slug = cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
        const badges = ['Populaire', 'Nouveau', null, null, 'Populaire'];
        
        return {
          icon: iconMap[cat.icon] || Briefcase,
          title: cat.name,
          description: descriptions[cat.name] || '',
          subcategories: cat.subcategories,
          count: categoryCounts[cat.name] || 0,
          color: cat.color,
          slug: slug,
          badge: badges[index],
          buttonText: `Explorer ${cat.name.toLowerCase()}`
        };
      });

      const handleNotImplemented = () => {
        toast({
          title: "🚧 Fonctionnalité en cours de développement",
          description: "Cette fonctionnalité n'est pas encore implémentée. Revenez bientôt !",
        });
      };


      return (
        <>
        <Helmet >
          <title>Toutes les catégories - MBOA PLACE</title>
          <meta name="description" content="Parcourez toutes les catégories d'annonces sur MBOA PLACE" />
        </Helmet>

        <div className = "bg-white">
          <div className="container mx-auto px-4 pt-10 pb-16">
            <nav className="text-sm text-gray-600 mb-6">
              <Link to="/" className="hover:text-[#1B5E20]">Accueil</Link>
              <span className="mx-2">&gt;</span>
              <span className="text-gray-900 font-medium">Catégories</span>
            </nav>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Parcourir par catégorie</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">Trouvez exactement ce que vous cherchez parmi nos 5 catégories principales</p>
            </motion.div>

            <div className="mb-12">
              <div className="relative max-w-xl mx-auto">
                <input type="text" placeholder="Rechercher une catégorie ou un service..." className="w-full pl-5 pr-16 py-4 rounded-full border-2 border-gray-300 focus:border-[#1B5E20] focus:outline-none text-lg"/>
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1B5E20] text-white px-6 py-2.5 rounded-full font-semibold hover:bg-[#2E7D32] transition">
                  Rechercher
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-green-700" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden flex flex-col" style={{ border: `2px solid ${category.color}33` }}>
                  <Link to={`/categorie/${category.slug}`} className="p-8 h-full flex flex-col relative">
                    {category.badge && (
                      <span className="absolute top-4 right-4 bg-[#FF6F00] text-white text-xs px-3 py-1 rounded-full font-semibold">{category.badge}</span>
                    )}
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 self-center" style={{ backgroundColor: `${category.color}1A`}}>
                      <category.icon size={48} style={{ color: category.color }}/>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 text-center" style={{ color: category.color }}>{category.title}</h2>
                    <p className="text-gray-600 text-sm mb-4 flex-grow text-center">{category.description}</p>
                    <p className="font-semibold text-base mb-4 text-center" style={{ color: category.color }}>{category.count} annonces actives</p>
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <ul className="space-y-1">
                        {category.subcategories.slice(0, 3).map((sub, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start">
                            <span className="mr-2 text-gray-500">•</span>
                            <span>{sub}</span>
                          </li>
                        ))}
                         {category.subcategories.length > 3 && (
                            <li className="text-sm text-gray-500 font-medium">+ {category.subcategories.length - 3} autre{category.subcategories.length - 3 > 1 ? 's' : ''}</li>
                         )}
                      </ul>
                    </div>
                    <button className="mt-6 w-full text-white py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2" style={{ backgroundColor: category.color }}>
                      <span>{category.buttonText}</span>
                      <ArrowRight size={20}/>
                    </button>
                  </Link>
                </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white p-8 rounded-lg shadow-md text-center">
                <Search className="mx-auto mb-4 text-[#1B5E20]" size={40} />
                <h3 className="text-2xl font-bold mb-3">💡 Vous ne trouvez pas ce que vous cherchez ?</h3>
                <p className="text-gray-600 mb-6">Utilisez notre recherche avancée ou créez une alerte pour être notifié des nouvelles annonces correspondant à vos critères.</p>
                <button onClick={handleNotImplemented} className="font-semibold text-[#1B5E20] border-2 border-[#1B5E20] px-6 py-2 rounded-full hover:bg-[#1B5E20] hover:text-white transition">
                  Recherche avancée
                </button>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white p-8 rounded-lg shadow-md text-center">
                <Zap className="mx-auto mb-4 text-[#FF6F00]" size={40}/>
                <h3 className="text-2xl font-bold mb-3">🚀 Vous avez quelque chose à proposer ?</h3>
                <p className="text-gray-600 mb-6">Publiez votre annonce gratuitement en moins de 2 minutes et touchez des milliers de membres de la communauté.</p>
                <Link to="/publier" className="font-semibold text-white bg-[#FF6F00] px-6 py-2.5 rounded-full hover:bg-[#E65100] transition inline-block">
                  Publier une annonce
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
        </>
      );
    };

    export default CategoriesPage;
  