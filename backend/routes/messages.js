// routes/messages.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Send message
router.post('/', async (req, res) => {
    try {
        const { sender, receiver, text } = req.body;
        const message = new Message({ sender, receiver, text });
        await message.save();
        res.json(message);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
