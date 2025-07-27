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
  createReview
} = require('../controllers/reviewController');


// Review CRUD
router.post('/add', createReview);
router.get('/all', getAllReview);
router.get('/', getAllUserReview);
router.post('/like', LikeReview);
router.post('/dislike', DislikeReview);
router.delete('/delete', deleteReview);


module.exports = router; 