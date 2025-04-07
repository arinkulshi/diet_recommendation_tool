import React, { useState, useEffect } from 'react';
import FoodCard from '../components/foods/FoodCard';

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
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Function to handle search directly
  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/foods/search?query=${encodeURIComponent(query)}&limit=20&offset=0`);
      
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
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

  const filteredFoods = foods.filter(food => food.brand_owner && food.brand_owner.trim() !== '');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nutrition Database</h1>
      
      {/* Search box moved to top of the page */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Search Foods</h2>
          <div className="relative group">
            <button className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
              </svg>
              Color Legend
            </button>
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-white shadow-lg rounded-md p-4 z-10 w-64">
              <h3 className="font-medium text-sm mb-2 border-b pb-1">Food Category Colors</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="h-4 w-4 rounded-sm bg-green-100 border border-green-200 mr-2"></span>
                  <span>Fruits &amp; Vegetables</span>
                </li>
                <li className="flex items-center">
                  <span className="h-4 w-4 rounded-sm bg-red-50 border border-red-200 mr-2"></span>
                  <span>Meat &amp; Protein</span>
                </li>
                <li className="flex items-center">
                  <span className="h-4 w-4 rounded-sm bg-blue-50 border border-blue-200 mr-2"></span>
                  <span>Dairy</span>
                </li>
                <li className="flex items-center">
                  <span className="h-4 w-4 rounded-sm bg-yellow-50 border border-yellow-200 mr-2"></span>
                  <span>Snacks &amp; Desserts</span>
                </li>
                <li className="flex items-center">
                  <span className="h-4 w-4 rounded-sm bg-purple-50 border border-purple-200 mr-2"></span>
                  <span>Beverages &amp; Drinks</span>
                </li>
                <li className="flex items-center">
                  <span className="h-4 w-4 rounded-sm bg-gray-50 border border-gray-200 mr-2"></span>
                  <span>Other Categories</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch((e.currentTarget.elements.namedItem('search') as HTMLInputElement).value);
          }} 
          className="flex gap-4"
        >
          <div className="flex-grow">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Foods By Brand Name
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
            className="self-end bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
      
      {/* Search results section taking up full width */}
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
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={{
                    ...food,
                    id: food.id.toString()
                  }}
                  onClick={() => {}} // Empty function since we're removing the selection functionality
                  showFavoriteButton={true}
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
  );
};

export default SearchPage;