const categoryModel = require('../models/categoryModel');

/**
 * Get all food categories
 */
const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModel.getAllCategories();
    
    res.json(categories);
  } catch (err) {
    console.error('Error getting categories:', err);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

module.exports = {
  getAllCategories
};