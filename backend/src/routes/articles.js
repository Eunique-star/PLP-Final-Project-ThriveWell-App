const express = require('express');
const router = express.Router();
const {
  createArticle,
  getPublishedArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
  getMyArticles,
} = require('../controllers/articleController.js');

const { clerkAuth } = require('../middleware/clerkAuth.js');
const { checkRole } = require('../middleware/checkRole.js');

// --- Public Routes (no auth needed) ---
router.get('/', getPublishedArticles);
router.get('/:slug', getArticleBySlug);

// --- Writer Routes (auth and 'writer' role required) ---
router.post(
  '/',
  clerkAuth,
  checkRole('writer', 'admin'),
  createArticle
);
router.get('/my-articles', clerkAuth, checkRole('writer', 'admin'), getMyArticles);
router.put('/:id', clerkAuth, checkRole('writer', 'admin'), updateArticle);
router.delete('/:id', clerkAuth, checkRole('writer', 'admin'), deleteArticle);

module.exports = router;