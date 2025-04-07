import React from 'react';
import FavoritesList from '../components/favorites/FavoritesList';

const FavoritesPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Favorite Foods</h1>
      <FavoritesList />
    </div>
  );
};

export default FavoritesPage;