const express = require('express');
const router = express.Router();
const { getPlaces, getPlace } = require('../controllers/placeController');

router.get('/', getPlaces);
router.get('/:id', getPlace);

module.exports = router;
