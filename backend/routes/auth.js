const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const buildTokenPayload = (user) => ({
  id: user._id,
  email: user.email,
  role: user.role,
});

const sendAuthResponse = (user, res, status = 200) => {
  const token = jwt.sign(buildTokenPayload(user), JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return res.status(status).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = await User.create({ name, email, password, role });
    return sendAuthResponse(user, res, 201);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to register user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing credentials' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return sendAuthResponse(user, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Unable to login user',
      error: error.message,
    });
  }
});

module.exports = router;