// backend/profile/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('./profileController');

// Update user profile
router.put('/:userId', profileController.updateProfile);

module.exports = router;
