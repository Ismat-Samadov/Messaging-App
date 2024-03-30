// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./auth/authRoutes');
const messageRoutes = require('./messages/messageRoutes');
const profileRoutes = require('./profile/profileRoutes');
const { verifyToken } = require('./middleware/authMiddleware');
const { handleError } = require('./middleware/errorMiddleware');
require('dotenv').config();


const app = express();
app.use(express.json());

// backend/server.js
const mongoose = require('mongoose');

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// Use JWT secret key
const jwtSecret = process.env.JWT_SECRET;


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', verifyToken, messageRoutes); // Protected route, requires authentication
app.use('/api/profile', verifyToken, profileRoutes); // Protected route, requires authentication

// Error handling middleware
app.use(handleError);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
