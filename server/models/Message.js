const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  // The teacher who sent the message
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This links to the teacher's User model
    required: true,
  },
  // The student who will receive the message
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // This links to the student's academic record
    required: true,
  },
  // The content of the message
  message: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema);