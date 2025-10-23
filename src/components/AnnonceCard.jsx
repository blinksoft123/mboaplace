import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import FavoriteButton from './FavoriteButton';
import OptimizedImage from './OptimizedImage';
import { timeAgo } from '@/utils/dateHelpers';

const getCategoryIcon = (category) => {
  const icons = {
    'Véhicules': '🚗',
    'Immobilier': '🏠',
    'Électronique': '📱',
    'Mode & Beauté': '👗',
    'Emploi & Services': '💼',
    'Maison & Jardin': '🛋️',
    'Loisirs & Sports': '⚽',
    'Livres & Médias': '📚',
    'Famille & Enfants': '👶',
    'Animaux': '🐾',
    'Alimentation': '🍽️',
    'Éducation': '🎓',
    'Santé & Bien-être': '💊',
    'Voyages': '✈️',
    'Événements': '🎉'
  };
  return icons[category] || '📦';
};

const AnnonceCard = ({ annonce, showAnimation = false }) => {
  const CardWrapper = showAnimation ? motion.div : 'div';
  const animationProps = showAnimation ? {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  } : {};

  return (
    <CardWrapper
      {...animationProps}
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
    >
      <Link to={`/annonce/${annonce.id}`} className="block h-full flex flex-col">
        <div className="relative">
          <div className="w-full h-52 bg-gray-200">
            <OptimizedImage 
              src={annonce.images_urls?.[0] || 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop'} 
              alt={annonce.title} 
              className="w-full h-full object-cover"
              lazy={true}
              aspectRatio={null}
            />
          </div>
          <span className="absolute top-3 left-3 bg-black bg-opacity-50 text-white text-2xl px-3 py-1 rounded-md backdrop-blur-sm">
            {getCategoryIcon(annonce.category)}
          </span>
          <FavoriteButton 
            annonceId={annonce.id} 
            className="absolute top-3 right-3 bg-black bg-opacity-40 p-2 rounded-full hover:bg-white"
            size={20}
          />
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-bold text-md mb-2 h-12 line-clamp-2">{annonce.title}</h3>
          <p className="text-xl font-bold text-green-700 mb-3">
            {annonce.is_free ? 'Gratuit' : `${annonce.price} ${annonce.currency || 'CAD'}`}
          </p>
          <div className="text-sm text-gray-500 space-y-1 mb-4">
            <p className="flex items-center">
              <MapPin size={14} className="mr-2" />
              {annonce.city || "Non spécifié"}
            </p>
            <p className="flex items-center">
              <Clock size={14} className="mr-2" />
              Il y a {timeAgo(annonce.created_at)}
            </p>
          </div>
          <div className="border-t mt-auto pt-3 flex items-center space-x-3">
            <OptimizedImage 
              src={annonce.profiles?.avatar_url || 'https://i.pravatar.cc/30'} 
              alt={annonce.profiles?.full_name} 
              className="w-8 h-8 rounded-full object-cover" 
              lazy={true}
            />
            <span className="text-sm font-medium text-gray-800">
              {annonce.profiles?.full_name || "Anonyme"}
            </span>
          </div>
        </div>
      </Link>
    </CardWrapper>
  );
};

export default AnnonceCard;
