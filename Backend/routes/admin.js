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
  deleteUser
} = require('../controllers/adminController');
const { getServiceability } = require('../controllers/rocketShippment');
// All routes require admin authentication
router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getDashboardStats);
router.post('/users', getAllUsers);
router.put('/users/updateUserStatus/:id', updateUserStatus);
router.get('/users/:id', getUserDetails);
router.post('/users/delete/:id', deleteUser);
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/approve', approveReview);
router.post('/notifications/send', sendNotification);
router.get('/help-requests', getHelpRequests);
router.post('/help-requests/:id/respond', respondToHelpRequest);
router.get('/sales-report', getSalesReport);


//shiiping 

router.post('/shipping/getServiceability', getServiceability);

module.exports = router; 