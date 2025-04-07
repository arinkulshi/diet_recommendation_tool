/// <reference types="vite/client" />

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Food } from '../api/types';

// Define the response structure from the recommendation API
export interface FoodRecommendation {
  name: string;
  description: string;
  category: string;
  nutritionHighlights: string[];
  confidence: number;
}

export interface RecommendationResponse {
  recommendations: FoodRecommendation[];
}

class RecommendationService {
  private genAI: any;
  private model: any;
  private generationConfig: any;

  constructor() {
    // Get Google API key from environment variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    
    // Validate API key is available
    if (!apiKey) {
      console.error('Google Gemini API key is missing. Please check your .env file.');
      return;
    }

    // Initialize the Google Generative AI client
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Configure model and generation settings
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash", // Using a faster model for recommendations
    });
    
    this.generationConfig = {
      temperature: 0.7,      // Balance between creativity and determinism
      topP: 0.95,            // Default parameter for diverse outputs
      topK: 40,              // Default parameter for diverse outputs
      maxOutputTokens: 500, // Limit output size
    };
  }

  /**
   * Generate food recommendations based on user favorites
   */
  async getRecommendations(favorites: Food[]): Promise<FoodRecommendation[]> {
    try {
      // Early return if no favorites or API not initialized
      if (favorites.length === 0 || !this.model) {
        return this.getFallbackRecommendations();
      }

      // Take only first 3-5 favorites to keep prompt size small
      const topFavorites = favorites.slice(0, 5);

      // Create a simplified summary of the user's favorite foods
      const favoritesSummary = topFavorites.map(food => ({
        name: food.brand_name || food.brand_owner,
        category: food.branded_food_category || 'Uncategorized',
        nutritionInfo: {
          calories: food.calories || 0,
          protein: food.protein || 0,
          fat: food.fat || 0,
          carbs: food.carbohydrates || 0
        }
      }));

      // Start a chat session
      const chatSession = this.model.startChat({
        generationConfig: this.generationConfig,
        history: []
      });

      // Create the prompt for the LLM
      const prompt = `
        Based on these favorite foods:
        ${JSON.stringify(favoritesSummary)}
        
        Recommend 3 similar foods that the user might enjoy. For each recommendation, provide:
        1. A name
        2. A brief description (under 15 words)
        3. A food category
        4. 2-3 nutrition highlights
        5. A confidence score between 0 and 1
        
        Return your answer as a valid JSON object following this exact format:
        {"recommendations":[{"name":"Food Name","description":"Brief description","category":"Category","nutritionHighlights":["highlight1","highlight2"],"confidence":0.9}]}
        
        ONLY return the JSON. Do not include any text before or after the JSON.
      `;

      console.log("Sending prompt to Gemini API");
      
      // Send the message to the Gemini API
      const result = await chatSession.sendMessage(prompt);
      const responseText = result.response.text();
      
      console.log("Raw API response:", responseText);
      
      if (!responseText) {
        console.error("Empty response from Gemini API");
        return this.getFallbackRecommendations();
      }

      // Parse the response
      return this.parseResponse(responseText);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return this.getFallbackRecommendations();
    }
  }

  /**
   * Robust parsing function to handle various response formats
   */
  private parseResponse(content: string): FoodRecommendation[] {
    try {
      // Strategy 1: Direct JSON parsing
      try {
        const parsedContent = JSON.parse(content);
        if (parsedContent.recommendations && Array.isArray(parsedContent.recommendations)) {
          console.log("Successfully parsed response as JSON");
          return parsedContent.recommendations;
        }
      } catch (e) {
        console.log("Direct JSON parsing failed, trying alternative methods");
      }

      // Strategy 2: Extract JSON from markdown code blocks or text
      const jsonPattern = /```(?:json)?\s*([\s\S]*?)\s*```|({[\s\S]*})/;
      const jsonMatch = content.match(jsonPattern);
      
      if (jsonMatch) {
        const potentialJson = (jsonMatch[1] || jsonMatch[2]).trim();
        try {
          const extractedJson = JSON.parse(potentialJson);
          if (extractedJson.recommendations && Array.isArray(extractedJson.recommendations)) {
            console.log("Successfully extracted and parsed JSON");
            return extractedJson.recommendations;
          }
        } catch (e) {
          console.log("JSON extraction failed");
        }
      }
      
      // If all parsing attempts fail, return fallback
      console.error("All parsing strategies failed, using fallback");
      return this.getFallbackRecommendations();
    } catch (error) {
      console.error("Error in parsing logic:", error);
      return this.getFallbackRecommendations();
    }
  }

  /**
   * Provides fallback recommendations when API fails
   */
  private getFallbackRecommendations(): FoodRecommendation[] {
    return [
      {
        name: "Protein Smoothie",
        description: "Nutrient-packed drink with protein powder and fruits",
        category: "Beverages",
        nutritionHighlights: ["20g protein", "Rich in vitamins", "Low added sugar"],
        confidence: 0.92
      },
      {
        name: "Turkey Wraps",
        description: "Lean meat with vegetables in whole grain wrap",
        category: "Prepared Foods",
        nutritionHighlights: ["High protein", "Complex carbs", "Low fat"],
        confidence: 0.87
      },
      {
        name: "Mixed Nuts Trail Mix",
        description: "Balanced snack with nuts, seeds and dried fruits",
        category: "Snacks",
        nutritionHighlights: ["Healthy fats", "Plant protein", "Fiber source"],
        confidence: 0.81
      }
    ];
  }
}

export const recommendationService = new RecommendationService();