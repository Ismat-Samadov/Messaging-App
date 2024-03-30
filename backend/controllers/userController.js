const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { isValidObjectId } = require('mongoose');

const Chatroom = require('../models/chatroomModel');
const User = require('../models/userModel');

exports.getChats = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ err: 'User not found' });

  if (!req.user._id.equals(req.params.id) && req.user.username !== 'admin') return res.status(401).json({ err: 'You need to be an admin to do that' });

  const chatrooms = await Chatroom.find({ participants: req.params.id })
    .populate({ path: 'participants', select: '-password' })
    .populate({ path: 'messages', populate: { path: 'author', select: '-password' }, options: { sort: { createdAt: -1 } } })
    .sort({ updatedAt: -1 });

  return res.json({ chatrooms, count: chatrooms.length });
});

exports.getFriends = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ err: 'User not found' });

  if (!req.user._id.equals(req.params.id) && req.user.username !== 'admin') return res.status(401).json({ err: 'You need to be an admin to do that' });

  const user = await User.findById(req.params.id).populate({ path: 'friends', populate: { path: 'user', select: '-password' } });

  return res.json({ friends: user.friends });
});

exports.deleteFriend = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ err: 'User not found' });
  if (!isValidObjectId(req.params.friendId)) return res.status(404).json({ err: 'Friend not found' });

  if (req.params.id !== req.user._id.toString()) return res.status(401).json({ err: 'Unauthorized' });

  const user = req.user;
  const friend = await User.findById(req.params.friendId);
  if (!friend) return res.status(404).json({ err: 'Friend not found' });

  const friendShip = user.friends.find((e) => e.user.toString() === req.params.friendId);
  if (!friendShip) return res.status(404).json({ err: 'Users are not friends' });

  const updatedUser = await User.findByIdAndUpdate(req.user._id, { $pull: { friends: { user: req.params.friendId } } }, { new: true });
  const updatedFriend = await User.findByIdAndUpdate(req.params.friendId, { $pull: { friends: { user: req.user._id } } }, { new: true });

  await Chatroom.findByIdAndDelete(friendShip.chatroom);

  return res.json({ updatedUser, updatedFriend });
});

exports.findUsers = [
  body('username', 'Username cannot be empty').notEmpty(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(401).json({ err: errors.array(), type: 'bodyValidation' });

    const users = await User.find({ username: { $regex: req.body.username, $options: 'i' } })
      .select('-password')
      .limit(10);

    return res.json({ users, count: users.length });
  })
];
