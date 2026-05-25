const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
      required: [true, 'State reference is required'],
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index: city name must be unique within a state
citySchema.index({ name: 1, stateId: 1 }, { unique: true });

module.exports = mongoose.model('City', citySchema);
