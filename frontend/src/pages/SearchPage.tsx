import React from 'react';
import FoodSearch from '../components/foods/FoodSearch';
import FoodList from '../components/foods/FoodList';
import { useFoods } from '../hooks/useFoods';
import NutritionInfo from '../components/foods/NutritionInfo';

const SearchPage: React.FC = () => {
  const { selectedFood, setSelectedFood } = useFoods();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nutrition Database</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FoodSearch />
          
          {selectedFood && (
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{selectedFood.brand_name}</h2>
                <button 
                  onClick={() => setSelectedFood(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-600 text-sm">{selectedFood.brand_owner}</p>
              <p className="text-gray-500 text-xs mt-1">{selectedFood.branded_food_category}</p>
              
              <div className="mt-4">
              <NutritionInfo 
  food={{
    ...selectedFood,
    id: selectedFood.id.toString() // Convert number to string
  }} 
  detailed={true} 
/>
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <FoodList />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;