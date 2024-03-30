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

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // Exit the process if MongoDB connection fails
    });

// Check for required environment variables
if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
    console.error('Required environment variables are missing. Make sure to set JWT_SECRET and MONGODB_URI.');
    process.exit(1); // Exit the process if essential environment variables are missing
}

// Use JWT secret key
const jwtSecret = process.env.JWT_SECRET;

// Error handling middleware
app.use(handleError);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', verifyToken, messageRoutes); // Protected route, requires authentication
app.use('/api/profile', verifyToken, profileRoutes); // Protected route, requires authentication

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Server is shutting down...');
    server.close(() => {
        console.log('Server is shut down.');
        process.exit(0);
    });
});
