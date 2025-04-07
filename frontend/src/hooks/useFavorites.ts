import { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { favoritesApi } from '../api/favoritesApi';
import { UserContext } from '../context/UserContext';

export function useFavorites() {
  const queryClient = useQueryClient();
  const { currentUser } = useContext(UserContext);
  const userId = currentUser?.id;

  // Fetch user's favorites
  const favoritesQuery = useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => favoritesApi.getUserFavorites(userId as string),
    enabled: !!userId, // Only run if we have a user ID
  });

  // Add to favorites mutation
  const addFavoriteMutation = useMutation({
    mutationFn: (foodId: string) => favoritesApi.addFavorite(userId as string, foodId),
    onSuccess: () => {
      // Invalidate and refetch favorites
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
    },
  });

  // Remove from favorites mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: (favoriteId: string) => favoritesApi.removeFavorite(userId as string, favoriteId),
    onSuccess: () => {
      // Invalidate and refetch favorites
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] });
    },
  });

  // Check if a food is in favorites
  const isFavorite = (foodId: string) => {
    return favoritesQuery.data?.some(fav => fav.id === foodId) || false;
  };

  // Get favorite ID by food ID
  const getFavoriteId = (foodId: string) => {
    const favorite = favoritesQuery.data?.find(fav => fav.id === foodId);
    return favorite?.favorite_id;
  };

  return {
    favorites: favoritesQuery.data || [],
    isLoading: favoritesQuery.isLoading,
    isError: favoritesQuery.isError,
    error: favoritesQuery.error,
    
    addToFavorites: (foodId: string) => addFavoriteMutation.mutate(foodId),
    isAddingToFavorites: addFavoriteMutation.isPending,
    
    removeFromFavorites: (favoriteId: string) => removeFavoriteMutation.mutate(favoriteId),
    isRemovingFromFavorites: removeFavoriteMutation.isPending,
    
    isFavorite,
    getFavoriteId
  };
}