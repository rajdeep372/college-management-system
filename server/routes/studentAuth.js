const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent } = require('../controllers/studentAuthController');

// @route   POST api/student-auth/register
// @desc    Register a new student
router.post('/register', registerStudent);

// @route   POST api/student-auth/login
// @desc    Login a student & get token
router.post('/login', loginStudent);

module.exports = router;