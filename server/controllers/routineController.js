const Routine = require('../models/Routine');

// Add a new routine item
exports.addRoutineItem = async (req, res) => {
    // Updated destructuring to use 'department'
    const { day, time, subject, teacher, department, section } = req.body;
    try {
        const newRoutineItem = new Routine({ day, time, subject, teacher, department, section });
        const routineItem = await newRoutineItem.save();
        res.json(routineItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get all routine items (no changes needed here)
exports.getAllRoutines = async (req, res) => {
    try {
        const routines = await Routine.find().sort({ day: 1, time: 1 });
        res.json(routines);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};