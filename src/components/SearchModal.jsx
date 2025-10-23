
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CityAutocomplete from './CityAutocomplete';

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [cityInputValue, setCityInputValue] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [withPhotos, setWithPhotos] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (category) params.append('category', category);
    if (city) params.append('city', city);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (dateFilter !== 'all') params.append('date', dateFilter);
    if (withPhotos) params.append('photos', 'true');
    if (verifiedOnly) params.append('verified', 'true');

    navigate(`/recherche?${params.toString()}`);
    onClose();
  };

  const handleReset = () => {
    setSearchTerm('');
    setCategory('');
    setCity('');
    setCityInputValue('');
    setMinPrice('');
    setMaxPrice('');
    setDateFilter('all');
    setWithPhotos(false);
    setVerifiedOnly(false);
  };

  const handleCitySelect = (location) => {
    if (location && location.city) {
      setCity(location.city);
      setCityInputValue(`${location.city}, ${location.country}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🔍 Recherche avancée</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mot-clé</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ex: change CAD XAF"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent"
              >
                <option value="">Toutes les catégories</option>
                <option value="echanges">Échanges & Transferts</option>
                <option value="colis">Colis & Voyages</option>
                <option value="commerce">Commerce</option>
                <option value="immobilier">Immobilier</option>
                <option value="emploi">Emploi & Services</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
              <CityAutocomplete 
                onSelect={handleCitySelect}
                initialValue={cityInputValue}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix min ($)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prix max ($)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="10000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B5E20] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: '24h', label: '24h' },
                  { value: 'week', label: 'Semaine' },
                  { value: 'month', label: 'Mois' },
                  { value: 'all', label: 'Tout' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDateFilter(option.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      dateFilter === option.value
                        ? 'bg-[#1B5E20] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={withPhotos}
                  onChange={(e) => setWithPhotos(e.target.checked)}
                  className="w-4 h-4 text-[#1B5E20] border-gray-300 rounded focus:ring-[#1B5E20]"
                />
                <span className="text-sm text-gray-700">Avec photos uniquement</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 text-[#1B5E20] border-gray-300 rounded focus:ring-[#1B5E20]"
                />
                <span className="text-sm text-gray-700">Vendeurs vérifiés seulement</span>
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Réinitialiser
              </button>
              <button
                onClick={handleSearch}
                className="flex-1 px-6 py-3 bg-[#1B5E20] hover:bg-[#2E7D32] text-white rounded-lg font-semibold transition flex items-center justify-center space-x-2"
              >
                <Search size={20} />
                <span>RECHERCHER</span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
  