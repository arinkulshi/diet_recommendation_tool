// controllers/favoriteController.js - Favorite controller functions
const favoriteModel = require('../models/favoriteModel');
const userModel = require('../models/userModel');
const foodModel = require('../models/foodModel');

/**
 * Get user's favorite foods
 */
const getUserFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if user exists
    const user = await userModel.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const favorites = await favoriteModel.getUserFavorites(id);
    
    res.json(favorites);
  } catch (err) {
    console.error('Error getting favorites:', err);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
};

/**
 * Add a food to user's favorites
 */
const addFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { food_id } = req.body;
    
    if (!food_id) {
      return res.status(400).json({ error: 'Food ID is required' });
    }
    
    // Check if user exists
    const user = await userModel.getUserById(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if food exists
    const food = await foodModel.getFoodById(food_id);
    
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    
    // Check if already favorite
    const existing = await favoriteModel.getFavoriteByUserAndFood(id, food_id);
    
    if (existing) {
      return res.status(409).json({ 
        error: 'Food is already in favorites',
        favorite_id: existing.id
      });
    }
    
    // Add favorite
    const favoriteId = await favoriteModel.addFavorite(id, food_id);
    
    // Get the newly created favorite with food details
    const favorite = await favoriteModel.getFavoriteById(favoriteId);
    
    res.status(201).json(favorite);
  } catch (err) {
    console.error('Error adding favorite:', err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

/**
 * Remove a food from user's favorites
 */
const removeFavorite = async (req, res) => {
  try {
    const { userId, favoriteId } = req.params;
    
    // Check if the favorite exists and belongs to the user
    const favorite = await favoriteModel.getUserFavoriteById(favoriteId, userId);
    
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    await favoriteModel.removeFavorite(favoriteId);
    
    res.status(204).send();
  } catch (err) {
    console.error('Error removing favorite:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

module.exports = {
  getUserFavorites,
  addFavorite,
  removeFavorite
};