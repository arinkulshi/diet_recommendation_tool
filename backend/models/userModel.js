// models/userModel.js - User model functions
const db = require('../database');

/**
 * Get user by ID
 */
const getUserById = async (id) => {
  const database = db.getDb();
  
  return await database.get('SELECT id FROM users WHERE id = ?', [id]);
};

module.exports = {
  getUserById
};