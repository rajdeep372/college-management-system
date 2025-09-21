const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { markAttendance } = require('../controllers/attendanceController');

router.post('/', auth, markAttendance);

module.exports = router;