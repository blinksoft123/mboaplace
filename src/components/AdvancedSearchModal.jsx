import React, { useState } from 'react';
import { X, Search, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CityAutocomplete from './CityAutocomplete';

const CATEGORIES = [
  'Électronique',
  'Véhicules',
  'Immobilier',
  'Mode',
  'Maison',
  'Emploi',
  'Services',
  'Loisirs',
  'Animaux',
  'Autres'
];

const CONDITIONS = [
  { value: 'neuf', label: 'Neuf' },
  { value: 'tres_bon', label: 'Très bon état' },
  { value: 'bon', label: 'Bon état' },
  { value: 'acceptable', label: 'État acceptable' }
];

const AdvancedSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    query: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    location: ''
  });
  const [cityInputValue, setCityInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construire les paramètres de recherche
    const params = new URLSearchParams();
    
    if (formData.query) params.append('q', formData.query);
    if (formData.category) params.append('category', formData.category);
    if (formData.minPrice) params.append('minPrice', formData.minPrice);
    if (formData.maxPrice) params.append('maxPrice', formData.maxPrice);
    if (formData.condition) params.append('condition', formData.condition);
    if (formData.location) params.append('location', formData.location);

    // Naviguer vers la page de résultats
    navigate(`/search?${params.toString()}`);
    onClose();
  };

  const handleReset = () => {
    setFormData({
      query: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      location: ''
    });
    setCityInputValue('');
  };

  const handleCitySelect = (location) => {
    if (location && location.city) {
      setFormData({ ...formData, location: location.city });
      setCityInputValue(`${location.city}, ${location.country}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SlidersHorizontal className="text-[#1B5E20]" size={24} />
                  <h2 className="text-2xl font-bold text-gray-800">Recherche avancée</h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Recherche par mot-clé */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mots-clés
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Ex: iPhone, voiture, appartement..."
                      value={formData.query}
                      onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Toutes les catégories</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prix */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fourchette de prix (FCFA)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Prix min"
                      value={formData.minPrice}
                      onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Prix max"
                      value={formData.maxPrice}
                      onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* État */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    État du produit
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {CONDITIONS.map((cond) => (
                      <button
                        key={cond.value}
                        type="button"
                        onClick={() => setFormData({ 
                          ...formData, 
                          condition: formData.condition === cond.value ? '' : cond.value 
                        })}
                        className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                          formData.condition === cond.value
                            ? 'border-[#1B5E20] bg-green-50 text-[#1B5E20]'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {cond.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Localisation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Localisation
                  </label>
                  <CityAutocomplete 
                    onSelect={handleCitySelect}
                    initialValue={cityInputValue}
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Réinitialiser
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-6 bg-[#1B5E20] text-white rounded-lg font-semibold hover:bg-[#155017] transition flex items-center justify-center space-x-2"
                  >
                    <Search size={20} />
                    <span>Rechercher</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdvancedSearchModal;
