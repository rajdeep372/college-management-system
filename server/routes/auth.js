const express = require('express');
const router = express.Router();

// Import all three controller functions
const { 
    registerUser, 
    loginUser, 
    getLoggedInUser 
} = require('../controllers/authController');

// Import the authentication middleware
const auth = require('../middleware/authMiddleware');

// @route   POST api/auth/register
// @desc    Register a new teacher/user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Login a teacher/user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET api/auth/me
// @desc    Get the profile of the currently logged-in user
// @access  Private (Requires a valid token)
router.get('/me', auth, getLoggedInUser);

module.exports = router;