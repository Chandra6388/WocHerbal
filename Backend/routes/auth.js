const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const {
  registerUser,
  loginUser,
  logout,
  getUserProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  adminLogin
} = require('../controllers/authController');

// Public routes
router.post('/register', validate('register'), registerUser);
router.post('/login', validate('login'), loginUser);
router.post('/admin/login', validate('login'), adminLogin);
router.post('/password/forgot', forgotPassword);
router.post('/password/reset/:token', resetPassword);
router.post('/getUserProfile', getUserProfile);

// Protected routes
router.use(protect);
router.get('/logout', logout);
router.put('/password/update', updatePassword);

module.exports = router; 