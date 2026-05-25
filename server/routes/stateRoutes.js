const express = require('express');
const router = express.Router();
const { getStates, getState } = require('../controllers/stateController');

router.get('/', getStates);
router.get('/:id', getState);

module.exports = router;
