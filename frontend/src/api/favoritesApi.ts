import apiClient from './client';
import { FavoriteFood } from './types';

export const favoritesApi = {
  // Get user's favorite foods
  getUserFavorites: async (userId: string): Promise<FavoriteFood[]> => {
    const response = await apiClient.get(`/users/${userId}/favorites`);
    return response.data;
  },

  // Add a food to favorites
  addFavorite: async (userId: string, foodId: string): Promise<FavoriteFood> => {
    const response = await apiClient.post(`/users/${userId}/favorites`, { food_id: foodId });
    return response.data;
  },

  // Remove a food from favorites
  removeFavorite: async (userId: string, favoriteId: string): Promise<void> => {
    await apiClient.delete(`/users/${userId}/favorites/${favoriteId}`);
  }
};