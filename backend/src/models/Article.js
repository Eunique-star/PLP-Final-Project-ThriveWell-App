const mongoose = require('mongoose');
const slugify = require('slugify');

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    excerpt: {
      type: String,
      required: [true, 'Please add a short excerpt'],
      maxlength: 200,
    },
    featuredImage: {
      type: String,
      default: 'https://placehold.co/600x400/22c55e/FFFFFF?text=ThriveWell', // A default placeholder
    },
    authorClerkId: {
      type: String,
      required: true,
      index: true,
    },
    authorName: {
      // Denormalizing for easier display
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

// Middleware to create/update slug before saving
ArticleSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Article', ArticleSchema);