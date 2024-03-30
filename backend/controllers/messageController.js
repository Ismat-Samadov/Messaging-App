const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { isValidObjectId } = require('mongoose');
const path = require('path');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const cloudinary = require('cloudinary').v2;

const Chatroom = require('../models/chatroomModel');
const Message = require('../models/messageModel');

exports.create = [
  upload.single('file'),
  body('content', 'Message Content is required').trim().notEmpty(),
  body('chatroom', 'Chatroom ID is required')
    .trim()
    .notEmpty()
    .custom((value) => isValidObjectId(value))
    .withMessage('Invalid Chatroom'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(401).json({ err: errors.array(), type: 'bodyValidation' });

    // Validate File Extension
    const fileExtension = req.file ? path.extname(req.file.originalname).toLowerCase() : null;
    if (fileExtension && fileExtension !== '.jpg' && fileExtension !== '.png' && fileExtension !== '.jpeg') {
      return res.status(400).json({ err: 'Wrong file format' });
    }

    const fileSize = req.file ? req.file.size : null;
    if (fileSize && fileSize > 800000) return res.status(400).json({ err: 'File too large, must be 800kb or smaller' });

    // cloudinary configuration
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    const chatroom = await Chatroom.findById(req.body.chatroom);
    if (!chatroom) return res.status(404).json({ err: 'Chatroom not found' });

    if (!chatroom.participants.includes(req.user._id)) return res.status(401).json({ err: 'You are not in that chatroom' });

    const image = fileExtension
      ? await new Promise((resolve) => {
          cloudinary.uploader
            .upload_stream((e, uploadResult) => {
              return resolve(uploadResult);
            })
            .end(req.file.buffer);
        })
      : null;

    const newMessage = new Message({ content: req.body.content, author: req.user._id, chatroom: req.body.chatroom, imgUrl: image ? image.url : null });
    await newMessage.save();

    await Chatroom.findByIdAndUpdate(req.body.chatroom, { $push: { messages: newMessage._id } });

    return res.json(newMessage);
  })
];
