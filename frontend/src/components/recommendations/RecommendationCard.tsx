import React from 'react';
import { FoodRecommendation } from '../../services/recommendationService';

interface RecommendationCardProps {
  recommendation: FoodRecommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const { name, description, category, nutritionHighlights, confidence } = recommendation;
  
  // Calculate a confidence-based color gradient (green for high confidence, yellow for medium, orange for lower)
  const getConfidenceColor = () => {
    if (confidence >= 0.8) return 'bg-green-50 border-green-200';
    if (confidence >= 0.6) return 'bg-yellow-50 border-yellow-200';
    return 'bg-orange-50 border-orange-200';
  };
  
  // Calculate confidence as percentage
  const confidencePercentage = Math.round(confidence * 100);
  
  return (
    <div className={`border-2 rounded-xl p-5 hover:shadow-lg transition-all duration-300 ${getConfidenceColor()}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{name}</h3>
          <p className="text-gray-600 text-sm">{category}</p>
        </div>
        
        {/* Confidence badge */}
        <div className="flex flex-col items-center justify-center bg-white rounded-full h-14 w-14 border-2 border-gray-200 shadow-sm">
          <span className="font-bold text-md text-gray-800">{confidencePercentage}%</span>
          <span className="text-xs text-gray-500">match</span>
        </div>
      </div>
      
      <p className="mt-3 text-gray-700">{description}</p>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Nutrition Highlights</h4>
        <div className="flex flex-wrap gap-2">
          {nutritionHighlights.map((highlight, index) => (
            <span 
              key={index}
              className="px-2 py-1 rounded-full bg-white border border-gray-200 text-xs text-gray-700"
            >
              {highlight}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;