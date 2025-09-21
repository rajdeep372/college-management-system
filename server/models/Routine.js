const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({
  day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  time: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  department: { type: String, required: true }, // Changed 'class' to 'department'
  section: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Routine', RoutineSchema);