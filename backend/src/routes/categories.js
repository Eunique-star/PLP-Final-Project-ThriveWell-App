const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryBySlug,
  getArticlesForCategory,
} = require('../controllers/categoryController.js');

const { clerkAuth } = require('../middleware/clerkAuth.js');
const { checkRole } = require('../middleware/checkRole.js');

// --- Public Routes (no auth needed) ---
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.get('/:slug/articles', getArticlesForCategory);

// --- Admin Route (auth and role check required) ---
// Only admins can create new categories
router.post('/', clerkAuth, checkRole('admin'), createCategory);
// We can add PUT and DELETE routes here later if needed

module.exports = router;