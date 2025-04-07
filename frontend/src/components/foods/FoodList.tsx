import React from 'react';
import { useFoods } from '../../hooks/useFoods';
import FoodCard from './FoodCard';

const FoodList: React.FC = () => {
  const {
    foods,
    pagination,
    isLoading,
    isError,
    setSelectedFood,
    nextPage,
    previousPage
  } = useFoods();

  // Modified filtering logic that shows items with brand_owner when brand_name is null
  const filteredFoods = foods.filter(food => {
    // Include items that have a brand_owner, even if brand_name is null
    if (food.brand_owner && food.brand_owner.trim() !== '') {
      return true;
    }
    
    // If there is a brand_name, check that it's not a placeholder
    if (food.brand_name) {
      const lowerBrandName = food.brand_name.toLowerCase();
      return !(
        lowerBrandName === 'unnamed food' ||
        lowerBrandName === 'unknown' ||
        lowerBrandName === 'n/a'
      );
    }
    
    return false;
  });

  console.log("Raw foods from API:", foods);
  console.log("Filtered foods:", filteredFoods);
  console.log("Is loading:", isLoading);
  console.log("Is error:", isError);
  console.log("Pagination:", pagination);

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
        <p className="text-red-600">Error loading foods. Please try again.</p>
      </div>
    );
  }

  if (filteredFoods.length === 0) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-yellow-700">No foods found. Try a different search term.</p>
        {foods.length > 0 && (
          <p className="text-yellow-600 mt-2">
            Found {foods.length} items, but none with valid brand information.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFoods.map((food) => (
          <FoodCard
            key={food.id}
            food={food}
            onClick={() => setSelectedFood(food)}
          />
        ))}
      </div>

      {pagination && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Showing {pagination.offset + 1} to{' '}
            {Math.min(pagination.offset + pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={previousPage}
              disabled={pagination.offset === 0}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={nextPage}
              disabled={pagination.offset + pagination.limit >= pagination.total}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodList;