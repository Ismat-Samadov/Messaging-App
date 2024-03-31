const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
      const payload = {
        id: user._id,
        username: user.username
      }
      jwt.sign(payload, 'cats', { expiresIn: '3d' }, (err, token) => {
        if (err || !token) {
          return res.status(500).json({ message: 'Internal server error' });
        }
        return res.json({ message: 'Login successful', token: 'Bearer ' + token });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

function verifyJWT(req, res, next) {
  const token = req.headers["authorization"]?.split(' ')[1];
  if (token) {
    jwt.verify(token, 'cats', (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({
          isLoggedIn: false,
          message: "Failed to Authenticate"
        });
      }
      req.user = {
        id: decoded.id,
        username: decoded.username
      };
      next();
    });
  } else {
    res.status(401).json({ message: "Authorization token is missing", isLoggedIn: false });
  }
}


module.exports = { login, verifyJWT };
