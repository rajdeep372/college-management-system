const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  // This links to the teacher who created the notice
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);