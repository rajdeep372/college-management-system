const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Allows us to accept JSON data in the body

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/student-auth', require('./routes/studentAuth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/routines', require('./routes/routines'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/dashboard', require('./routes/dashboard')); 

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));