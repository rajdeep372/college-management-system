const Notice = require('../models/Notice');

// Get all notices, sorted by newest first
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate('author', 'name') // Replaces the author ID with the teacher's name
      .sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new notice
exports.createNotice = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newNotice = new Notice({
      title,
      content,
      author: req.user.id, // The teacher's ID comes from the auth token
    });
    const notice = await newNotice.save();
    // Populate the author's name in the response for immediate UI update
    const populatedNotice = await Notice.findById(notice._id).populate('author', 'name');
    res.status(201).json(populatedNotice);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a notice
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ msg: 'Notice not found' });
    }
    // Security check: Ensure the user deleting the notice is the one who created it
    if (notice.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Notice removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};