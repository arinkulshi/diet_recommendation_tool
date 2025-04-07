const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const morgan = require('morgan');

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Logging middleware

// Database connection
let db;
const initializeDbConnection = async () => {
  try {
    db = await open({
      filename: process.env.DB_PATH || '/data/nutrition.db',
      driver: sqlite3.Database
    });
    console.log('Connected to SQLite database');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

// Routes

// Search foods by name
app.get('/api/foods/search', async (req, res) => {
  try {
    const { query, limit = 20, offset = 0, category } = req.query;
    
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
    
    const foods = await db.all(sql, params);
    
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
    
    const count = await db.get(countSql, countParams);
    
    res.json({
      results: foods,
      pagination: {
        total: count.total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (err) {
    console.error('Error searching foods:', err);
    res.status(500).json({ error: 'Failed to search foods' });
  }
});

// Get detailed food information
app.get('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const food = await db.get(`
      SELECT * FROM foods WHERE id = ?
    `, [id]);
    
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    
    res.json(food);
  } catch (err) {
    console.error('Error getting food details:', err);
    res.status(500).json({ error: 'Failed to get food details' });
  }
});

// Get user's favorite foods
app.get('/api/users/:id/favorites', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if user exists
    const user = await db.get('SELECT id FROM users WHERE id = ?', [id]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const favorites = await db.all(`
      SELECT f.id, f.brand_name, f.brand_owner, f.calories, f.protein, 
             f.total_fat as fat, f.carbohydrates, f.branded_food_category,
             fav.id as favorite_id, fav.created_at
      FROM favorites fav
      JOIN foods f ON fav.food_id = f.id
      WHERE fav.user_id = ?
      ORDER BY fav.created_at DESC
    `, [id]);
    
    res.json(favorites);
  } catch (err) {
    console.error('Error getting favorites:', err);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

// Add a food to user's favorites
app.post('/api/users/:id/favorites', async (req, res) => {
  try {
    const { id } = req.params;
    const { food_id } = req.body;
    
    if (!food_id) {
      return res.status(400).json({ error: 'Food ID is required' });
    }
    
    // Check if user exists
    const user = await db.get('SELECT id FROM users WHERE id = ?', [id]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if food exists
    const food = await db.get('SELECT id FROM foods WHERE id = ?', [food_id]);
    
    if (!food) {
      return res.status(404).json({ error: 'Food not found' });
    }
    
    // Check if already favorite
    const existing = await db.get(
      'SELECT id FROM favorites WHERE user_id = ? AND food_id = ?',
      [id, food_id]
    );
    
    if (existing) {
      return res.status(409).json({ 
        error: 'Food is already in favorites',
        favorite_id: existing.id
      });
    }
    
    const result = await db.run(
      'INSERT INTO favorites (user_id, food_id) VALUES (?, ?)',
      [id, food_id]
    );
    
    const favorite = await db.get(`
      SELECT f.id, f.brand_name, f.brand_owner, f.calories, f.protein, 
             f.total_fat as fat, f.carbohydrates, f.branded_food_category,
             fav.id as favorite_id, fav.created_at
      FROM favorites fav
      JOIN foods f ON fav.food_id = f.id
      WHERE fav.id = ?
    `, [result.lastID]);
    
    res.status(201).json(favorite);
  } catch (err) {
    console.error('Error adding favorite:', err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Remove a food from user's favorites
app.delete('/api/users/:userId/favorites/:favoriteId', async (req, res) => {
  try {
    const { userId, favoriteId } = req.params;
    
    // Check if the favorite exists and belongs to the user
    const favorite = await db.get(
      'SELECT id FROM favorites WHERE id = ? AND user_id = ?',
      [favoriteId, userId]
    );
    
    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    
    await db.run('DELETE FROM favorites WHERE id = ?', [favoriteId]);
    
    res.status(204).send();
  } catch (err) {
    console.error('Error removing favorite:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// Get all food categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.all(`
      SELECT DISTINCT branded_food_category 
      FROM foods 
      WHERE branded_food_category IS NOT NULL 
      ORDER BY branded_food_category
    `);
    
    res.json(categories.map(item => item.branded_food_category));
  } catch (err) {
    console.error('Error getting categories:', err);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Start the server
const startServer = async () => {
  await initializeDbConnection();
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  if (db) {
    await db.close();
    console.log('Database connection closed');
  }
  process.exit(0);
});

module.exports = app; // Export for testing