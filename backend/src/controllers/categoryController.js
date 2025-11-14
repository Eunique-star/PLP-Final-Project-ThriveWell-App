const Category = require('../models/Category.js');
const Article = require('../models/Article.js');
const asyncHandler = require('express-async-handler');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, imageUrl } = req.body;

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    return res.status(400).json({ message: 'Category already exists' });
  }

  const category = new Category({ name, description, imageUrl });
  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// @desc    Get a single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: 'Category not found' });
  }
});

// @desc    Get all published articles for a specific category
// @route   GET /api/categories/:slug/articles
// @access  Public
const getArticlesForCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const articles = await Article.find({
    category: category._id,
    status: 'published',
  }).select('-content'); // Exclude full content, send only excerpts

  res.json(articles);
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryBySlug,
  getArticlesForCategory,
};