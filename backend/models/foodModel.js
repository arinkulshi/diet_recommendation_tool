const db = require('../database');

/**
 * Search foods by query and category with improved relevance
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
    // Create different match conditions with different priorities
    sql += ` AND (
      brand_name = ? OR
      brand_name LIKE ? OR
      brand_owner = ? OR
      brand_owner LIKE ? OR
      ingredients LIKE ?
    )`;
    
    // Add parameters for each condition
    params.push(
      query,                // Exact brand name match
      `${query}%`,          // Brand name starts with query
      query,                // Exact brand owner match
      `${query}%`,          // Brand owner starts with query
      `%${query}%`          // Ingredient contains query (lowest priority)
    );
    
    // Order by relevance
    sql += `
      ORDER BY
        CASE
          WHEN brand_name = ? THEN 1          /* Exact brand name match - highest priority */
          WHEN brand_name LIKE ? THEN 2       /* Brand name starts with query */
          WHEN brand_owner = ? THEN 3         /* Exact manufacturer match */
          WHEN brand_owner LIKE ? THEN 4      /* Manufacturer starts with query */
          WHEN brand_name LIKE ? THEN 5       /* Brand name contains query */
          WHEN brand_owner LIKE ? THEN 6      /* Manufacturer contains query */
          WHEN ingredients LIKE ? THEN 7      /* Ingredients contain query - lowest priority */
          ELSE 8
        END
    `;
    
    // Add parameters for the ORDER BY CASE statement
    params.push(
      query,                 // 1: Exact brand match
      `${query}%`,           // 2: Brand starts with
      query,                 // 3: Exact manufacturer match
      `${query}%`,           // 4: Manufacturer starts with
      `%${query}%`,          // 5: Brand contains
      `%${query}%`,          // 6: Manufacturer contains
      `%${query}%`           // 7: Ingredients contain
    );
  } else {
    sql += ` ORDER BY brand_name`;
  }
  
  if (category) {
    sql += ` AND branded_food_category LIKE ?`;
    params.push(`%${category}%`);
  }
  
  // Add limit and offset after the ordering
  sql += ` LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), parseInt(offset));
  
  const foods = await database.all(sql, params);
  
  // Get total count for pagination
  let countSql = `
    SELECT COUNT(*) as total FROM foods WHERE 1=1
  `;
  
  const countParams = [];
  
  if (query) {
    countSql += ` AND (
      brand_name = ? OR
      brand_name LIKE ? OR
      brand_owner = ? OR
      brand_owner LIKE ? OR
      ingredients LIKE ?
    )`;
    
    countParams.push(
      query,                // Exact brand name match
      `${query}%`,          // Brand name starts with query
      query,                // Exact brand owner match
      `${query}%`,          // Brand owner starts with query
      `%${query}%`          // Ingredient contains query
    );
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