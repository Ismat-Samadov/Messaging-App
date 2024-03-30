// backend/messages/messageController.js
const Message = require('../models/Message');

// Send message
exports.sendMessage = async (req, res) => {
    try {
        const { senderId, recipientId, content } = req.body;
        const message = new Message({ senderId, recipientId, content });
        await message.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message' });
    }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
    try {
        const { senderId, recipientId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId, recipientId },
                { senderId: recipientId, recipientId: senderId }
            ]
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages' });
    }
};
