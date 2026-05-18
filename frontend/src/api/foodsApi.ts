import apiClient from './client';
import { Food, FoodSearchParams, FoodSearchResponse } from './types';

export const foodsApi = {
  // Search foods based on parameters
  searchFoods: async (params: FoodSearchParams): Promise<FoodSearchResponse> => {
    const response = await apiClient.get<FoodSearchResponse>('/foods/search', { params });
    return response.data;
  },

  // Get detailed food information by ID
  getFoodById: async (id: string): Promise<Food> => {
    const response = await apiClient.get<Food>(`/foods/${id}`);
    return response.data;
  },

  // Get all food categories
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/categories');
    return response.data;
  }
};
