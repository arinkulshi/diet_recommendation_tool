import React, { useContext } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import { UserContext } from '../../context/UserContext';
import FoodCard from '../foods/FoodCard';

const FavoritesList: React.FC = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { favorites, isLoading, isError, removeFromFavorites } = useFavorites();

  if (!isLoggedIn) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-600">Please log in to view your favorites.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <p className="text-red-600">Error loading favorites. Please try again.</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-yellow-700">You haven't saved any favorites yet.</p>
        <p className="text-yellow-600 mt-2">Search for foods and click the heart icon to add them to your favorites.</p>
      </div>
    );
  }

  // Handler for food card click in favorites list
  const handleFoodClick = (foodId: string) => {
    // Navigate to food detail or perform other actions
    console.log(`Clicked food with id: ${foodId}`);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your Favorite Foods</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((food) => (
          <FoodCard 
            key={food.favorite_id} 
            food={food} 
            onClick={() => handleFoodClick(food.id)}
            showFavoriteButton={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;