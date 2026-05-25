const asyncHandler = require('express-async-handler');
const City = require('../models/City');

// @desc    Get all cities (optionally filter by stateId)
// @route   GET /api/cities?stateId=
// @access  Public
const getCities = asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.stateId) filter.stateId = req.query.stateId;

  const cities = await City.find(filter).populate('stateId', 'name code').sort({ name: 1 });
  res.status(200).json({ success: true, count: cities.length, data: cities });
});

// @desc    Get single city
// @route   GET /api/cities/:id
// @access  Public
const getCity = asyncHandler(async (req, res) => {
  const city = await City.findById(req.params.id).populate('stateId', 'name code');
  if (!city) {
    res.status(404);
    throw new Error('City not found');
  }
  res.status(200).json({ success: true, data: city });
});

// @desc    Create city (Admin)
// @route   POST /api/admin/cities
// @access  Private/Admin
const createCity = asyncHandler(async (req, res) => {
  const city = await City.create(req.body);
  res.status(201).json({ success: true, data: city });
});

// @desc    Update city (Admin)
// @route   PUT /api/admin/cities/:id
// @access  Private/Admin
const updateCity = asyncHandler(async (req, res) => {
  let city = await City.findById(req.params.id);
  if (!city) {
    res.status(404);
    throw new Error('City not found');
  }
  city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: city });
});

// @desc    Delete city (Admin)
// @route   DELETE /api/admin/cities/:id
// @access  Private/Admin
const deleteCity = asyncHandler(async (req, res) => {
  const city = await City.findById(req.params.id);
  if (!city) {
    res.status(404);
    throw new Error('City not found');
  }
  await city.deleteOne();
  res.status(200).json({ success: true, message: 'City deleted successfully' });
});

module.exports = { getCities, getCity, createCity, updateCity, deleteCity };
