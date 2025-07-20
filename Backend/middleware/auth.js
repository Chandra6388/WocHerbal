const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Authentication required
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in cookies first, then headers
  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'You are not logged in. Please log in to get access.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // Check if user is active
    if (currentUser.status !== 'active') {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been blocked. Please contact support.'
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token. Please log in again.'
    });
  }
};

// Grant access to specific roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Role (${req.user.role}) is not allowed to access this resource`
      });
    }
    next();
  };
};

exports.adminOnly = (req, res, next) => {
  
  if (req?.body?.user !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// User only access
exports.userOnly = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. User privileges required.'
    });
  }
  next();
};

// Optional authentication - doesn't block if no token
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      if (currentUser && currentUser.status === 'active') {
        req.user = currentUser;
      }
    } catch (error) {
      // Token is invalid, but we don't block the request
    }
  }

  next();
}; 