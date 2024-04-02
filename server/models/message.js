const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  conversation_id: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  isRead: { type: Boolean, default: false },
});

MessageSchema.virtual("utc_timestamp").get(function () {
  return DateTime.fromJSDate(this.timestamp).toUTC().toISO();
});

module.exports = mongoose.model("Message", MessageSchema);
