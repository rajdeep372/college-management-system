const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  routine: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  status: { type: String, enum: ['present', 'absent'], required: true },
}, { timestamps: true });

// The CORRECT unique index: A student can only have one status for a specific class on a specific day.
AttendanceSchema.index({ student: 1, routine: 1, date: 1 }, { unique: true });

// The CORRECT export line to prevent the "OverwriteModelError" on server restart.
module.exports = mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);