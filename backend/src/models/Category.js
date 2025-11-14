const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: 200,
    },
    imageUrl: {
      type: String,
      default: 'https://placehold.co/400x300/65a30d/FFFFFF?text=Category', // A default placeholder
    },
  },
  { timestamps: true }
);

// Middleware to create slug from name before saving
CategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Category', CategorySchema);