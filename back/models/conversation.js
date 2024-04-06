const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const ConversationSchema = new Schema(
  {
    participants: {
      type: Array,
      contentType: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creation: { type: Date, required: true },
    update: { type: Date },
  },
  {
    toJSON: { virtuals: true },
  }
);

ConversationSchema.virtual("utc_creation").get(function () {
  return DateTime.fromJSDate(this.creation).toUTC().toISO();
});

module.exports = mongoose.model("Conversation", ConversationSchema);
