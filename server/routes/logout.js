const express = require("express");
const router = express.Router();
const { logoutUser } = require('../controllers/logoutController');

router.post('/', logoutUser);

module.exports = router;