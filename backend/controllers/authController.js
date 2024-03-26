// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register user
exports.registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if user exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Create new user
        user = new User({ username, password });
        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        // Save user
        await user.save();
        res.json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
