const Conversation = require("../models/Conversation");

const convoGet = async (req, res) => {
    const currentUser = req.user.id;
    const receiverId = req.params.id; 
    
    Conversation.find({ 
        participants: { $all: [currentUser, receiverId] } 
    })
    .populate('participants') 
    .populate('messages')
    .then(conversations => {
        if (conversations.length === 0) {
            return res.status(404).json({ message: 'No conversations found' });
        }
        const formattedConversations = conversations.map(conversation => {
            const receiver = conversation.participants.find(participant => participant._id.toString() !== currentUser);
            const formattedMessages = conversation.messages.map(message => ({
                text: message.text,
                image: message.image,
                time: getRelativeTime(new Date(message.time)),
                sender: message.sender,
                receiver: message.receiver
            }));
            return {
                _id: conversation._id,
                participants: conversation.participants,
                receiver: receiver, 
                messages: formattedMessages
            };
        });
        console.log(receiverId); 
        res.json(formattedConversations);
    })
    .catch(err => {
        console.error('Error fetching conversations:', err); 
        res.status(500).json({ error: 'Error fetching conversations' });
    });
};

module.exports = { convoGet };


