const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'State name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'State code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 4,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    },
    region: {
      type: String,
      enum: ['North', 'South', 'East', 'West', 'Central', 'Northeast', 'Union Territory'],
      required: true,
    },
    capital: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('State', stateSchema);
