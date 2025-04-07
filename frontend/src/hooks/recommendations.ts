import { useQuery } from '@tanstack/react-query';
import { useFavorites } from './useFavorites';
import { recommendationService} from '../services/recommendationService';

export function useRecommendations() {
  const { favorites, isLoading: isFavoritesLoading } = useFavorites();

  const recommendationsQuery = useQuery({
    queryKey: ['recommendations', favorites?.length],
    queryFn: () => recommendationService.getRecommendations(favorites || []),
    enabled: !isFavoritesLoading && favorites?.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  return {
    recommendations: recommendationsQuery.data || [],
    isLoading: recommendationsQuery.isLoading,
    isError: recommendationsQuery.isError,
    error: recommendationsQuery.error,
    refetch: recommendationsQuery.refetch,
    isFetching: recommendationsQuery.isFetching,
  };
}