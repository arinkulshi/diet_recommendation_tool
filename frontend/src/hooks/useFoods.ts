// src/hooks/useFoods.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { foodsApi } from '../api/foodsApi';
import { Food, FoodSearchParams } from '../api/types';

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
}

export function useFoods() {
  const [searchParams, setSearchParams] = useState<FoodSearchParams>({
    query: '',
    limit: 20,
    offset: 0
  });

  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  // Fetch food categories
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => foodsApi.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Search foods based on current params
  const searchQuery = useQuery({
    queryKey: ['foods', 'search', searchParams],
    queryFn: async () => {
      console.log('Searching with params:', searchParams);
      const response = await foodsApi.searchFoods(searchParams);
      console.log('Raw API response:', response);
      
      // Log each food item's details
      response.results.forEach((food, index) => {
        console.log(`Food ${index + 1}:`, {
          id: food.id,
          brand_name: food.brand_name,
          brand_owner: food.brand_owner,
          category: food.branded_food_category
        });
      });
      
      return response;
    },
    enabled: true, // Always enabled to fetch initial data
  });

  // Update search parameters
  const updateSearch = (newParams: Partial<FoodSearchParams>) => {
    console.log('Updating search params:', newParams);
    setSearchParams(prev => ({ ...prev, ...newParams, offset: 0 })); // Reset offset when changing search
  };

  // Simple search function for backward compatibility
  const searchFoods = (searchQuery: string) => {
    updateSearch({ query: searchQuery });
  };

  // Handle pagination
  const nextPage = () => {
    if (searchQuery.data && (searchParams.offset || 0) + searchParams.limit! < searchQuery.data.pagination.total) {
      setSearchParams(prev => ({ ...prev, offset: (prev.offset || 0) + prev.limit! }));
    }
  };

  const previousPage = () => {
    if ((searchParams.offset || 0) > 0) {
      setSearchParams(prev => ({ ...prev, offset: Math.max(0, (prev.offset || 0) - prev.limit!) }));
    }
  };

  return {
    foods: searchQuery.data?.results || [],
    pagination: searchQuery.data?.pagination || null,
    isLoading: searchQuery.isLoading,
    isError: searchQuery.isError,
    
    categories: categoriesQuery.data || [],
    isCategoriesLoading: categoriesQuery.isLoading,
    
    selectedFood,
    setSelectedFood,
    
    // Add these functions that were missing
    updateSearch,
    searchFoods,
    nextPage,
    previousPage
  };
}