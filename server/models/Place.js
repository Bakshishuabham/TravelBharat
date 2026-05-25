const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      required: [true, 'State reference is required'],
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'City reference is required'],
    },
    category: {
      type: String,
      enum: ['Heritage', 'Nature', 'Religious', 'Adventure', 'Beach', 'Hill Station', 'Wildlife', 'Cultural'],
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    historicalSignificance: {
      type: String,
    },
    bestTimeToVisit: {
      type: String,
      required: [true, 'Best time to visit is required'],
    },
    entryFee: {
      type: String,
      default: 'Free',
    },
    timings: {
      type: String,
      default: 'Open all days',
    },
    nearbyAttractions: [
      {
        type: String,
      },
    ],
    location: {
      // Google Maps URL
      type: String,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    images: [
      {
        type: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name before saving
placeSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug =
      this.name
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .trim()
        .replace(/\s+/g, '-') +
      '-' +
      Date.now();
  }
  next();
});

// Full-text search index
placeSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Place', placeSchema);
