const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Routine = require('../models/Routine');
const Message = require('../models/Message'); // Import the Message model

// Add a new student
exports.addStudent = async (req, res) => {
  const { name, rollNumber, section, department } = req.body;
  try {
    const newStudent = new Student({ name, rollNumber, section, department });
    const student = await newStudent.save();
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all students for the main list
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update an existing student's details
exports.updateStudent = async (req, res) => {
  const { name, rollNumber, section, department } = req.body;
  try {
    let student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: { name, rollNumber, section, department } },
      { new: true }
    );
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Search for students based on criteria (for Reports page)
exports.searchStudents = async (req, res) => {
  try {
    const { department, section, attendanceOperator, attendancePoints } = req.body;
    const query = {};
    if (department) { query.department = department; }
    if (section) { query.section = section; }
    if (attendanceOperator && attendancePoints !== undefined && attendancePoints !== '') {
      const points = Number(attendancePoints);
      if (attendanceOperator === 'gte') { query.attendancePoints = { $gte: points }; }
      if (attendanceOperator === 'lte') { query.attendancePoints = { $lte: points }; }
      if (attendanceOperator === 'eq') { query.attendancePoints = { $eq: points }; }
    }
    const students = await Student.find(query).sort({ name: 1 });
    res.json(students);
  } catch (err) {
    console.error("Student search error:", err);
    res.status(500).send('Server Error during student search');
  }
};

// Get a single student's complete profile, including their attendance and messages
exports.getStudentById = async (req, res) => {
  try {
    // Fetch student details, their attendance, and their messages in parallel for efficiency
    const [student, attendanceHistory, messages] = await Promise.all([
      Student.findById(req.params.id),
      Attendance.find({ student: req.params.id }).populate('routine').sort({ date: -1 }),
      Message.find({ student: req.params.id }).populate('teacher', 'name').sort({ createdAt: -1 })
    ]);

    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Return all the fetched data in one response
    res.json({ student, attendanceHistory, messages });

  } catch (err) {
    console.error("Error fetching student profile:", err);
    res.status(500).send('Server Error');
  }
};