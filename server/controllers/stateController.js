const asyncHandler = require('express-async-handler');
const State = require('../models/State');

// @desc    Get all states
// @route   GET /api/states
// @access  Public
const getStates = asyncHandler(async (req, res) => {
  const { region } = req.query;
  const filter = { isActive: true };
  if (region) filter.region = region;

  const states = await State.find(filter).sort({ name: 1 });
  res.status(200).json({ success: true, count: states.length, data: states });
});

// @desc    Get single state
// @route   GET /api/states/:id
// @access  Public
const getState = asyncHandler(async (req, res) => {
  const state = await State.findById(req.params.id);
  if (!state) {
    res.status(404);
    throw new Error('State not found');
  }
  res.status(200).json({ success: true, data: state });
});

// @desc    Create state (Admin)
// @route   POST /api/admin/states
// @access  Private/Admin
const createState = asyncHandler(async (req, res) => {
  const state = await State.create(req.body);
  res.status(201).json({ success: true, data: state });
});

// @desc    Update state (Admin)
// @route   PUT /api/admin/states/:id
// @access  Private/Admin
const updateState = asyncHandler(async (req, res) => {
  let state = await State.findById(req.params.id);
  if (!state) {
    res.status(404);
    throw new Error('State not found');
  }
  state = await State.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: state });
});

// @desc    Delete state (Admin)
// @route   DELETE /api/admin/states/:id
// @access  Private/Admin
const deleteState = asyncHandler(async (req, res) => {
  const state = await State.findById(req.params.id);
  if (!state) {
    res.status(404);
    throw new Error('State not found');
  }
  await state.deleteOne();
  res.status(200).json({ success: true, message: 'State deleted successfully' });
});

module.exports = { getStates, getState, createState, updateState, deleteState };
