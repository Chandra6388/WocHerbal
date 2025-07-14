const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const ErrorHandler = require('../utils/errorHandler');

// Get user profile => /api/user/profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      status: 'success',
      user
    });
  } catch (error) {
    next(error);
  }
};



// Update user profile => /api/user/profile/update
exports.updateProfile = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    res.status(200).json({
      status: 'success',
      user
    });
  } catch (error) {
    next(error);
  }
};



// Update user avatar => /api/user/avatar
exports.updateAvatar = async (req, res, next) => {
  try {
    const avatar = {
      public_id: req.body.public_id,
      url: req.body.url
    };

    const user = await User.findByIdAndUpdate(req.user.id, avatar, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    res.status(200).json({
      status: 'success',
      user
    });
  } catch (error) {
    next(error);
  }
};

// Get user orders => /api/user/orders
exports.getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };
    if (status) query.orderStatus = status;

    const orders = await Order.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      status: 'success',
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalOrders: count
    });
  } catch (error) {
    next(error);
  }
};

// Get user reviews => /api/user/reviews
exports.getUserReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: req.user.id })
      .populate('product', 'name images')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments({ user: req.user.id });

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

// Get user products => /api/user/products
exports.getUserProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, approvalStatus } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;
    if (approvalStatus) query.approvalStatus = approvalStatus;

    const products = await Product.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.status(200).json({
      status: 'success',
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    next(error);
  }
};

// Get user wishlist => /api/user/wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');

    res.status(200).json({
      status: 'success',
      wishlist: user.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// Add to wishlist => /api/user/wishlist/add
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user.id);

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Product already in wishlist'
      });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Product added to wishlist'
    });
  } catch (error) {
    next(error);
  }
};

// Remove from wishlist => /api/user/wishlist/remove
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(
      id => id.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    next(error);
  }
};

// Get user favorites => /api/user/favorites
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');

    res.status(200).json({
      status: 'success',
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};

// Add to favorites => /api/user/favorites/add
exports.addToFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user.id);

    if (user.favorites.includes(productId)) {
      return res.status(400).json({
        status: 'error',
        message: 'Product already in favorites'
      });
    }

    user.favorites.push(productId);
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Product added to favorites'
    });
  } catch (error) {
    next(error);
  }
};

// Remove from favorites => /api/user/favorites/remove
exports.removeFromFavorites = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);

    user.favorites = user.favorites.filter(
      id => id.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Product removed from favorites'
    });
  } catch (error) {
    next(error);
  }
};

// Get user notifications => /api/user/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, isRead } = req.query;

    const query = { recipient: req.user.id };
    if (isRead !== undefined) query.isRead = isRead;

    const notifications = await Notification.find(query)
      .populate('sender', 'name')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Notification.countDocuments(query);

    res.status(200).json({
      status: 'success',
      notifications,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalNotifications: count
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read => /api/user/notifications/:id/read
exports.markNotificationAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this notification'
      });
    }

    notification.markAsRead();
    await notification.save();

    res.status(200).json({
      status: 'success',
      message: 'Notification marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read => /api/user/notifications/read-all
exports.markAllNotificationsAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics => /api/user/stats
exports.getUserStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments({ user: req.user.id });
    const completedOrders = await Order.countDocuments({ 
      user: req.user.id, 
      orderStatus: 'Delivered' 
    });

    const totalReviews = await Review.countDocuments({ user: req.user.id });
    const approvedReviews = await Review.countDocuments({ 
      user: req.user.id, 
      status: 'approved' 
    });

    const totalProducts = await Product.countDocuments({ user: req.user.id });
    const activeProducts = await Product.countDocuments({ 
      user: req.user.id, 
      status: 'active' 
    });

    const unreadNotifications = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.status(200).json({
      status: 'success',
      stats: {
        orders: {
          total: totalOrders,
          completed: completedOrders
        },
        reviews: {
          total: totalReviews,
          approved: approvedReviews
        },
        products: {
          total: totalProducts,
          active: activeProducts
        },
        notifications: {
          unread: unreadNotifications
        }
      }
    });
  } catch (error) {
    next(error);
  }
}; 