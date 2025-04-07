import React, { useState, useEffect } from 'react';
import FoodCard from '../components/foods/FoodCard';
import NutritionInfo from '../components/foods/NutritionInfo';

// Define types to match your application
interface Food {
  id: number;
  brand_name: string | null;
  brand_owner: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
  serving_size: number;
  serving_size_unit: string;
  branded_food_category: string | null;
}

interface Pagination {
  total: number;
  limit: number;
  offset: number;
}

const SearchPage: React.FC = () => {
  // State management without React Query
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Function to handle search directly
  const handleSearch = async (query: string) => {
    console.log('Searching for:', query);
    setIsLoading(true);
    setError(null);
    
    try {
      // Direct fetch call to your API
      const response = await fetch(`/api/foods/search?query=${encodeURIComponent(query)}&limit=20&offset=0`);
      
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search results:', data);
      
      setFoods(data.results.map(food => ({
        ...food,
        id: food.id.toString()
      })));
      setPagination(data.pagination || null);
      setSearchTerm(query);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/foods/search?limit=20&offset=0');
        if (!response.ok) {
          throw new Error(`Initial fetch failed with status: ${response.status}`);
        }
        const data = await response.json();
        setFoods(data.results.map(food => ({
          ...food,
          id: food.id.toString()
        })));
        setPagination(data.pagination || null);
      } catch (err) {
        console.error('Initial fetch error:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Filter foods to show only those with valid brand information
  const filteredFoods = foods.filter(food => food.brand_owner && food.brand_owner.trim() !== '');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nutrition Database</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {/* Simplified search component */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Search Foods</h2>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch((e.currentTarget.elements.namedItem('search') as HTMLInputElement).value);
              }} 
              className="space-y-4"
            >
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Food Name
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  placeholder="Search for foods..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Search
              </button>
            </form>
            
            {isLoading && (
              <div className="mt-4 p-2 bg-blue-50 rounded text-blue-700 text-center">
                Searching...
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-2 bg-red-50 rounded text-red-700">
                Error: {error.message}
              </div>
            )}
          </div>
          
          {selectedFood && (
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{selectedFood.brand_name || selectedFood.brand_owner}</h2>
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
          {/* Search results */}
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredFoods.length === 0 ? (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-700">No foods found. Try a different search term.</p>
                {searchTerm && (
                  <p className="text-yellow-600 mt-2">
                    No results found for "{searchTerm}"
                  </p>
                )}
                {foods.length > 0 && (
                  <p className="text-yellow-600 mt-2">
                    Found {foods.length} items, but none with valid brand information.
                  </p>
                )}
              </div>
            ) : (
              <>
                {searchTerm && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <h2 className="text-lg font-medium text-blue-800">
                      Results for: "{searchTerm}"
                    </h2>
                    <p className="text-sm text-blue-600">
                      Found {filteredFoods.length} items
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFoods.map((food) => (
                    <FoodCard
                      key={food.id}
                      food={{
                        ...food,
                        id: food.id.toString()
                      }}
                      onClick={() => setSelectedFood(food)}
                    />
                  ))}
                </div>
                
                {pagination && pagination.total > pagination.limit && (
                  <div className="flex justify-between items-center mt-6">
                    <p className="text-sm text-gray-600">
                      Showing {pagination.offset + 1} to{' '}
                      {Math.min(pagination.offset + pagination.limit, pagination.total)} of{' '}
                      {pagination.total} results
                    </p>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={async () => {
                          if (pagination.offset > 0) {
                            setIsLoading(true);
                            const newOffset = Math.max(0, pagination.offset - pagination.limit);
                            try {
                              const response = await fetch(
                                `/api/foods/search?query=${encodeURIComponent(searchTerm)}&limit=${pagination.limit}&offset=${newOffset}`
                              );
                              const data = await response.json();
                              setFoods(data.results.map(food => ({
                                ...food,
                                id: food.id.toString()
                              })));
                              setPagination(data.pagination || null);
                            } catch (err) {
                              console.error('Pagination error:', err);
                            } finally {
                              setIsLoading(false);
                            }
                          }
                        }}
                        disabled={pagination.offset === 0 || isLoading}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      <button
                        onClick={async () => {
                          if (pagination.offset + pagination.limit < pagination.total) {
                            setIsLoading(true);
                            const newOffset = pagination.offset + pagination.limit;
                            try {
                              const response = await fetch(
                                `/api/foods/search?query=${encodeURIComponent(searchTerm)}&limit=${pagination.limit}&offset=${newOffset}`
                              );
                              const data = await response.json();
                              setFoods(data.results.map(food => ({
                                ...food,
                                id: food.id.toString()
                              })));
                              setPagination(data.pagination || null);
                            } catch (err) {
                              console.error('Pagination error:', err);
                            } finally {
                              setIsLoading(false);
                            }
                          }
                        }}
                        disabled={pagination.offset + pagination.limit >= pagination.total || isLoading}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;