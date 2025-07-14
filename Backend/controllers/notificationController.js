const Notification = require('../models/Notification');
const User = require('../models/User');
const ErrorHandler = require('../utils/errorHandler');

// Get all notifications (admin) => /api/notifications/admin/all
exports.getAllNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, isBroadcast, priority } = req.query;

    const query = {};
    if (type) query.type = type;
    if (isBroadcast !== undefined) query.isBroadcast = isBroadcast;
    if (priority) query.priority = priority;

    const notifications = await Notification.find(query)
      .populate('recipient', 'name email')
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

// Get notification statistics (admin) => /api/notifications/admin/stats
exports.getNotificationStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Notification.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          readCount: {
            $sum: { $cond: ['$isRead', 1, 0] }
          },
          unreadCount: {
            $sum: { $cond: ['$isRead', 0, 1] }
          }
        }
      }
    ]);

    const priorityStats = await Notification.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const broadcastStats = await Notification.aggregate([
      { $match: { ...matchStage, isBroadcast: true } },
      {
        $group: {
          _id: null,
          totalBroadcasts: { $sum: 1 },
          uniqueRecipients: { $addToSet: '$recipient' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      stats: {
        typeStats: stats,
        priorityStats,
        broadcastStats: broadcastStats[0] || {
          totalBroadcasts: 0,
          uniqueRecipients: []
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete notification (admin) => /api/notifications/admin/:id
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found'
      });
    }

    await notification.remove();

    res.status(200).json({
      status: 'success',
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Bulk delete notifications (admin) => /api/notifications/admin/bulk-delete
exports.bulkDeleteNotifications = async (req, res, next) => {
  try {
    const { notificationIds } = req.body;

    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide notification IDs to delete'
      });
    }

    const result = await Notification.deleteMany({
      _id: { $in: notificationIds }
    });

    res.status(200).json({
      status: 'success',
      message: `${result.deletedCount} notifications deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

// Get notification history (admin) => /api/notifications/admin/history
exports.getNotificationHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, recipientId, type } = req.query;

    const query = {};
    if (recipientId) query.recipient = recipientId;
    if (type) query.type = type;

    const notifications = await Notification.find(query)
      .populate('recipient', 'name email')
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

// Send test notification (admin) => /api/notifications/admin/test
exports.sendTestNotification = async (req, res, next) => {
  try {
    const { recipientId, type, title, message, priority = 'normal' } = req.body;

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipient not found'
      });
    }

    const notification = await Notification.create({
      recipient: recipientId,
      sender: req.user.id,
      type,
      title,
      message,
      priority
    });

    await notification.populate('recipient', 'name email');

    res.status(200).json({
      status: 'success',
      message: 'Test notification sent successfully',
      notification
    });
  } catch (error) {
    next(error);
  }
};

// Get notification templates (admin) => /api/notifications/admin/templates
exports.getNotificationTemplates = async (req, res, next) => {
  try {
    const templates = {
      order_status: {
        title: 'Order Status Update',
        message: 'Your order #{orderId} status has been updated to {status}.'
      },
      product_approved: {
        title: 'Product Approved',
        message: 'Your product "{productName}" has been approved and is now live.'
      },
      product_rejected: {
        title: 'Product Rejected',
        message: 'Your product "{productName}" has been rejected. Reason: {reason}'
      },
      review_approved: {
        title: 'Review Approved',
        message: 'Your review for "{productName}" has been approved.'
      },
      review_rejected: {
        title: 'Review Rejected',
        message: 'Your review for "{productName}" has been rejected. Reason: {reason}'
      },
      help_response: {
        title: 'Help Request Response',
        message: 'You have received a response to your help request "{subject}".'
      },
      payment_success: {
        title: 'Payment Successful',
        message: 'Your payment of {amount} for order #{orderId} was successful.'
      },
      payment_failed: {
        title: 'Payment Failed',
        message: 'Your payment for order #{orderId} has failed. Please try again.'
      },
      stock_alert: {
        title: 'Low Stock Alert',
        message: 'Product "{productName}" is running low on stock. Only {quantity} items left.'
      },
      price_drop: {
        title: 'Price Drop Alert',
        message: 'The price of "{productName}" has dropped to {newPrice}!'
      }
    };

    res.status(200).json({
      status: 'success',
      templates
    });
  } catch (error) {
    next(error);
  }
}; 