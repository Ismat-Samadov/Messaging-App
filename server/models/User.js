const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  conversations: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }]
});

module.exports = mongoose.model("User", UserSchema);