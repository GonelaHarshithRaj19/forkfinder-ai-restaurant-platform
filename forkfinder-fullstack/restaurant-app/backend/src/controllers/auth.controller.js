const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const sendResponse = (res, statusCode, user) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    message: statusCode === 201 ? 'Account created successfully' : 'Login successful',
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        favorites: user.favorites,
      },
    },
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required', data: null });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered', data: null });
    }
    const user = await User.create({ name, email, password });
    sendResponse(res, 201, user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required', data: null });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials', data: null });
    }
    sendResponse(res, 200, user);
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, message: 'User fetched', data: req.user });
};
