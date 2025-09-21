const Student = require('../models/Student');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Get total number of students
        const studentCount = await Student.countDocuments();

        // 2. Get total number of teachers (users with role 'teacher')
        const teacherCount = await User.countDocuments({ role: 'teacher' });

        // 3. Calculate today's attendance percentage
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        const presentToday = await Attendance.countDocuments({
            date: today,
            status: 'present'
        });

        // Avoid division by zero if there are no students
        const attendancePercentage = studentCount > 0 
            ? Math.round((presentToday / studentCount) * 100) 
            : 0;

        // Send all stats in one response
        res.json({
            totalStudents: studentCount,
            totalTeachers: teacherCount,
            attendanceToday: attendancePercentage,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};