import React from 'react';

/**
 * Skeleton loader de base
 */
export const Skeleton = ({ className = "", width = "100%", height = "20px" }) => (
  <div
    className={`bg-gray-300 animate-pulse rounded ${className}`}
    style={{ width, height }}
  />
);

/**
 * Skeleton pour une carte d'annonce
 */
export const AnnonceCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 animate-pulse">
    {/* Image */}
    <div className="w-full h-48 bg-gray-300" />
    
    {/* Contenu */}
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-6 bg-gray-300 rounded w-1/2" />
      <div className="h-4 bg-gray-300 rounded w-full" />
      
      <div className="border-t my-2" />
      
      {/* Profile */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <div className="h-4 bg-gray-300 rounded w-1/3" />
      </div>
    </div>
  </div>
);

/**
 * Skeleton pour un profil utilisateur
 */
export const ProfileSkeleton = () => (
  <div className="flex items-center space-x-4 animate-pulse">
    <div className="w-16 h-16 bg-gray-300 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-300 rounded w-1/2" />
      <div className="h-3 bg-gray-300 rounded w-1/3" />
    </div>
  </div>
);

/**
 * Skeleton pour une liste d'annonces
 */
export const AnnonceListSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {Array(count).fill(0).map((_, index) => (
      <AnnonceCardSkeleton key={index} />
    ))}
  </div>
);

/**
 * Skeleton pour un message
 */
export const MessageSkeleton = () => (
  <div className="p-4 border-b border-gray-200 animate-pulse">
    <div className="flex items-start space-x-3">
      <div className="w-10 h-10 bg-gray-300 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/4" />
        <div className="h-3 bg-gray-300 rounded w-full" />
        <div className="h-3 bg-gray-300 rounded w-3/4" />
      </div>
    </div>
  </div>
);

/**
 * Skeleton pour une ligne de tableau
 */
export const TableRowSkeleton = ({ columns = 4 }) => (
  <tr className="animate-pulse">
    {Array(columns).fill(0).map((_, index) => (
      <td key={index} className="px-6 py-4">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
      </td>
    ))}
  </tr>
);

/**
 * Skeleton pour un détail d'annonce
 */
export const AnnonceDetailSkeleton = () => (
  <div className="animate-pulse space-y-6">
    {/* Images */}
    <div className="w-full h-96 bg-gray-300 rounded-lg" />
    
    {/* Titre et prix */}
    <div className="space-y-3">
      <div className="h-8 bg-gray-300 rounded w-3/4" />
      <div className="h-10 bg-gray-300 rounded w-1/3" />
    </div>
    
    {/* Description */}
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-5/6" />
    </div>
    
    {/* Informations */}
    <div className="grid grid-cols-2 gap-4">
      <div className="h-4 bg-gray-300 rounded" />
      <div className="h-4 bg-gray-300 rounded" />
      <div className="h-4 bg-gray-300 rounded" />
      <div className="h-4 bg-gray-300 rounded" />
    </div>
  </div>
);

/**
 * Skeleton pour une catégorie
 */
export const CategoryCardSkeleton = () => (
  <div className="text-center p-4 animate-pulse">
    <div className="w-24 h-24 rounded-full bg-gray-300 mx-auto mb-4" />
    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
  </div>
);

/**
 * Skeleton générique pour du texte
 */
export const TextSkeleton = ({ lines = 3 }) => (
  <div className="space-y-2 animate-pulse">
    {Array(lines).fill(0).map((_, index) => (
      <div
        key={index}
        className="h-4 bg-gray-300 rounded"
        style={{ width: index === lines - 1 ? '75%' : '100%' }}
      />
    ))}
  </div>
);

export default {
  Skeleton,
  AnnonceCardSkeleton,
  ProfileSkeleton,
  AnnonceListSkeleton,
  MessageSkeleton,
  TableRowSkeleton,
  AnnonceDetailSkeleton,
  CategoryCardSkeleton,
  TextSkeleton
};
