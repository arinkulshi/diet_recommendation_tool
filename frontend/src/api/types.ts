// API types

export interface Food {
    id: string;
    brand_name: string;
    brand_owner: string;
    calories: number;
    protein: number;
    fat: number;
    carbohydrates: number;
    serving_size: number;
    serving_size_unit: string;
    branded_food_category: string;
  }
  
  export interface FoodSearchParams {
    query?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }
  
  export interface FoodSearchResponse {
    results: Food[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
    };
  }
  
  export interface FavoriteFood extends Food {
    favorite_id: string;
    created_at: string;
  }
  
  export interface User {
    id: string;
    name: string;
  }