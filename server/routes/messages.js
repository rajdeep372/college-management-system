const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware'); // We need to ensure only teachers can send
const { sendMessage } = require('../controllers/messageController');

// @route   POST api/messages/:studentId
// @desc    Send a message to a specific student
// @access  Private (Teachers only)
router.post('/:studentId', auth, checkRole('teacher'), sendMessage);

module.exports = router;