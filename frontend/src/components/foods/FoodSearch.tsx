import React, { useState } from 'react';
import { useFoods } from '../../hooks/useFoods';

const FoodSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { 
    updateSearch, 
    categories, 
    isCategoriesLoading 
  } = useFoods();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearch({ 
      query: searchTerm,
      category: selectedCategory || undefined 
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Search Foods</h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Food Name
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search for foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {isCategoriesLoading ? (
              <option disabled>Loading categories...</option>
            ) : (
              categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))
            )}
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default FoodSearch;