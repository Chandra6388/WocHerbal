const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const {
  createReview,
  getProductReviews,
  getReview,
  updateReview,
  deleteReview,
  markHelpful,
  getMyReviews,
  getReviewStats,
  getAllReview
} = require('../controllers/reviewController');

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/stats', getReviewStats);

// Protected routes
router.use(protect);

// Review CRUD
router.post('/add', createReview);
router.get('/all', getAllReview);

router.get('/:id', getReview);
router.put('/:id', validate('updateReview'), updateReview);
router.delete('/:id', deleteReview);

// Review interactions
router.put('/:id/helpful', markHelpful);

// User reviews
router.get('/user/me', getMyReviews);

module.exports = router; 