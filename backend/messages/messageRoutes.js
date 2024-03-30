// backend/messages/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('./messageController');

// Send message
router.post('/', messageController.sendMessage);

// Get messages between two users
router.get('/:senderId/:recipientId', messageController.getMessages);

module.exports = router;
