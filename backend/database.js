// database.js - Database connection
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const config = require('./config');

let db;

/**
 * Initialize database connection
 */
const initialize = async () => {
  try {
    db = await open({
      filename: config.database.path,
      driver: sqlite3.Database
    });
    console.log('Connected to SQLite database');
    return db;
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

/**
 * Close database connection
 */
const close = async () => {
  if (db) {
    await db.close();
    console.log('Database connection closed');
  }
};

/**
 * Get database instance
 */
const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

module.exports = {
  initialize,
  close,
  getDb
};