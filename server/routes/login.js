const express = require("express");
const router = express.Router();
const { login, verifyJWT } = require('../controllers/loginController');

router.get('/', verifyJWT, (req, res) => {
    res.json({ isLoggedIn: true, user: req.user})
});

router.post('/', login);

module.exports = router;