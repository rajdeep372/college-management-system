const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Ensure ALL five functions are imported correctly from the controller
const { 
    addStudent, 
    getAllStudents, 
    updateStudent,
    searchStudents,
    getStudentById 
} = require('../controllers/studentController');


// Route to GET ALL students (for the main list)
router.get('/', getAllStudents);

// Route to POST (add) a NEW student
router.post('/', auth, addStudent);

// Route to POST (search) for students (for the reports page)
router.post('/search', auth, searchStudents);

// Route to GET a SINGLE student by their ID (for the profile/dashboard page)
router.get('/:id', auth, getStudentById);

// Route to PUT (update) a SINGLE student by their ID
router.put('/:id', auth, updateStudent);


module.exports = router;