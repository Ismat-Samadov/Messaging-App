const { default: mongoose, Schema } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  friends: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
      },
      chatroom: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Chatroom'
      }
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
