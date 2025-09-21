const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config(); // Make sure dotenv is configured at the top

// Initialize Express app
const app = express();

// Enable CORS for all routes - This is important for cross-origin requests
app.use(cors());

// Init Middleware to parse JSON bodies
app.use(express.json());

// Connect to Database
connectDB();

// --- API Routes ---
// This is a simple health check route to confirm the API is running
app.get('/api', (req, res) => res.json({ msg: 'API is running successfully' }));

// Define all other routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/student-auth', require('./routes/studentAuth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/routines', require('./routes/routines'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/dashboard', require('./routes/dashboard'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));