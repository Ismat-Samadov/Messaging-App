// backend/models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: String // Optional field for profile picture URL
});

module.exports = mongoose.model('User', userSchema);
