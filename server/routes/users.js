const express = require('express');
const router = express.Router();
const { verifyJWT }   = require('../controllers/loginController');
const { login } = require('../controllers/loginController');
const { messageGet, messagePost } = require('../controllers/messageController');
const { convoGet } = require('../controllers/ConvoController');

router.get('/users', verifyJWT, login, messageGet);
router.get('/users/:id', verifyJWT, messageGet, convoGet);

router.post('/users/:id', verifyJWT, messagePost);

module.exports = router;