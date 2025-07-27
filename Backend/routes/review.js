const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const {
  getAllUserReview,
  getAllReview,
  LikeReview,
  DislikeReview,
  deleteReview,
  createReview,
  approveReview
} = require('../controllers/reviewController');


// Review CRUD
router.post('/add', createReview);
router.get('/all', getAllReview);
router.get('/', getAllUserReview);
router.post('/like', LikeReview);
router.post('/dislike', DislikeReview);
router.post('/delete', deleteReview);
router.post('/approve', approveReview);


module.exports = router; 