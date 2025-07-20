const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const {
  getUserProfile,
  updateProfile,
  updateAvatar,
  getUserOrders,
  getUserReviews,
  getUserProducts,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUserStats
} = require('../controllers/userController');



// Profile routes
router.get('/profile', getUserProfile);
router.put('/profile/update', validate('updateProfile'), updateProfile);
router.put('/avatar', updateAvatar);

// Orders routes
router.get('/orders', getUserOrders);

// Reviews routes
router.get('/reviews', getUserReviews);

// Products routes
router.get('/products', getUserProducts);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist/add', addToWishlist);
router.delete('/wishlist/remove/:productId', removeFromWishlist);

// Favorites routes
router.post('/favorites', getFavorites);
router.post('/favorites/add', addToFavorites);
router.delete('/favorites/remove/:productId', removeFromFavorites);

// Notifications routes
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);
router.put('/notifications/read-all', markAllNotificationsAsRead);

// Statistics routes
router.get('/stats', getUserStats);

module.exports = router; 