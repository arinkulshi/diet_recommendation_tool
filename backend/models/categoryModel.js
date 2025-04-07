// models/categoryModel.js - Category model functions
const db = require('../database');

/**
 * Get all food categories
 */
const getAllCategories = async () => {
  const database = db.getDb();
  
  const categories = await database.all(`
    SELECT DISTINCT branded_food_category 
    FROM foods 
    WHERE branded_food_category IS NOT NULL 
    ORDER BY branded_food_category
  `);
  
  return categories.map(item => item.branded_food_category);
};

module.exports = {
  getAllCategories
};