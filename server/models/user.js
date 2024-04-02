const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

// The variable usernameLowerCase is created to prevent users from creating accounts with the same username
// despite different cases. This ensures uniqueness and helps prevent user confusion.
// It stores the lowercase version of the username, which is used for comparison during account creation
// and validation processes to enforce case-insensitive uniqueness.
const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    usernameLowerCase: { type: String, required: true },
    email: { type: String, required: true },
    first_name: { type: String, required: true },
    password: { type: String, required: true },
    creation: { type: Date, required: true },
    bio: { type: String },
    profile_pic_src: { data: String },
    following: {
      type: Array,
      contentType: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

UserSchema.virtual("utc_creation").get(function () {
  return DateTime.fromJSDate(this.creation).toUTC().toISO();
});

module.exports = mongoose.model("User", UserSchema);
