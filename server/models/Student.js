const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  section: { type: String, required: true },
  department: { type: String, required: true },
  attendancePoints: { type: Number, default: 0 },
}, { timestamps: true });

// THIS IS THE UPDATED LINE
module.exports = mongoose.models.Student || mongoose.model('Student', StudentSchema);