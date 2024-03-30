// backend/profile/profileController.js
const User = require('../models/User');

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, profilePicture } = req.body;
        await User.findByIdAndUpdate(userId, { username, profilePicture });
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile' });
    }
};
