import React, { useContext } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import { UserContext } from '../../context/UserContext';

interface FavoriteButtonProps {
  foodId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ foodId }) => {
  const { isLoggedIn } = useContext(UserContext);
  const { 
    isFavorite, 
    getFavoriteId,
    addToFavorites, 
    removeFromFavorites,
    isAddingToFavorites,
    isRemovingFromFavorites
  } = useFavorites();

  const isThisFoodFavorite = isFavorite(foodId);
  const favoriteId = getFavoriteId(foodId);
  const isLoading = isAddingToFavorites || isRemovingFromFavorites;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking favorite button
    
    if (!isLoggedIn) {
      // Show login prompt or tooltip
      alert('Please log in to save favorites');
      return;
    }

    if (isThisFoodFavorite && favoriteId) {
      removeFromFavorites(favoriteId);
    } else {
      addToFavorites(foodId);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isThisFoodFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isThisFoodFavorite ? (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path 
            fillRule="evenodd" 
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
            clipRule="evenodd" 
          />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
          />
        </svg>
      )}
    </button>
  );
};

export default FavoriteButton;