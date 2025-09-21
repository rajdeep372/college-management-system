const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware'); // Ensure only teachers can post/delete
const { getAllNotices, createNotice, deleteNotice } = require('../controllers/noticeController');

// @route   GET api/notices
// @desc    Get all notices (for both students and teachers)
router.get('/', auth, getAllNotices);

// @route   POST api/notices
// @desc    Create a new notice
// @access  Private (Teachers only)
router.post('/', auth, checkRole('teacher'), createNotice);

// @route   DELETE api/notices/:id
// @desc    Delete a notice
// @access  Private (Teachers only)
router.delete('/:id', auth, checkRole('teacher'), deleteNotice);

module.exports = router;