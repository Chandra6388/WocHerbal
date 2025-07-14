const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

const {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
  createPayment,
  verifyPayment,
  getOrderStats,
  refundOrder
} = require('../controllers/orderController');

// All routes require authentication
router.use(protect);

// Order routes
router.post('/new', validate('createOrder'), newOrder);
router.get('/me', myOrders);
router.get('/:id', getSingleOrder);
router.delete('/:id', deleteOrder);

// Payment routes
router.post('/create-payment', createPayment);
router.post('/verify-payment', verifyPayment);

// Admin routes
router.get('/admin/all', adminOnly, allOrders);
router.put('/admin/order/:id', adminOnly, updateOrder);
router.get('/admin/stats', adminOnly, getOrderStats);
router.post('/admin/refund/:id', adminOnly, refundOrder);

module.exports = router; 