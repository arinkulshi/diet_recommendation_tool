// models/favoriteModel.js - Favorite model functions
const db = require('../database');

/**
 * Get user's favorite foods
 */
const getUserFavorites = async (userId) => {
  const database = db.getDb();
  
  return await database.all(`
    SELECT f.id, f.brand_name, f.brand_owner, f.calories, f.protein, 
           f.total_fat as fat, f.carbohydrates, f.branded_food_category,
           fav.id as favorite_id, fav.created_at
    FROM favorites fav
    JOIN foods f ON fav.food_id = f.id
    WHERE fav.user_id = ?
    ORDER BY fav.created_at DESC
  `, [userId]);
};

/**
 * Get favorite by user ID and food ID
 */
const getFavoriteByUserAndFood = async (userId, foodId) => {
  const database = db.getDb();
  
  return await database.get(
    'SELECT id FROM favorites WHERE user_id = ? AND food_id = ?',
    [userId, foodId]
  );
};

/**
 * Get favorite by ID with food details
 */
const getFavoriteById = async (favoriteId) => {
  const database = db.getDb();
  
  return await database.get(`
    SELECT f.id, f.brand_name, f.brand_owner, f.calories, f.protein, 
           f.total_fat as fat, f.carbohydrates, f.branded_food_category,
           fav.id as favorite_id, fav.created_at
    FROM favorites fav
    JOIN foods f ON fav.food_id = f.id
    WHERE fav.id = ?
  `, [favoriteId]);
};

/**
 * Get favorite by ID and user ID
 */
const getUserFavoriteById = async (favoriteId, userId) => {
  const database = db.getDb();
  
  return await database.get(
    'SELECT id FROM favorites WHERE id = ? AND user_id = ?',
    [favoriteId, userId]
  );
};

/**
 * Add a food to user's favorites
 */
const addFavorite = async (userId, foodId) => {
  const database = db.getDb();
  
  const result = await database.run(
    'INSERT INTO favorites (user_id, food_id) VALUES (?, ?)',
    [userId, foodId]
  );
  
  return result.lastID;
};

/**
 * Remove a food from user's favorites
 */
const removeFavorite = async (favoriteId) => {
  const database = db.getDb();
  
  await database.run('DELETE FROM favorites WHERE id = ?', [favoriteId]);
};

module.exports = {
  getUserFavorites,
  getFavoriteByUserAndFood,
  getFavoriteById,
  getUserFavoriteById,
  addFavorite,
  removeFavorite
};