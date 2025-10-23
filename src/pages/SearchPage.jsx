
import React from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X, Bell, Frown } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const city = searchParams.get('city');

  const hasResults = false;

  return (
    <>
      <Helmet>
        <title>Résultats de recherche pour "{query}" - MBOA PLACE</title>
        <meta name="description" content={`Recherchez des annonces pour "${query}" sur MBOA PLACE.`} />
      </Helmet>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {hasResults ? '142' : '0'} résultats pour "{query}" {city && `à ${city}`}
            </h1>

            <div className="flex flex-wrap gap-2 mb-8">
              {city && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                  <span>{city}</span>
                  <button className="hover:text-red-500"><X size={16} /></button>
                </div>
              )}
              {searchParams.get('date') === 'week' && (
                <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                  <span>Cette semaine</span>
                  <button className="hover:text-red-500"><X size={16} /></button>
                </div>
              )}
            </div>

            {hasResults ? (
              <div>
                <p>Affichage des résultats de la recherche ici...</p>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <Frown size={64} className="mx-auto text-gray-400 mb-6" />
                <h2 className="text-2xl font-bold mb-4">😕 Aucune annonce trouvée</h2>
                <p className="text-gray-600 mb-6">Essayez d'élargir votre recherche, de vérifier l'orthographe ou d'utiliser des mots-clés différents.</p>
                <button className="flex items-center justify-center space-x-2 mx-auto bg-[#1B5E20] hover:bg-[#2E7D32] text-white px-6 py-3 rounded-lg font-semibold transition">
                  <Bell size={20} />
                  <span>Créer une alerte</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
