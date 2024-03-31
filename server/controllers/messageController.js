const Message = require("../models/Message");
const User = require("../models/User");
const Conversation = require("../models/Conversation");

function getRelativeTime(date) {
    const now = Date.now();
    const diff = now - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (days > 0) {
      return `sent ${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `sent ${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `sent ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `sent just now`;
    }
  }

const messageGet = (req, res) => {
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
      res.json(formattedConversations);
  })
  .catch(err => {
      console.error('Error fetching conversations:', err); 
      res.status(500).json({ error: 'Error fetching conversations' });
  });
};

const messagePost = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const { text } = req.body;
    const senderName = req.user.username;
    const receiverUser = await User.findById(req.params.id);

      if (!receiverUser) {
      return res.status(404).json({ message: "Receiver not found" });
    }

      // Find or create conversation between the two users
      let conversation = await Conversation.findOne({
        participants: { $all: [req.user.id, req.params.id] }
      });

      if (!conversation) {
        conversation = new Conversation({
          participants: [req.user.id, req.params.id],
          messages: []
        });
      }

      const message = new Message({
        receiver: receiverUser._id,
        sender: currentUser._id,
        text,
        user: senderName,
        time: new Date()
      });

      await message.save();
      conversation.messages.push(message);
      await conversation.save();

      // Update sender user's conversations
      currentUser.conversations.push(conversation);
      await currentUser.save();

      // Update receiver user's conversations
      receiverUser.conversations.push(conversation);
      await receiverUser.save();

      res.status(201).json({ message: "Message created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { messageGet, messagePost };