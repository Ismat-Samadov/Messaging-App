const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Log the request payload to verify the username and password
    console.log('Request payload:', req.body);

    console.log('Attempting to log in with username:', username);

    const user = await User.findOne({ username });
    if (!user) {
      console.log('User not found:', username);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    // Log the hashed password from the database
    console.log('Hashed password from database:', user.password);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Incorrect password for user:', username);
      return res.status(401).json({ message: 'Incorrect password' });
    }

    console.log('Password verified for user:', username);

    const payload = {
      id: user._id,
      username: user.username
    };

    jwt.sign(payload, 'cats', { expiresIn: '3d' }, (err, token) => {
      if (err || !token) {
        console.error('Error signing token:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      console.log('Token signed successfully for user:', username);

      return res.json({ message: 'Login successful', token: 'Bearer ' + token });
    });
  } catch (error) {
    console.error('Error during login:', error);
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
      console.log('Token verified successfully');
      next();
    });
  } else {
    console.log('Authorization token is missing');
    res.status(401).json({ message: "Authorization token is missing", isLoggedIn: false });
  }
}

module.exports = { login, verifyJWT };