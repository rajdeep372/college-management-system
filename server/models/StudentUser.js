const mongoose = require('mongoose');

const StudentUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // This creates a direct link to the student's main data record
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.models.StudentUser || mongoose.model('StudentUser', StudentUserSchema);