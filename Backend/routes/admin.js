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

router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getDashboardStats);

router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/users/:id', getUserDetails);
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/approve', approveReview);
router.post('/notifications/send', sendNotification);
router.get('/help-requests', getHelpRequests);
router.post('/help-requests/:id/respond', respondToHelpRequest);
router.get('/sales-report', getSalesReport);

module.exports = router; 