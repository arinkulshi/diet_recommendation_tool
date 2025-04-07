// controllers/foodController.js - Food controller functions
const foodModel = require('../models/foodModel');

/**
 * Search foods by name and category
 */
const searchFoods = async (req, res) => {
  try {
    const { query, limit = 20, offset = 0, category } = req.query;
    
    const { foods, total } = await foodModel.searchFoods(query, limit, offset, category);
    
    res.json({
      results: foods,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (err) {
    console.error('Error searching foods:', err);
    res.status(500).json({ error: 'Failed to search foods' });
  }
};

/**
 * Get food by ID
 */
const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const food = await foodModel.getFoodById(id);
    
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    
    res.json(food);
  } catch (err) {
    console.error('Error getting food details:', err);
    res.status(500).json({ error: 'Failed to get food details' });
  }
};

module.exports = {
  searchFoods,
  getFoodById
};