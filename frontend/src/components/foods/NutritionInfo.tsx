import React from 'react';
import { Food } from '../../api/types';

interface NutritionInfoProps {
  food: Food;
  detailed?: boolean;
}

const NutritionInfo: React.FC<NutritionInfoProps> = ({ food, detailed = false }) => {
  const formatValue = (value: number | undefined): string => {
    if (value === undefined) return 'N/A';
    return value.toFixed(1) + 'g';
  };

  // For calories, don't show decimal or g unit
  const formatCalories = (value: number | undefined): string => {
    if (value === undefined) return 'N/A';
    return Math.round(value) + ' kcal';
  };

  return (
    <div className={`${detailed ? 'p-4 bg-gray-50 rounded-lg' : ''}`}>
      <h4 className={`font-medium ${detailed ? 'text-lg mb-3' : 'text-sm mb-2'}`}>
        Nutrition Facts
      </h4>
      
      <div className={`grid ${detailed ? 'grid-cols-2 gap-4' : 'gap-1'}`}>
        <div className="flex justify-between">
          <span className="text-gray-600">Calories:</span>
          <span className="font-medium text-gray-900">{formatCalories(food.calories)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Protein:</span>
          <span className="font-medium text-gray-900">{formatValue(food.protein)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Carbs:</span>
          <span className="font-medium text-gray-900">{formatValue(food.carbohydrates)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Fat:</span>
          <span className="font-medium text-gray-900">{formatValue(food.fat)}</span>
        </div>
        
        {detailed && (
          <>
            {/* Could add more detailed nutritional info here */}
            <div className="col-span-2 mt-2 pt-2 border-t">
              <p className="text-sm text-gray-600">
                Serving size: {food.serving_size} {food.serving_size_unit}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NutritionInfo;