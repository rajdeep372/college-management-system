const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student'); // The academic record model
const StudentUser = require('../models/StudentUser'); // The new login model

// --- Student Signup ---
exports.registerStudent = async (req, res) => {
  const { name, rollNumber, department, section, email, password } = req.body;

  try {
    // 1. Check if a student with this roll number or email already exists to prevent duplicates
    let student = await Student.findOne({ rollNumber });
    if (student) return res.status(400).json({ msg: 'A student with this roll number is already registered.' });

    let studentUser = await StudentUser.findOne({ email });
    if (studentUser) return res.status(400).json({ msg: 'This email is already in use.' });

    // 2. Create the academic record first
    student = new Student({ name, rollNumber, department, section });
    await student.save();

    // 3. Create the login account and link it to the new academic record
    studentUser = new StudentUser({
      email,
      password,
      student: student._id, // Linking the two documents
    });

    // 4. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    studentUser.password = await bcrypt.hash(password, salt);
    await studentUser.save();

    // 5. Create a JWT with a 'student' role
    const payload = {
      user: {
        id: studentUser.id, // The ID of the login account
        studentId: student.id, // The ID of the academic record
        role: 'student',
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during student registration');
  }
};

// --- Student Login ---
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const studentUser = await StudentUser.findOne({ email });
    if (!studentUser) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, studentUser.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    
    // Create the same JWT payload as in signup
    const payload = {
      user: {
        id: studentUser.id,
        studentId: studentUser.student,
        role: 'student',
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};