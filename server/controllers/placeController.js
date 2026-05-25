const asyncHandler = require('express-async-handler');
const Place = require('../models/Place');

// @desc    Get all places with search, filter, pagination
// @route   GET /api/places?state=&city=&category=&search=&page=&limit=&featured=
// @access  Public
const getPlaces = asyncHandler(async (req, res) => {
  const { state, city, category, search, featured, page = 1, limit = 12 } = req.query;

  const filter = { isActive: true };
  if (state) filter.stateId = state;
  if (city) filter.cityId = city;
  if (category) filter.category = category;
  if (featured === 'true') filter.isFeatured = true;

  // Text search
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Place.countDocuments(filter);

  const places = await Place.find(filter)
    .populate('stateId', 'name code')
    .populate('cityId', 'name')
    .sort({ isFeatured: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: places.length,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    data: places,
  });
});

// @desc    Get single place by ID
// @route   GET /api/places/:id
// @access  Public
const getPlace = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id)
    .populate('stateId', 'name code region')
    .populate('cityId', 'name');

  if (!place || !place.isActive) {
    res.status(404);
    throw new Error('Place not found');
  }
  res.status(200).json({ success: true, data: place });
});

// @desc    Create place (Admin)
// @route   POST /api/admin/places
// @access  Private/Admin
const createPlace = asyncHandler(async (req, res) => {
  const place = await Place.create(req.body);
  res.status(201).json({ success: true, data: place });
});

// @desc    Update place (Admin)
// @route   PUT /api/admin/places/:id
// @access  Private/Admin
const updatePlace = asyncHandler(async (req, res) => {
  let place = await Place.findById(req.params.id);
  if (!place) {
    res.status(404);
    throw new Error('Place not found');
  }
  place = await Place.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: place });
});

// @desc    Delete place (Admin)
// @route   DELETE /api/admin/places/:id
// @access  Private/Admin
const deletePlace = asyncHandler(async (req, res) => {
  const place = await Place.findById(req.params.id);
  if (!place) {
    res.status(404);
    throw new Error('Place not found');
  }
  await place.deleteOne();
  res.status(200).json({ success: true, message: 'Place deleted successfully' });
});

module.exports = { getPlaces, getPlace, createPlace, updatePlace, deletePlace };
