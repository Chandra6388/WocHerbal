const User = require('../models/User');
const sendToken = require('../utils/sendToken');
const ErrorHandler = require('../utils/errorHandler');
const crypto = require('crypto');

// Register user => /api/auth/register
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address
    });

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        status: 'error',
        message: 'Please enter email & password'
      });
    }

    const userData = await User.findOne({ email }).select('password status');
    if (!userData) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid Email or Password'
      });
    }
    const isPasswordMatched = await userData.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid Email or Password'
      });
    }
    console.log("userData.status", userData.status);
    if (userData.status !== 'active') {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been blocked. Please contact support.'
      });
    }
    userData.lastLogin = Date.now();
    await userData.save();
    sendToken(userData, 200, res);


  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req?.body?.id);
    res.status(200).json({ status: 'success', user });
  } catch (error) {
    next(error);
  }
};



exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
      return res.status(400).json({
        status: 'error',
        message: 'Old password is incorrect'
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found with this email'
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

    try {
      res.status(200).json({
        status: 'success',
        message: `Email sent to: ${user.email}`
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: 'error',
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Password reset token is invalid or has expired'
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Password does not match'
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please enter email & password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid Email or Password'
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid Email or Password'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin privileges required.'
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been blocked. Please contact support.'
      });
    }

    user.lastLogin = Date.now();
    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
}; 