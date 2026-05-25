const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Controllers
const { createState, updateState, deleteState } = require('../controllers/stateController');
const { createCity, updateCity, deleteCity } = require('../controllers/cityController');
const { createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { createPlace, updatePlace, deletePlace } = require('../controllers/placeController');
const { getStats } = require('../controllers/adminController');

// Apply protect + admin role to ALL admin routes
router.use(protect, authorize('admin'));

// ─── Dashboard ─────────────────────────────────────────────────────────────
router.get('/stats', getStats);

// ─── States ────────────────────────────────────────────────────────────────
router.post('/states', createState);
router.put('/states/:id', updateState);
router.delete('/states/:id', deleteState);

// ─── Cities ────────────────────────────────────────────────────────────────
router.post('/cities', createCity);
router.put('/cities/:id', updateCity);
router.delete('/cities/:id', deleteCity);

// ─── Categories ────────────────────────────────────────────────────────────
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// ─── Places ────────────────────────────────────────────────────────────────
router.post('/places', createPlace);
router.put('/places/:id', updatePlace);
router.delete('/places/:id', deletePlace);

module.exports = router;
