import React from 'react';
import { Food } from '../../api/types';
import FavoriteButton from '../favorites/FavoriteButton';
import NutritionInfo from './NutritionInfo';

interface FoodCardProps {
  food: Food;
  onClick: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ food, onClick }) => {
  // Use brand_owner as title when brand_name is null
  const displayName = food.brand_name || food.brand_owner || 'Unnamed Food';
  
  return (
    <div onClick={onClick} className="border rounded-lg p-4 hover:shadow-md cursor-pointer">
      <h3 className="font-medium text-lg">{displayName}</h3>
      
      {/* Only show brand_owner as subtitle if it's different from the title */}
      {food.brand_owner && displayName !== food.brand_owner && (
        <p className="text-gray-600">{food.brand_owner}</p>
      )}
      
      {/* Add category if available */}
      {food.branded_food_category && (
        <p className="text-gray-500 text-sm">{food.branded_food_category}</p>
      )}
      
      <div className="mt-2">
        <p>Calories: {food.calories.toFixed(0)}</p>
        <p>Protein: {food.protein.toFixed(1)}g</p>
        <p>Fat: {food.fat.toFixed(1)}g</p>
        <p>Carbs: {food.carbohydrates.toFixed(1)}g</p>
      </div>
    </div>
  );
};

export default FoodCard;