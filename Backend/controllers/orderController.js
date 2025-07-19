const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { createOrder: createRazorpayOrder, verifyPayment } = require('../utils/razorpay');
const ErrorHandler = require('../utils/errorHandler');

// Create new order => /api/orders/new
exports.newOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo
    } = req.body;

    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      paidAt: Date.now(),
      user: req.user._id
    });

    res.status(200).json({
      status: 'success',
      order
    });
  } catch (error) {
    next(error);
  }
};

// Get single order => /api/orders/:id
exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    res.status(200).json({
      status: 'success',
      order
    });
  } catch (error) {
    next(error);
  }
};

// Get logged in user orders => /api/orders/me
exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
      status: 'success',
      orders
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all orders => /api/orders/admin/all
exports.allOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;

    const query = {};
    if (status) query.orderStatus = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort('-createdAt');

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

// Admin: Update / Process order => /api/orders/admin/order/:id
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    if (order.orderStatus === 'Delivered') {
      return res.status(400).json({
        status: 'error',
        message: 'You have already delivered this order'
      });
    }

    order.orderItems.forEach(async item => {
      await updateStock(item.product, item.quantity);
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
      status: 'success'
    });
  } catch (error) {
    next(error);
  }
};

// Delete order => /api/orders/:id
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    await order.remove();

    res.status(200).json({
      status: 'success'
    });
  } catch (error) {
    next(error);
  }
};

// Create Razorpay order => /api/orders/create-payment
exports.createPayment = async (req, res, next) => {
  try {
    const { amount, currency = 'INR' } = req.body;



    const razorpayOrder = await createRazorpayOrder(amount, currency, `order_${Date.now()}`);

    res.status(200).json({
      status: 'success',
      order: razorpayOrder
    });
  } catch (error) {
    next(error);
  }
};

// Verify payment => /api/orders/verify-payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    const isAuthentic = verifyPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isAuthentic) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment verification failed'
      });
    }

    // Create order in database
    const order = await Order.create({
      ...orderData,
      user: req.user._id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    });

    // Clear cart after successful order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [], totalItems: 0, totalPrice: 0 } }
    );

    res.status(200).json({
      status: 'success',
      message: 'Payment verified successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// Get order statistics => /api/orders/stats
exports.getOrderStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalPrice' }
        }
      }
    ]);

    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: 'Delivered' } },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    const monthlyStats = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      status: 'success',
      stats: {
        orderStats: stats,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update stock helper function
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  product.soldCount = product.soldCount + quantity;
  await product.save({ validateBeforeSave: false });
}

// Refund order => /api/orders/refund/:id
exports.refundOrder = async (req, res, next) => {
  try {
    const { refundReason, refundAmount } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'Order not found'
      });
    }

    if (order.orderStatus !== 'Delivered') {
      return res.status(400).json({
        status: 'error',
        message: 'Order must be delivered before refund'
      });
    }

    // Process refund through Razorpay
    if (order.razorpayPaymentId) {
      const { refundPayment } = require('../utils/razorpay');
      await refundPayment(order.razorpayPaymentId, refundAmount, refundReason);
    }

    order.orderStatus = 'Refunded';
    order.refundReason = refundReason;
    order.refundAmount = refundAmount;
    order.refundedAt = Date.now();

    await order.save();

    res.status(200).json({
      status: 'success',
      message: 'Refund processed successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};



// Get overall revenue
exports.getOverallRevenue = async (req, res) => {
  try {

    const orders = await Order.find({ orderStatus: { $in: ['Delivered', 'Processing', 'Shipped'] } });
    const overallRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    res.status(200).json({ success: true, overallRevenue });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch overall revenue', error: error.message });
  }
};