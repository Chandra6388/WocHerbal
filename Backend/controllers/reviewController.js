const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ErrorHandler = require('../utils/errorHandler');

exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment, user } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    const review = await Review.create({
      user: user,
      productId,
      rating,
      comment
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({
      status: 'success',
      review
    });
  } catch (error) {
    next(error);
  }
};

exports.LikeReview = async (req, res, next) => {
  try {
    const { reviewId } = req.body;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }
    review.likes += 1;
    await review.save();
    res.status(200).json({
      status: 'success',
      message: 'Review liked successfully',
      likes: review.likes
    });
  } catch (error) {
    next(error);
  }
};

exports.DislikeReview = async (req, res, next) => {
  try {
    const { reviewId } = req.body;
    const review = await Review.findById(reviewId);
    if (!review) {  
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }
    review.dislikes += 1;
    await review.save();    
    res.status(200).json({
      status: 'success',
      message: 'Review disliked successfully',
      dislikes: review.dislikes
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this review'
      });
    }

    await review.remove();

    res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllReview = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .sort('-createdAt')
      .populate('productId', 'name images')
      .populate('user', 'name avatar');

    res.status(200).json({
      status: 'success',
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong while fetching reviews',
      error: error.message
    });
  }
};

exports.getAllUserReview = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'approved' })
      .sort('-createdAt')
      .populate('productId', 'name images')

    res.status(200).json({
      status: 'success',
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong while fetching user reviews',
      error: error.message
    });
  }
};
