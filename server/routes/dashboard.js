const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/dashboardController');

// @route   GET api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, getDashboardStats);

module.exports = router;