const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'southern_impex_jwt_master_secret_key_2026_xyz', {
    expiresIn: '30d'
  });
};

// @desc    Admin authentication & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide username and password' });
    }

    const cleanEmail = email.trim().toLowerCase();

    let user = await User.findOne({ email: cleanEmail });

    // Fallback: If master admin does not exist in DB yet, auto-create
    if (!user && cleanEmail === 'southan_impex@2026' && password === 'southan_impex@#@#34') {
      user = await User.create({
        name: 'Southern Impex Admin',
        email: 'southan_impex@2026',
        password: 'southan_impex@#@#34',
        role: 'admin'
      });
    }

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  getMe
};
