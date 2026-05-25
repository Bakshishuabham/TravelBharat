const asyncHandler = require('express-async-handler');
const State = require('../models/State');
const City = require('../models/City');
const Place = require('../models/Place');
const User = require('../models/User');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const [totalStates, totalCities, totalPlaces, totalUsers, featuredPlaces] = await Promise.all([
    State.countDocuments({ isActive: true }),
    City.countDocuments({ isActive: true }),
    Place.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: true }),
    Place.countDocuments({ isFeatured: true, isActive: true }),
  ]);

  // Places per category breakdown
  const categoryBreakdown = await Place.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  // Recent places
  const recentPlaces = await Place.find({ isActive: true })
    .populate('stateId', 'name')
    .populate('cityId', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      totalStates,
      totalCities,
      totalPlaces,
      totalUsers,
      featuredPlaces,
      categoryBreakdown,
      recentPlaces,
    },
  });
});

module.exports = { getStats };
