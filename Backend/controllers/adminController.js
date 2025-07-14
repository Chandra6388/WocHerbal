const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const HelpRequest = require('../models/HelpRequest');
const ErrorHandler = require('../utils/errorHandler');

// Get admin dashboard analytics => /api/admin/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments({ role: 'user' });
    const activeUsers = await User.countDocuments({ role: 'user', status: 'active' });
    const blockedUsers = await User.countDocuments({ role: 'user', status: 'blocked' });

    // Product statistics
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active', approvalStatus: 'approved' });
    const pendingProducts = await Product.countDocuments({ approvalStatus: 'pending' });
    const outOfStockProducts = await Product.countDocuments({ status: 'out_of_stock' });

    // Order statistics
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Processing' });

    // Revenue statistics
    const revenueStats = await Order.aggregate([
      { $match: { orderStatus: 'Delivered' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          avgOrderValue: { $avg: '$totalPrice' }
        }
      }
    ]);

    // Recent activities
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(5);

    const recentProducts = await Product.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(5);

    // Top selling products
    const topSellingProducts = await Product.find({ soldCount: { $gt: 0 } })
      .sort('-soldCount')
      .limit(5);

    // Monthly revenue for chart
    const monthlyRevenue = await Order.aggregate([
      { $match: { orderStatus: 'Delivered' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      status: 'success',
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          blocked: blockedUsers
        },
        products: {
          total: totalProducts,
          active: activeProducts,
          pending: pendingProducts,
          outOfStock: outOfStockProducts
        },
        orders: {
          total: totalOrders,
          completed: completedOrders,
          pending: pendingOrders
        },
        revenue: {
          total: revenueStats[0]?.totalRevenue || 0,
          average: revenueStats[0]?.avgOrderValue || 0,
          monthly: monthlyRevenue
        },
        recent: {
          orders: recentOrders,
          products: recentProducts
        },
        topSelling: topSellingProducts
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (admin) => /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    const query = { role: 'user' };
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

    const count = await User.countDocuments(query);

    res.status(200).json({
      status: 'success',
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });
  } catch (error) {
    next(error);
  }
};

// Update user status => /api/admin/users/:id/status
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: `User ${status} successfully`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// Get user details with orders and reviews => /api/admin/users/:id
exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    const orders = await Order.find({ user: req.params.id })
      .sort('-createdAt')
      .limit(10);

    const reviews = await Review.find({ user: req.params.id })
      .populate('product', 'name')
      .sort('-createdAt')
      .limit(10);

    const products = await Product.find({ user: req.params.id })
      .sort('-createdAt')
      .limit(10);

    res.status(200).json({
      status: 'success',
      user,
      orders,
      reviews,
      products
    });
  } catch (error) {
    next(error);
  }
};

// Get all reviews (admin) => /api/admin/reviews
exports.getAllReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, productId, userId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (productId) query.product = productId;
    if (userId) query.user = userId;

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('product', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

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

// Approve/Reject review => /api/admin/reviews/:id/approve
exports.approveReview = async (req, res, next) => {
  try {
    const { status, rejectionReason } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        status: 'error',
        message: 'Review not found'
      });
    }

    review.status = status;
    review.approvedBy = req.user.id;
    review.approvedAt = Date.now();

    if (status === 'rejected') {
      review.rejectionReason = rejectionReason;
    }

    await review.save();

    res.status(200).json({
      status: 'success',
      message: `Review ${status} successfully`,
      review
    });
  } catch (error) {
    next(error);
  }
};

// Send notification => /api/admin/notifications/send
exports.sendNotification = async (req, res, next) => {
  try {
    const { recipients, type, title, message, priority = 'normal' } = req.body;

    let notifications = [];

    if (recipients === 'all') {
      // Send to all active users
      const users = await User.find({ status: 'active', role: 'user' });
      notifications = users.map(user => ({
        recipient: user._id,
        sender: req.user.id,
        type,
        title,
        message,
        priority,
        isBroadcast: true
      }));
    } else if (Array.isArray(recipients)) {
      // Send to specific users
      notifications = recipients.map(userId => ({
        recipient: userId,
        sender: req.user.id,
        type,
        title,
        message,
        priority
      }));
    }

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(200).json({
      status: 'success',
      message: `Notification sent to ${notifications.length} users`,
      notifications
    });
  } catch (error) {
    next(error);
  }
};

// Get help requests => /api/admin/help-requests
exports.getHelpRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, category } = req.query;

    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const helpRequests = await HelpRequest.find(query)
      .populate('user', 'name email')
      .populate('assignedTo', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

    const count = await HelpRequest.countDocuments(query);

    res.status(200).json({
      status: 'success',
      helpRequests,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRequests: count
    });
  } catch (error) {
    next(error);
  }
};

// Respond to help request => /api/admin/help-requests/:id/respond
exports.respondToHelpRequest = async (req, res, next) => {
  try {
    const { message, status } = req.body;

    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        status: 'error',
        message: 'Help request not found'
      });
    }

    // Add admin response
    helpRequest.addResponse(req.user.id, message, false);

    if (status) {
      helpRequest.updateStatus(status);
    }

    await helpRequest.save();

    // Send notification to user
    await Notification.create({
      recipient: helpRequest.user,
      sender: req.user.id,
      type: 'help_response',
      title: 'Help Request Response',
      message: `Your help request "${helpRequest.subject}" has received a response.`,
      data: {
        helpRequestId: helpRequest._id
      }
    });

    res.status(200).json({
      status: 'success',
      message: 'Response sent successfully',
      helpRequest
    });
  } catch (error) {
    next(error);
  }
};

// Get sales report => /api/admin/sales-report
exports.getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let groupStage = {};
    if (groupBy === 'day') {
      groupStage = {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        }
      };
    } else if (groupBy === 'month') {
      groupStage = {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        }
      };
    }

    const salesReport = await Order.aggregate([
      { $match: { ...matchStage, orderStatus: 'Delivered' } },
      {
        $group: {
          ...groupStage,
          totalSales: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$totalPrice' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { ...matchStage, orderStatus: 'Delivered' } },
      { $unwind: '$orderItems' },
      {
        $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          totalRevenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    res.status(200).json({
      status: 'success',
      report: {
        salesData: salesReport,
        topProducts
      }
    });
  } catch (error) {
    next(error);
  }
}; 