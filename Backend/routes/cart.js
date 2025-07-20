const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  getCartSummary
} = require('../controllers/cartController');

// All routes require authentication
router.use(protect);

// Cart routes
router.post('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.delete('/clear', clearCart);

// Coupon routes
router.post('/coupon', applyCoupon);
router.delete('/coupon/remove', removeCoupon);

// Summary routes
router.get('/summary', getCartSummary);

module.exports = router; 