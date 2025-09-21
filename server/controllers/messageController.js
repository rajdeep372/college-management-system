const Message = require('../models/Message');

// Send a new message to a student
exports.sendMessage = async (req, res) => {
  const { message } = req.body;
  const teacherId = req.user.id; // From the auth token
  const studentId = req.params.studentId; // From the URL

  try {
    // Create the new message document
    const newMessage = new Message({
      teacher: teacherId,
      student: studentId,
      message,
    });
    
    // Save it to the database
    const savedMessage = await newMessage.save();

    // Populate the 'teacher' field to include the teacher's name in the response
    // This is so the UI can display it immediately without another request
    const populatedMessage = await Message.findById(savedMessage._id).populate('teacher', 'name');

    res.status(201).json(populatedMessage);

  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).send('Server Error');
  }
};