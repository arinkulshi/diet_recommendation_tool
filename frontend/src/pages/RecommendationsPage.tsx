import React, { useContext } from 'react';
import { useRecommendations } from '../hooks/recommendations';
import { useFavorites } from '../hooks/useFavorites';
import { UserContext } from '../context/UserContext';
import RecommendationCard from '../components/recommendations/RecommendationCard';
import { useToast } from '../components/ui/Toast';

const RecommendationsPage: React.FC = () => {
  const { isLoggedIn } = useContext(UserContext);
  const { favorites, isLoading: isFavoritesLoading } = useFavorites();
  const { 
    recommendations, 
    isLoading, 
    isError, 
    refetch, 
    isFetching 
  } = useRecommendations();
  const { showToast } = useToast();

  // Handle manual refresh of recommendations
  const handleRefreshRecommendations = () => {
    showToast('Generating new recommendations...', 'info');
    refetch();
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-blue-600">Please log in to view your recommendations.</p>
      </div>
    );
  }

  if (isFavoritesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-yellow-700">You haven't saved any favorites yet.</p>
        <p className="text-yellow-600 mt-2">Add some favorites first, and we'll generate personalized recommendations for you.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Personalized Recommendations</h2>
        <button
          onClick={handleRefreshRecommendations}
          disabled={isFetching}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isFetching ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh Recommendations
            </>
          )}
        </button>
      </div>
      
      <p className="text-gray-600 mb-6">
        Based on your {favorites.length} favorite items, we think you might enjoy these foods.
      </p>

      {isLoading && !recommendations.length ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Generating your personalized recommendations...</p>
        </div>
      ) : isError ? (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600">Sorry, we couldn't generate recommendations right now. Please try again later.</p>
          <button 
            onClick={() => refetch()} 
            className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700">Click the button above to generate recommendations based on your favorites.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((recommendation, index) => (
            <RecommendationCard key={index} recommendation={recommendation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;