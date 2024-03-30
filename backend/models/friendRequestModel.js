const { default: mongoose, Schema } = require('mongoose');

const friendRequestSchema = new Schema({
  sender: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FriendRequest', friendRequestSchema);
