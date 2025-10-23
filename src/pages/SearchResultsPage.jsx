import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Loader2, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import AnnonceCard from '@/components/AnnonceCard';
import AdvancedSearchModal from '@/components/AdvancedSearchModal';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Extraire les paramètres de recherche
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const condition = searchParams.get('condition') || '';
  const location = searchParams.get('location') || '';
  const cityParam = searchParams.get('city') || '';
  const locationFilter = location || cityParam;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        let queryBuilder = supabase
          .from('annonces')
          .select(`
            *,
            profiles!seller_id (full_name, avatar_url)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        // Filtrer par mot-clé
        if (query) {
          queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
        }

        // Filtrer par catégorie
        if (category) {
          queryBuilder = queryBuilder.eq('category', category);
        }

        // Filtrer par prix
        if (minPrice) {
          queryBuilder = queryBuilder.gte('price', parseFloat(minPrice));
        }
        if (maxPrice) {
          queryBuilder = queryBuilder.lte('price', parseFloat(maxPrice));
        }

        // Filtrer par état
        if (condition) {
          queryBuilder = queryBuilder.eq('condition', condition);
        }

        // Filtrer par ville/localisation
        if (locationFilter) {
          // Le schéma utilise généralement la colonne 'city'
          queryBuilder = queryBuilder.ilike('city', `%${locationFilter}%`);
        }

        const { data, error } = await queryBuilder;

        if (error) throw error;
        setAnnonces(data || []);
      } catch (error) {
        console.error('Error fetching search results:', error);
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de charger les résultats de recherche.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, category, minPrice, maxPrice, condition, location, toast]);

  const getSearchSummary = () => {
    const filters = [];
    if (query) filters.push(`"${query}"`);
    if (category) filters.push(category);
    if (minPrice || maxPrice) {
      const priceRange = minPrice && maxPrice 
        ? `${minPrice}-${maxPrice} FCFA`
        : minPrice 
        ? `À partir de ${minPrice} FCFA`
        : `Jusqu'à ${maxPrice} FCFA`;
      filters.push(priceRange);
    }
    if (condition) filters.push(condition.replace('_', ' '));
    if (locationFilter) filters.push(locationFilter);
    
    return filters.length > 0 ? filters.join(' • ') : 'Toutes les annonces';
  };

  return (
    <>
      <Helmet>
        <title>Résultats de recherche - MBOA PLACE</title>
        <meta name="description" content="Trouvez les meilleures annonces sur MBOA PLACE" />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold flex items-center">
                <Search size={32} className="mr-3 text-[#1B5E20]" />
                Résultats de recherche
              </h1>
              <button
                onClick={() => setShowAdvancedSearch(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-[#1B5E20] text-[#1B5E20] rounded-lg font-semibold hover:bg-green-50 transition"
              >
                <SlidersHorizontal size={20} />
                <span>Filtres avancés</span>
              </button>
            </div>
            
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-800">{annonces.length} résultat(s)</span> pour : {getSearchSummary()}
              </p>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-green-700" />
            </div>
          ) : annonces.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Search size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Aucun résultat trouvé</h2>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos critères de recherche ou explorez toutes nos annonces.
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-[#1B5E20] text-white rounded-lg font-semibold hover:bg-[#155017] transition"
              >
                Retour à l'accueil
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {annonces.map((annonce) => (
                <AnnonceCard key={annonce.id} annonce={annonce} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Advanced Search Modal */}
      <AdvancedSearchModal
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
      />
    </>
  );
};

export default SearchResultsPage;
