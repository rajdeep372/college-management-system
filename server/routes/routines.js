const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addRoutineItem, getAllRoutines } = require('../controllers/routineController');

// POST route to add a new routine item (protected)
router.post('/', auth, addRoutineItem);

// GET route to fetch all routine items (public)
router.get('/', getAllRoutines);

module.exports = router;