const mongoose = require("mongoose");
const { Schema } = mongoose;

const ConversationSchema = new Schema({
  id: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

module.exports = mongoose.model("Conversation", ConversationSchema);