const HelpRequest = require('../models/HelpRequest');
const Notification = require('../models/Notification');
const ErrorHandler = require('../utils/errorHandler');

// Create help request => /api/help
exports.createHelpRequest = async (req, res, next) => {
  try {
    const { subject, message, category, order, product } = req.body;

    const helpRequest = await HelpRequest.create({
      user: req.user.id,
      subject,
      message,
      category,
      order,
      product
    });

    // Calculate priority based on category
    helpRequest.calculatePriority();
    await helpRequest.save();

    await helpRequest.populate('user', 'name email');

    res.status(201).json({
      status: 'success',
      message: 'Help request submitted successfully',
      helpRequest
    });
  } catch (error) {
    next(error);
  }
};

// Get user's help requests => /api/help/my-requests
exports.getMyHelpRequests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const helpRequests = await HelpRequest.find(query)
      .populate('order', 'orderStatus totalPrice')
      .populate('product', 'name')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

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

// Get single help request => /api/help/:id
exports.getHelpRequest = async (req, res, next) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name')
      .populate('order', 'orderStatus totalPrice')
      .populate('product', 'name');

    if (!helpRequest) {
      return res.status(404).json({
        status: 'error',
        message: 'Help request not found'
      });
    }

    // Check if user owns this request or is admin
    if (helpRequest.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to access this help request'
      });
    }

    res.status(200).json({
      status: 'success',
      helpRequest
    });
  } catch (error) {
    next(error);
  }
};

// Update help request => /api/help/:id
exports.updateHelpRequest = async (req, res, next) => {
  try {
    const { subject, message, category } = req.body;

    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        status: 'error',
        message: 'Help request not found'
      });
    }

    // Check if user owns this request
    if (helpRequest.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this help request'
      });
    }

    // Only allow updates if status is open
    if (helpRequest.status !== 'open') {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot update help request that is not open'
      });
    }

    helpRequest.subject = subject;
    helpRequest.message = message;
    helpRequest.category = category;
    helpRequest.calculatePriority();

    await helpRequest.save();

    res.status(200).json({
      status: 'success',
      message: 'Help request updated successfully',
      helpRequest
    });
  } catch (error) {
    next(error);
  }
};

// Delete help request => /api/help/:id
exports.deleteHelpRequest = async (req, res, next) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        status: 'error',
        message: 'Help request not found'
      });
    }

    // Check if user owns this request or is admin
    if (helpRequest.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this help request'
      });
    }

    await helpRequest.remove();

    res.status(200).json({
      status: 'success',
      message: 'Help request deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add response to help request => /api/help/:id/respond
exports.respondToHelpRequest = async (req, res, next) => {
  try {
    const { message } = req.body;

    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        status: 'error',
        message: 'Help request not found'
      });
    }

    // Check if user owns this request or is admin
    if (helpRequest.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to respond to this help request'
      });
    }

    // Add response
    helpRequest.addResponse(req.user.id, message, req.user.role === 'admin');

    await helpRequest.save();

    res.status(200).json({
      status: 'success',
      message: 'Response added successfully',
      helpRequest
    });
  } catch (error) {
    next(error);
  }
};

// Rate help request satisfaction => /api/help/:id/rate
exports.rateHelpRequest = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating must be between 1 and 5'
      });
    }

    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        status: 'error',
        message: 'Help request not found'
      });
    }

    // Check if user owns this request
    if (helpRequest.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to rate this help request'
      });
    }

    // Only allow rating if status is resolved or closed
    if (helpRequest.status !== 'resolved' && helpRequest.status !== 'closed') {
      return res.status(400).json({
        status: 'error',
        message: 'Can only rate resolved or closed help requests'
      });
    }

    helpRequest.satisfactionRating = rating;
    helpRequest.satisfactionComment = comment;

    await helpRequest.save();

    res.status(200).json({
      status: 'success',
      message: 'Help request rated successfully',
      helpRequest
    });
  } catch (error) {
    next(error);
  }
};

// Get help request statistics (admin) => /api/help/admin/stats
exports.getHelpRequestStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await HelpRequest.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await HelpRequest.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const priorityStats = await HelpRequest.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const satisfactionStats = await HelpRequest.aggregate([
      { $match: { ...matchStage, satisfactionRating: { $exists: true } } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$satisfactionRating' },
          totalRated: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      stats: {
        statusStats: stats,
        categoryStats,
        priorityStats,
        satisfactionStats: satisfactionStats[0] || {
          avgRating: 0,
          totalRated: 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get help request categories => /api/help/categories
exports.getHelpCategories = async (req, res, next) => {
  try {
    const categories = [
      {
        value: 'order_issue',
        label: 'Order Issue',
        description: 'Problems with orders, shipping, or delivery'
      },
      {
        value: 'payment_problem',
        label: 'Payment Problem',
        description: 'Issues with payments, refunds, or billing'
      },
      {
        value: 'product_question',
        label: 'Product Question',
        description: 'Questions about products, features, or specifications'
      },
      {
        value: 'technical_support',
        label: 'Technical Support',
        description: 'Website, app, or account technical issues'
      },
      {
        value: 'refund_request',
        label: 'Refund Request',
        description: 'Request for refund or return'
      },
      {
        value: 'general_inquiry',
        label: 'General Inquiry',
        description: 'General questions about our services'
      },
      {
        value: 'complaint',
        label: 'Complaint',
        description: 'Formal complaints about service or products'
      },
      {
        value: 'suggestion',
        label: 'Suggestion',
        description: 'Suggestions for improvement or new features'
      }
    ];

    res.status(200).json({
      status: 'success',
      categories
    });
  } catch (error) {
    next(error);
  }
}; 