const express = require('express');
const favoriteController = require('../controllers/favoriteController');

const router = express.Router();

// Get user's favorite foods
router.get('/:id/favorites', favoriteController.getUserFavorites);

// Add a food to user's favorites
router.post('/:id/favorites', favoriteController.addFavorite);

// Remove a food from user's favorites
router.delete('/:userId/favorites/:favoriteId', favoriteController.removeFavorite);

module.exports = router;