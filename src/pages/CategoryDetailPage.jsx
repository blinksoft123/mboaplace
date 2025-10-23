
    import React, { useState, useEffect } from 'react';
    import { Helmet } from 'react-helmet';
    import { useParams, Link } from 'react-router-dom';
    import { DollarSign, Grid, List, Bell, X, Loader2 } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { supabase } from '@/lib/customSupabaseClient';
    import { categoriesData } from '@/data/categories';
    import AnnonceCard from '@/components/AnnonceCard';
    import CityAutocomplete from '@/components/CityAutocomplete';
    import cacheManager from '@/utils/cache';
    import logger from '@/utils/logger';
    import { ANNONCE_STATUS, PAGINATION } from '@/utils/constants';

    const CategoryDetailPage = () => {
      const { slug } = useParams();
      const { toast } = useToast();
      const [viewMode, setViewMode] = useState('grid');
      const [sortBy, setSortBy] = useState('recent');
      const [annonces, setAnnonces] = useState([]);
      const [loading, setLoading] = useState(true);
      const [loadingMore, setLoadingMore] = useState(false);
      const [hasMore, setHasMore] = useState(true);
      const [page, setPage] = useState(0);
      const [selectedCity, setSelectedCity] = useState('');
      const [cityInputValue, setCityInputValue] = useState('');
      const [minPrice, setMinPrice] = useState('');
      const [maxPrice, setMaxPrice] = useState('');

      // Trouver la catégorie depuis le slug
      const categoryInfo = categoriesData.find(cat => 
        cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === slug
      );
      
      // Fallback si la catégorie n'est pas trouvée
      if (!categoryInfo) {
        logger.error('Category not found for slug:', slug);
        logger.log('Available categories:', categoriesData.map(c => ({
          name: c.name,
          slug: c.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
        })));
      }
      
      const categoryName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace('Et', '&');

      const finalCategoryInfo = categoryInfo || {
        name: categoryName,
        icon: '📋',
        color: '#1B5E20',
        subcategories: []
      };

      const fetchAnnonces = async (isLoadMore = false) => {
        if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        try {
          const currentPage = isLoadMore ? page + 1 : 0;
          const from = currentPage * PAGINATION.DEFAULT_PAGE_SIZE;
          const to = from + PAGINATION.DEFAULT_PAGE_SIZE - 1;

          logger.log('Fetching annonces for category:', finalCategoryInfo.name);
          let query = supabase
            .from('annonces')
            .select(`
              *,
              profiles!seller_id (full_name, avatar_url)
            `, { count: 'exact' })
            .eq('status', ANNONCE_STATUS.ACTIVE)
            .eq('category', finalCategoryInfo.name);

          // Appliquer les filtres
          if (selectedCity) {
            query = query.ilike('city', `%${selectedCity}%`);
          }
          if (minPrice) {
            query = query.gte('price', parseFloat(minPrice));
          }
          if (maxPrice) {
            query = query.lte('price', parseFloat(maxPrice));
          }

          // Appliquer le tri
          switch (sortBy) {
            case 'recent':
              query = query.order('created_at', { ascending: false });
              break;
            case 'price-asc':
              query = query.order('price', { ascending: true });
              break;
            case 'price-desc':
              query = query.order('price', { ascending: false });
              break;
            default:
              query = query.order('created_at', { ascending: false });
          }

          query = query.range(from, to);

          const { data, error, count } = await query;

          if (error) {
            logger.error('Supabase error:', error);
            throw error;
          }
          
          logger.log('Annonces fetched:', data?.length || 0);
          
          if (isLoadMore) {
            setAnnonces(prev => [...prev, ...data]);
            setPage(currentPage);
          } else {
            setAnnonces(data || []);
            setPage(0);
          }

          // Vérifier s'il reste des annonces
          const totalLoaded = isLoadMore ? annonces.length + data.length : data.length;
          setHasMore(totalLoaded < count);

        } catch (error) {
          logger.error('Error fetching annonces:', error);
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: `Impossible de charger les annonces: ${error.message || 'Erreur inconnue'}`
          });
        } finally {
          if (isLoadMore) {
            setLoadingMore(false);
          } else {
            setLoading(false);
          }
        }
      };

      const handleLoadMore = () => {
        fetchAnnonces(true);
      };

      useEffect(() => {
        if (finalCategoryInfo.name) {
          fetchAnnonces();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [finalCategoryInfo.name, sortBy, selectedCity, minPrice, maxPrice]);

      // Invalider le cache quand les filtres changent
      useEffect(() => {
        cacheManager.invalidateByPrefix(`category-${slug}`);
      }, [sortBy, selectedCity, minPrice, maxPrice, slug]);

      const handleApplyFilters = () => {
        fetchAnnonces();
      };

      const handleResetFilters = () => {
        setSelectedCity('');
        setCityInputValue('');
        setMinPrice('');
        setMaxPrice('');
        setSortBy('recent');
        setPage(0);
        setHasMore(true);
      };

      const handleCitySelect = (location) => {
        if (location && location.city) {
          setSelectedCity(location.city);
          setCityInputValue(`${location.city}, ${location.country}`);
        }
      };

      const handleNotImplemented = () => {
        toast({
          title: "🚧 Action non implémentée",
          description: "Cette fonctionnalité n'est pas encore disponible, mais nous y travaillons !",
        });
      };

      return (
        <>
          <Helmet>
            <title>{finalCategoryInfo.name} - MBOA PLACE</title>
            <meta name="description" content={`Parcourir les annonces dans la catégorie ${finalCategoryInfo.name}`} />
          </Helmet>

          <header className="py-16 text-white text-center bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] relative overflow-hidden">
             <div className="absolute inset-0 bg-black opacity-10"></div>
             <div className="container mx-auto px-4 relative z-10">
                <div className="text-6xl mb-4">{finalCategoryInfo.icon}</div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{finalCategoryInfo.name}</h1>
                <p className="font-semibold">{annonces.length} annonce{annonces.length > 1 ? 's' : ''} active{annonces.length > 1 ? 's' : ''}</p>
             </div>
          </header>

          <div className="bg-gray-50">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <aside className="lg:w-1/4">
                  <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-3">🔍 Filtrer les résultats</h3>
                      
                      <div className="space-y-4">
                        {finalCategoryInfo.subcategories && finalCategoryInfo.subcategories.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">SOUS-CATÉGORIES</h4>
                            <div className="space-y-2 text-sm">
                                <label className="flex items-center cursor-pointer">
                                  <input type="checkbox" className="w-4 h-4 text-[#1B5E20] rounded mr-2" defaultChecked/>
                                  <span>Tous</span>
                                </label>
                                {finalCategoryInfo.subcategories.slice(0, 4).map((subcat, idx) => (
                                  <label key={idx} className="flex items-center cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-[#1B5E20] rounded mr-2"/>
                                    <span>{subcat}</span>
                                  </label>
                                ))}
                            </div>
                          </div>
                        )}

                        <div className="border-t pt-4">
                            <h4 className="font-semibold text-gray-800 mb-2">VILLE</h4>
                            <CityAutocomplete 
                              onSelect={handleCitySelect}
                              initialValue={cityInputValue}
                            />
                            {selectedCity && (
                              <button
                                onClick={() => {
                                  setSelectedCity('');
                                  setCityInputValue('');
                                }}
                                className="mt-2 text-sm text-gray-600 hover:text-[#1B5E20] flex items-center"
                              >
                                <X size={14} className="mr-1" />
                                Effacer le filtre
                              </button>
                            )}
                        </div>
                        
                        <div className="border-t pt-4">
                            <h4 className="font-semibold text-gray-800 mb-2">PRIX</h4>
                            <div className="flex gap-2">
                                <input 
                                  type="number" 
                                  placeholder="Min" 
                                  value={minPrice}
                                  onChange={(e) => setMinPrice(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent text-sm"
                                />
                                <input 
                                  type="number" 
                                  placeholder="Max" 
                                  value={maxPrice}
                                  onChange={(e) => setMaxPrice(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        <div className="border-t pt-4">
                           <h4 className="font-semibold text-gray-800 mb-2">DEVISE</h4>
                           <div className="space-y-2 text-sm">
                                <label className="flex items-center"><input type="checkbox" className="w-4 h-4 text-[#1B5E20] rounded mr-2"/>CAD ↔ XAF</label>
                                <label className="flex items-center"><input type="checkbox" className="w-4 h-4 text-[#1B5E20] rounded mr-2"/>EUR ↔ XAF</label>
                                <label className="flex items-center"><input type="checkbox" className="w-4 h-4 text-[#1B5E20] rounded mr-2"/>USD ↔ XAF</label>
                                <label className="flex items-center"><input type="checkbox" className="w-4 h-4 text-[#1B5E20] rounded mr-2"/>Autre</label>
                           </div>
                        </div>
                        
                        <div className="border-t pt-4">
                           <h4 className="font-semibold text-gray-800 mb-2">DATE DE PUBLICATION</h4>
                           <div className="space-y-2 text-sm">
                                <label className="flex items-center"><input type="radio" name="date" className="w-4 h-4 text-[#1B5E20] mr-2"/>Dernières 24h</label>
                                <label className="flex items-center"><input type="radio" name="date" className="w-4 h-4 text-[#1B5E20] mr-2"/>Cette semaine</label>
                                <label className="flex items-center"><input type="radio" name="date" className="w-4 h-4 text-[#1B5E20] mr-2"/>Ce mois-ci</label>
                                <label className="flex items-center"><input type="radio" name="date" className="w-4 h-4 text-[#1B5E20] mr-2" defaultChecked/>Tout afficher</label>
                           </div>
                        </div>

                        <div className="border-t pt-4">
                           <h4 className="font-semibold text-gray-800 mb-2">VENDEUR</h4>
                           <div className="space-y-2 text-sm">
                                <label className="flex items-center"><input type="checkbox" className="w-4 h-4 text-[#1B5E20] rounded mr-2"/>Vérifiés uniquement</label>
                                <label className="flex items-center"><input type="checkbox" className="w-4 h-4 text-[#1B5E20] rounded mr-2"/>Avec avis positifs</label>
                           </div>
                        </div>
                        
                      </div>
                    </div>
                    <div className="mt-6">
                        <button 
                          onClick={handleApplyFilters}
                          className="w-full bg-[#1B5E20] hover:bg-[#2E7D32] text-white py-3 rounded-lg font-semibold transition"
                        >
                          Appliquer les filtres
                        </button>
                        <button 
                          onClick={handleResetFilters}
                          className="w-full text-sm text-gray-600 mt-2 hover:underline"
                        >
                          Réinitialiser
                        </button>
                    </div>

                    <div className="mt-8 border-t-2 border-dashed pt-6 bg-green-50 p-4 rounded-lg text-center">
                        <h4 className="font-bold text-lg mb-2">💎 Passez Premium</h4>
                        <ul className="text-sm text-gray-700 space-y-1 list-inside list-disc text-left mb-4">
                            <li>Annonces illimitées</li>
                            <li>Remontée automatique</li>
                            <li>Badge vérifié</li>
                        </ul>
                        <p className="text-lg font-bold mb-3">10 CAD/mois</p>
                        <Link to="/premium" className="font-semibold text-[#1B5E20] text-sm hover:underline">En savoir plus</Link>
                    </div>
                  </div>
                </aside>

                <main className="lg:w-3/4">
                  <div className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                        <div>
                            <span className="font-bold">{annonces.length} résultat{annonces.length > 1 ? 's' : ''}</span>
                            {(selectedCity || minPrice || maxPrice) && (
                              <div className="inline-flex items-center gap-2 ml-4">
                                {selectedCity && (
                                  <span className="bg-gray-200 text-gray-700 px-2 py-1 text-sm rounded-full flex items-center">
                                    {selectedCity} 
                                    <X size={12} className="ml-1 cursor-pointer" onClick={() => setSelectedCity('')}/>
                                  </span>
                                )}
                                {(minPrice || maxPrice) && (
                                  <span className="bg-gray-200 text-gray-700 px-2 py-1 text-sm rounded-full flex items-center">
                                    Prix: {minPrice || '0'} - {maxPrice || '∞'} 
                                    <X size={12} className="ml-1 cursor-pointer" onClick={() => { setMinPrice(''); setMaxPrice(''); }}/>
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                        <button onClick={handleNotImplemented} className="border-2 border-[#1B5E20] text-[#1B5E20] px-4 py-2 rounded-full font-semibold text-sm hover:bg-green-50 transition flex items-center gap-2">
                            <Bell size={16}/> Créer une alerte
                        </button>
                    </div>
                     <div className="flex flex-col sm:flex-row justify-between items-center gap-2 border-t pt-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort" className="text-sm font-medium">Trier par :</label>
                            <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#1B5E20] focus:border-transparent">
                               <option value="recent">Plus récent</option>
                               <option value="price-asc">Prix croissant</option>
                               <option value="price-desc">Prix décroissant</option>
                               <option value="relevant">Plus pertinent</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-medium">Vue:</span>
                           <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-[#1B5E20] text-white' : 'bg-gray-100'}`}><Grid size={20} /></button>
                           <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-[#1B5E20] text-white' : 'bg-gray-100'}`}><List size={20} /></button>
                        </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-20">
                      <Loader2 className="h-12 w-12 animate-spin text-green-700" />
                    </div>
                  ) : annonces.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                      <p className="text-xl font-bold text-gray-800 mb-2">Aucune annonce trouvée</p>
                      <p className="text-gray-600 mb-6">
                        Essayez de modifier vos critères de recherche.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="inline-block px-6 py-3 bg-[#1B5E20] text-white rounded-lg font-semibold hover:bg-[#155017] transition"
                      >
                        Réinitialiser les filtres
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                        {annonces.map((annonce) => (
                          <AnnonceCard key={annonce.id} annonce={annonce} showAnimation={false} />
                        ))}
                      </div>
                      
                      {/* Bouton Load More */}
                      {hasMore && (
                        <div className="mt-8 text-center">
                          <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className="bg-green-700 text-white px-8 py-3 rounded-full font-bold transition hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingMore ? 'Chargement...' : 'Voir plus d\'annonces'}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </main>
              </div>
            </div>
          </div>
        </>
      );
    };

    export default CategoryDetailPage;
  