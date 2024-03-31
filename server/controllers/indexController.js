const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signupGet = (req, res) => {
  User.find()
    .then(users => {
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
      res.json(users);
    })
    .catch(err => res.status(500).json({ error: 'Error fetching users' }));
};

const signupPost = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: "Invalid password format" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    const payload = {
      id: user._id,
      username: user.username
    };

    jwt.sign(payload, 'cats', { expiresIn: 86400 }, (err, token) => {
      if (err || !token) {
        console.error(err);
        return res.status(500).json({ message: 'Error generating token' });
      }
      res.status(201).json({ success: true, message: 'Registration successful', token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { signupGet, signupPost };