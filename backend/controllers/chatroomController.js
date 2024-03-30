const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { isValidObjectId } = require('mongoose');

const Chatroom = require('../models/chatroomModel');
const User = require('../models/userModel');
const Message = require('../models/messageModel');

exports.create = [
  body('participants', 'You need to pass the members of the chatrooms')
    .notEmpty()
    .isArray({ min: 2 })
    .withMessage('There must be at least 2 members')
    .custom((value) => value.length === new Set(value).size)
    .withMessage('All participants must be unique'),
  body('participants.*')
    .custom((value) => isValidObjectId(value))
    .withMessage('Invalid User ID'),
  body('title', 'Title cannot be longer than 45 characters').optional().isLength({ max: 45 }),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(401).json({ err: errors.array(), type: 'bodyValidation' });

    const users = await Promise.all(req.body.participants.map((e) => User.findById(e)));

    const userNotFound = users.findIndex((el) => el === null);

    if (!userNotFound) return res.status(500).json({ err: `The user ${req.body.participants[userNotFound]} does not exist.` });

    const newChatroom = new Chatroom({
      participants: req.body.participants,
      admin: req.user._id
    });

    if (req.body.title) newChatroom.title = req.body.title;

    await newChatroom.save();

    return res.json({ newChatroom });
  })
];

exports.delete = asyncHandler(async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ err: 'Chatroom not found' });

  const chatroom = await Chatroom.findById(req.params.id);
  if (!chatroom) return res.status(404).json({ err: 'Chatroom not found' });

  if (req.user.username !== 'admin' && !req.user._id.equals(chatroom.admin)) return res.status(401).json({ err: 'You need to be an admin' });

  const messagesToDelete = chatroom.messages.map((e) => Message.findByIdAndDelete(e));

  await Promise.all(messagesToDelete);

  await Chatroom.findByIdAndDelete(req.params.id);

  return res.json({ chatroom });
});

exports.edit = [
  body('title', 'Title cannot be longer than 15 characters').optional().isLength({ max: 15 }),
  body('participants')
    .optional()
    .isArray()
    .withMessage('Participants must be an array')
    .custom((value) => value.length === new Set(value).size)
    .withMessage('All participants must be unique'),
  body('participants.*')
    .optional()
    .custom((value) => isValidObjectId(value))
    .withMessage('Invalid User ID')
    .custom(async (value) => {
      const userExists = await User.findById(value);
      if (!userExists) throw new Error('User does not exist');
    })
    .withMessage((value) => `User ${value} not found`),

  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) return res.status(404).json({ err: 'Chatroom not found' });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(401).json({ err: errors.array(), type: 'bodyValidation' });

    const chatroom = await Chatroom.findById(req.params.id);
    if (!chatroom) return res.status(404).json({ err: 'Chatroom not found' });

    if (req.user.username !== 'admin' && !req.user._id.equals(chatroom.admin)) return res.status(401).json({ err: 'You need to be an admin' });

    const editedChatroom = await Chatroom.findByIdAndUpdate(req.params.id, req.body, { new: true });

    return res.json({ editedChatroom });
  })
];
