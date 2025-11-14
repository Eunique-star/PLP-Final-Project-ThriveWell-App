const Article = require('../models/Article.js');
const User = require('../models/User.js');
const Category = require('../models/Category.js');
const asyncHandler = require('express-async-handler');

// @desc    Create a new article
// @route   POST /api/articles
// @access  Private/Writer
const createArticle = asyncHandler(async (req, res) => {
  const { title, content, excerpt, categoryId, status, featuredImage } = req.body;
  const { userId } = req.auth; // from clerkAuth

  // Find the author's info from our DB
  const author = await User.findOne({ clerkId: userId }).select('username');
  if (!author) {
    return res.status(404).json({ message: 'Author user not found.' });
  }

  // Check if category exists
  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }

  const article = new Article({
    title,
    content,
    excerpt,
    category: categoryId,
    status,
    featuredImage: featuredImage || undefined,
    authorClerkId: userId,
    authorName: author.username || 'ThriveWell Writer', // Use username or a default
  });

  const createdArticle = await article.save();
  res.status(201).json(createdArticle);
});

// @desc    Get all PUBLISHED articles
// @route   GET /api/articles
// @access  Public
const getPublishedArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find({ status: 'published' })
    .populate('category', 'name slug') // Show category name/slug
    .sort({ createdAt: -1 }); // Newest first
  res.json(articles);
});

// @desc    Get a single PUBLISHED article by slug
// @route   GET /api/articles/:slug
// @access  Public
const getArticleBySlug = asyncHandler(async (req, res) => {
  const article = await Article.findOne({
    slug: req.params.slug,
    status: 'published',
  }).populate('category', 'name slug');

  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ message: 'Article not found' });
  }
});

// @desc    Get all articles (drafts & published) by the logged-in writer
// @route   GET /api/articles/my-articles
// @access  Private/Writer
const getMyArticles = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const articles = await Article.find({ authorClerkId: userId })
    .populate('category', 'name slug')
    .sort({ updatedAt: -1 });
  res.json(articles);
});

// @desc    Update an article
// @route   PUT /api/articles/:id
// @access  Private/Writer
const updateArticle = asyncHandler(async (req, res) => {
  const { title, content, excerpt, categoryId, status, featuredImage } = req.body;
  const { userId } = req.auth;

  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(404).json({ message: 'Article not found' });
  }

  // Check if the logged-in user is the author
  if (article.authorClerkId !== userId) {
    return res.status(403).json({ message: 'User not authorized to update this article' });
  }

  // Update fields
  article.title = title || article.title;
  article.content = content || article.content;
  article.excerpt = excerpt || article.excerpt;
  article.categoryId = categoryId || article.categoryId;
  article.status = status || article.status;
  article.featuredImage = featuredImage || article.featuredImage;
  // slug will auto-update if title changes, thanks to our pre-save hook

  const updatedArticle = await article.save();
  res.json(updatedArticle);
});

// @desc    Delete an article
// @route   DELETE /api/articles/:id
// @access  Private/Writer
const deleteArticle = asyncHandler(async (req, res) => {
  const { userId } = req.auth;
  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(44).json({ message: 'Article not found' });
  }

  // Check if the logged-in user is the author
  if (article.authorClerkId !== userId) {
    return res.status(403).json({ message: 'User not authorized to delete this article' });
  }

  await article.deleteOne();
  res.json({ message: 'Article removed' });
});

module.exports = {
  createArticle,
  getPublishedArticles,
  getArticleBySlug,
  getMyArticles,
  updateArticle,
  deleteArticle,
};