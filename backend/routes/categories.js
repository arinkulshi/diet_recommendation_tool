const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// Get all food categories
router.get('/', categoryController.getAllCategories);

module.exports = router;