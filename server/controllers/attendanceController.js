const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Mark attendance for a specific class session (routine)
exports.markAttendance = async (req, res) => {
  const { routineId, date, studentStatuses } = req.body; 

  try {
    // This robust operation prevents server crashes on upsert (update or insert).
    const operations = studentStatuses.map(item => ({
        updateOne: {
            filter: { student: item.studentId, routine: routineId, date: date },
            update: {
                $set: { status: item.status },
                // This ensures student, routine, and date are only set when a NEW document is created.
                $setOnInsert: {
                    student: item.studentId,
                    routine: routineId,
                    date: date
                }
            },
            upsert: true,
        },
    }));

    await Attendance.bulkWrite(operations);
    
    // Update attendance points for present students
    for (const item of studentStatuses) {
        if (item.status === 'present') {
            await Student.findByIdAndUpdate(item.studentId, { $inc: { attendancePoints: 1 } });
        }
    }
    
    res.status(201).json({ msg: 'Attendance marked successfully' });
  } catch (err) {
    // Provides detailed error logging in your backend terminal if something goes wrong.
    console.error("--- ATTENDANCE SUBMISSION CRASH ---");
    console.error(err);
    console.error("--- END OF CRASH REPORT ---");
    res.status(500).send('Server Error');
  }
};