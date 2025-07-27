const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ErrorHandler = require('../utils/errorHandler');

exports.createReview = async (req, res, next) => {
  try {
    const { productId,  rating, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== req.user.id) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found or not authorized'
      });
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already reviewed this product'
      });
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      order: orderId,
      rating,
      title,
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

exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, rating, sort = 'createdAt' } = req.query;

    const query = { 
      product: productId, 
      status: 'approved' 
    };
    
    if (rating) query.rating = rating;

    let sortOption = {};
    if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'helpful') sortOption = { 'helpful.length': -1 };
    else sortOption = { createdAt: -1 };

    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments(query);

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { product: productId, status: 'approved' } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    const ratingDistribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };

    if (ratingStats[0]) {
      ratingStats[0].ratingDistribution.forEach(rating => {
        ratingDistribution[rating]++;
      });
    }

    res.status(200).json({
      status: 'success',
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalReviews: count,
      stats: {
        averageRating: ratingStats[0]?.avgRating || 0,
        totalReviews: ratingStats[0]?.totalReviews || 0,
        ratingDistribution
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('product', 'name images');

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    res.status(200).json({
      status: 'success',
      review
    });
  } catch (error) {
    next(error);
  }
};

exports.updateReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this review'
      });
    }

    review.rating = rating;
    review.title = title;
    review.comment = comment;
    review.status = 'pending'; // Reset approval status

    await review.save();

    res.status(200).json({
      status: 'success',
      review
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

exports.markHelpful = async (req, res, next) => {
  try {
    const { helpful } = req.body; // true or false

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    // Check if user has already marked this review
    const existingHelpful = review.helpful.find(
      h => h.user.toString() === req.user.id
    );

    if (existingHelpful) {
      // Update existing helpful mark
      existingHelpful.helpful = helpful;
    } else {
      // Add new helpful mark
      review.helpful.push({
        user: req.user.id,
        helpful: helpful
      });
    }

    await review.save();

    res.status(200).json({
      status: 'success',
      message: `Review marked as ${helpful ? 'helpful' : 'not helpful'}`
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const reviews = await Review.find(query)
      .populate('product', 'name images')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments(query);

    res.status(200).json({
      status: 'success',
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalReviews: count
    });
  } catch (error) {
    next(error);
  }
};

exports.getReviewStats = async (req, res, next) => {
  try {
    const { productId } = req.query;

    const query = { status: 'approved' };
    if (productId) query.product = productId;

    const stats = await Review.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    const ratingDistribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };

    if (stats[0]) {
      stats[0].ratingDistribution.forEach(rating => {
        ratingDistribution[rating]++;
      });
    }

    res.status(200).json({
      status: 'success',
      stats: {
        totalReviews: stats[0]?.totalReviews || 0,
        averageRating: stats[0]?.avgRating || 0,
        ratingDistribution
      }
    });
  } catch (error) {
    next(error);
  }
}; 