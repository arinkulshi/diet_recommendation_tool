const express = require('express');
const foodController = require('../controllers/foodController');

const router = express.Router();

// Search foods by name
router.get('/search', foodController.searchFoods);

// Get detailed food information
router.get('/:id', foodController.getFoodById);

module.exports = router;