// models/foodModel.js - Food model functions
const db = require('../database');

/**
 * Search foods by query and category
 */
const searchFoods = async (query, limit = 20, offset = 0, category) => {
  const database = db.getDb();
  
  let sql = `
    SELECT id, brand_name, brand_owner, calories, protein, total_fat as fat, 
           carbohydrates, serving_size, serving_size_unit, branded_food_category
    FROM foods
    WHERE 1=1
  `;
  
  const params = [];
  
  if (query) {
    sql += ` AND (brand_name LIKE ? OR ingredients LIKE ?)`;
    params.push(`%${query}%`, `%${query}%`);
  }
  
  if (category) {
    sql += ` AND branded_food_category LIKE ?`;
    params.push(`%${category}%`);
  }
  
  sql += ` ORDER BY brand_name LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));
  
  const foods = await database.all(sql, params);
  
  // Get total count for pagination
  let countSql = `
    SELECT COUNT(*) as total FROM foods WHERE 1=1
  `;
  
  const countParams = [];
  
  if (query) {
    countSql += ` AND (brand_name LIKE ? OR ingredients LIKE ?)`;
    countParams.push(`%${query}%`, `%${query}%`);
  }
  
  if (category) {
    countSql += ` AND branded_food_category LIKE ?`;
    countParams.push(`%${category}%`);
  }
  
  const count = await database.get(countSql, countParams);
  
  return {
    foods,
    total: count.total
  };
};

/**
 * Get food by ID
 */
const getFoodById = async (id) => {
  const database = db.getDb();
  
  return await database.get(`
    SELECT * FROM foods WHERE id = ?
  `, [id]);
};

module.exports = {
  searchFoods,
  getFoodById
};