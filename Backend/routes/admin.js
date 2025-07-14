const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');

const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getUserDetails,
  getAllReviews,
  approveReview,
  sendNotification,
  getHelpRequests,
  respondToHelpRequest,
  getSalesReport
} = require('../controllers/adminController');

// All routes require admin authentication
router.use(protect);
router.use(adminOnly);

// Dashboard routes
router.get('/dashboard', getDashboardStats);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/users/:id', getUserDetails);

// Review management routes
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/approve', approveReview);

// Notification routes
router.post('/notifications/send', sendNotification);

// Help request routes
router.get('/help-requests', getHelpRequests);
router.post('/help-requests/:id/respond', respondToHelpRequest);

// Sales and analytics routes
router.get('/sales-report', getSalesReport);

module.exports = router; 