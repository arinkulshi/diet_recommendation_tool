// routes/index.js - Main router file
const express = require('express');
const path = require('path');
const router = express.Router();

// Import controllers directly to bypass path issues
const foodController = require('../controllers/foodController');
const favoriteController = require('../controllers/favoriteController');
const categoryController = require('../controllers/categoryController');

// Food routes
router.get('/foods/search', foodController.searchFoods);
router.get('/foods/:id', foodController.getFoodById);

// User/Favorite routes
router.get('/users/:id/favorites', favoriteController.getUserFavorites);
router.post('/users/:id/favorites', favoriteController.addFavorite);
router.delete('/users/:userId/favorites/:favoriteId', favoriteController.removeFavorite);

// Category routes
router.get('/categories', categoryController.getAllCategories);

module.exports = router;