const express = require('express');
const router = express.Router();
const { protect, adminOnly, isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

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
  getSalesReport,
} = require('../controllers/adminController');

const { getServiceability } = require('../controllers/rocketShippment');

// All routes require admin authentication
router.use(protect);
router.use(adminOnly);

// Dashboard routes
router.get('/dashboard', getDashboardStats);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/users/:id', getUserDetails);

// Add user (POST)
// router.post('/users/add', isAuthenticatedUser, authorizeRoles('admin'), addUser);

// Update user (POST)
// router.post('/users/update', isAuthenticatedUser, authorizeRoles('admin'), adminController.updateUser);

// Delete user (POST)
// router.post('/users/delete', isAuthenticatedUser, authorizeRoles('admin'), adminController.deleteUser);

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


//shiiping 

router.post('/shipping/getServiceability', getServiceability);

module.exports = router; 