const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
      default: '🏛️',
    },
    color: {
      type: String,
      default: '#FF6B35',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
