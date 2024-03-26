// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/users', require('./routes/users'));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
