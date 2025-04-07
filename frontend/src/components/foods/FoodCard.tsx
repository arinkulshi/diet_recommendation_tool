import React from 'react';
import { Food } from '../../api/types';
import { useFavorites } from '../../hooks/useFavorites';

interface FoodCardProps {
  food: Food;
  onClick: () => void;
  showFavoriteButton?: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, onClick, showFavoriteButton = true }) => {
  const { 
    isFavorite, 
    getFavoriteId, 
    addToFavorites, 
    removeFromFavorites,
    isAddingToFavorites,
    isRemovingFromFavorites
  } = useFavorites();
  // Ensure we always have valid data to display
  const safeFood = {
    brand_name: food.brand_name || '',
    brand_owner: food.brand_owner || 'Unknown Brand',
    branded_food_category: food.branded_food_category || 'Uncategorized',
    calories: isNaN(food.calories) ? 0 : food.calories,
    protein: isNaN(food.protein) ? 0 : food.protein,
    fat: isNaN(food.fat) ? 0 : food.fat,
    carbohydrates: isNaN(food.carbohydrates) ? 0 : food.carbohydrates,
    serving_size: food.serving_size || 0,
    serving_size_unit: food.serving_size_unit || 'g'
  };
  
  // Use brand_owner as main display name when brand_name is null
  const displayName = safeFood.brand_name || safeFood.brand_owner;
  
  // Calculate nutrition percentage for visual bars (max 100%)
  const proteinPercentage = Math.min(safeFood.protein * 2.5, 100);
  const fatPercentage = Math.min(safeFood.fat * 1.1, 100);
  const carbsPercentage = Math.min(safeFood.carbohydrates / 2, 100);
  
  // Determine color based on food category (simplified approach)
  const getCategoryColor = () => {
    const category = safeFood.branded_food_category.toLowerCase();
    if (category.includes('fruit') || category.includes('vegetable')) return 'bg-green-100 border-green-200';
    if (category.includes('meat') || category.includes('protein')) return 'bg-red-50 border-red-200';
    if (category.includes('dairy')) return 'bg-blue-50 border-blue-200';
    if (category.includes('snack') || category.includes('dessert')) return 'bg-yellow-50 border-yellow-200';
    if (category.includes('beverage') || category.includes('drink')) return 'bg-purple-50 border-purple-200';
    return 'bg-gray-50 border-gray-200';
  };
  
  // Check if this food is in favorites
  const foodInFavorites = isFavorite(food.id);
  const favoriteId = getFavoriteId(food.id);
  
  // Handle favorite toggle without triggering the onClick for the whole card
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (foodInFavorites && favoriteId) {
      removeFromFavorites(favoriteId);
    } else {
      addToFavorites(food.id);
    }
  };
  
  // Log card rendering for debugging
  console.log("Rendering FoodCard for:", displayName);
  
  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-xl p-5 hover:shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${getCategoryColor()} relative`}
    >
      {/* Favorite Button */}
      {showFavoriteButton && (
        <button
          onClick={handleFavoriteToggle}
          disabled={isAddingToFavorites || isRemovingFromFavorites}
          className="absolute top-3 right-3 z-10 text-2xl transition-colors duration-200 focus:outline-none"
          aria-label={foodInFavorites ? "Remove from favorites" : "Add to favorites"}
        >
          {isAddingToFavorites || isRemovingFromFavorites ? (
            <span className="text-gray-400">
              <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18l-1.45-1.315C3.4 12.175 0 9.235 0 5.5 0 2.42 2.42 0 5.5 0c1.74 0 3.41.81 4.5 2.09C11.09.81 12.76 0 14.5 0 17.58 0 20 2.42 20 5.5c0 3.735-3.4 6.675-8.55 11.185L10 18z"/>
              </svg>
            </span>
          ) : foodInFavorites ? (
            <span className="text-red-500 hover:text-red-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18l-1.45-1.315C3.4 12.175 0 9.235 0 5.5 0 2.42 2.42 0 5.5 0c1.74 0 3.41.81 4.5 2.09C11.09.81 12.76 0 14.5 0 17.58 0 20 2.42 20 5.5c0 3.735-3.4 6.675-8.55 11.185L10 18z"/>
              </svg>
            </span>
          ) : (
            <span className="text-gray-400 hover:text-red-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </span>
          )}
        </button>
      )}

      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{displayName}</h3>
          
          {/* Only show brand_owner as subtitle if it's different from the display name */}
          {safeFood.brand_owner && displayName !== safeFood.brand_owner && (
            <p className="text-gray-600 text-sm">{safeFood.brand_owner}</p>
          )}
        </div>
        
        {/* Calorie badge */}
        <div className="flex flex-col items-center justify-center bg-white rounded-full h-14 w-14 border-2 border-gray-200 shadow-sm">
          <span className="font-bold text-lg text-gray-800">{safeFood.calories.toFixed(0)}</span>
          <span className="text-xs text-gray-500">cal</span>
        </div>
      </div>
      
      {/* Show category if available */}
      {safeFood.branded_food_category && safeFood.branded_food_category !== 'Uncategorized' && (
        <div className="mt-2">
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-white text-gray-700">
            {safeFood.branded_food_category}
          </span>
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Nutrition per serving</h4>
        
        {/* Protein bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">Protein</span>
            <span>{safeFood.protein.toFixed(1)}g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${proteinPercentage}%` }}></div>
          </div>
        </div>
        
        {/* Fat bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">Fat</span>
            <span>{safeFood.fat.toFixed(1)}g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${fatPercentage}%` }}></div>
          </div>
        </div>
        
        {/* Carbs bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium">Carbs</span>
            <span>{safeFood.carbohydrates.toFixed(1)}g</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${carbsPercentage}%` }}></div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-3 flex items-center justify-end">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
          </svg>
          {safeFood.serving_size} {safeFood.serving_size_unit}
        </p>
      </div>
    </div>
  );
};

export default FoodCard;