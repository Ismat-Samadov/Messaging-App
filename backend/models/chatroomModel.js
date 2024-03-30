const { default: mongoose, Schema } = require('mongoose');

const chatroomModel = new Schema(
  {
    title: {
      type: String,
      trim: true
    },
    participants: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
      }
    ],
    messages: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Message'
      }
    ],
    admin: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chatroom', chatroomModel);
