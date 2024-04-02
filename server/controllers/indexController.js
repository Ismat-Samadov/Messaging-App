const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signupGet = (req, res) => {
  User.find()
    .then(users => {
      if (users.length === 0) {
        console.log('No users found');
        return res.status(404).json({ message: 'No users found' });
      }
      console.log('Users found:', users);
      res.json(users);
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Error fetching users' });
    });
};

const signupPost = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('Received signup request:', { username, email });

    if (!password || typeof password !== 'string') {
      console.log('Invalid password format');
      return res.status(400).json({ message: "Invalid password format" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed:', hashedPassword);

    const user = new User({ username, email, password: hashedPassword });
    console.log('User object created:', user);

    await user.save();
    console.log('User saved to database');

    const payload = {
      id: user._id,
      username: user.username
    };

    jwt.sign(payload, 'cats', { expiresIn: 86400 }, (err, token) => {
      if (err || !token) {
        console.error('Error generating token:', err);
        return res.status(500).json({ message: 'Error generating token' });
      }
      console.log('Token generated:', token);
      res.status(201).json({ success: true, message: 'Registration successful', token });
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { signupGet, signupPost };
