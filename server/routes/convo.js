const express = require('express');
const router = express.Router();
const { verifyJWT }   = require('../controllers/loginController');
const { convoGet } = require('../controllers/ConvoController');

router.get('/:id', verifyJWT, convoGet);

module.exports = router;