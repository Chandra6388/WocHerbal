const axios = require('axios');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { createOrder: createRazorpayOrder, verifyPayment, CapturePayment } = require('../utils/razorpay');
const ErrorHandler = require('../utils/errorHandler');
const User = require("../models/User");
const ShiprocketOrder = require('../models/shiprocketOrder');
const crypto = require('crypto');

let shiprocketToken = null;
let tokenExpiry = null;

async function getShiprocketToken() {

  if (shiprocketToken && tokenExpiry && Date.now() < tokenExpiry) {
    return shiprocketToken;
  }
  let user = await User.findOne({ role: "admin" }).select('accessToken');

  if (user && user.accessToken) {
    shiprocketToken = user.accessToken;
    return shiprocketToken;
  }


  const loginRes = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD
  });
  shiprocketToken = loginRes?.data?.token;
  await User.updateOne({ role: "admin" }, { accessToken: shiprocketToken });
  // 10 days expiry
  tokenExpiry = Date.now() + 10 * 24 * 60 * 60 * 1000;
  return shiprocketToken;
}

function getAxiosInstance() {
  const instance = axios.create({
    baseURL: 'https://apiv2.shiprocket.in',
  });
  instance.interceptors.request.use(async (config) => {
    const token = await getShiprocketToken();

    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  });
  return instance;
}

function UpdateUserAccessToken() {
  User.findOneAndUpdate({ role: "admin" }, { accessToken: null })
    .then(() => {
      console.log("User access token updated successfully");
      shiprocketToken = null; // Reset token in memory
      tokenExpiry = null; // Reset token expiry

    })
    .catch((error) => {
      console.error("Error updating user access token:", error);
    });
}
const shiprocket = getAxiosInstance();

exports.newOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      user
    } = req.body;


    // 1️⃣ Create order in DB
    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      paidAt: Date.now(),
      user: user
    });


    console.log("order", order)


    // 2️⃣ Map order items for Shiprocket
    const orderItemsReq = orderItems.map(item => ({
      name: item?.name || "Unnamed Item",
      units: item?.quantity || 1,
      sku: item?.sku || "SKU13",
      selling_price: item?.price || 0,
      discount: "",
      tax: "",
      hsn: item?.hsn || "441122"
    }));

    // 3️⃣ Calculate subtotal
    const sub_total = orderItems.reduce(
      (acc, item) => acc + ((item?.price || 0) * (item?.quantity || 0)),
      0
    );

    // 4️⃣ Get Shiprocket access token
    const admin = await User.findOne({ role: "admin" }).select("accessToken");
    const accessToken = admin?.accessToken;
    console.log("sss", accessToken)
    if (!accessToken) {
      return res.status(500).json({ success: false, message: "Missing Shiprocket access token." });
    }

    // console.log(paymentInfo.id, totalPrice)
    // let captureRes = await CapturePayment(paymentInfo.id, totalPrice)
    // console.log("captureRes", captureRes)


    const shipmentData = {
      order_id: order?._id?.toString(),
      order_date: new Date().toISOString().slice(0, 10),
      pickup_location: "home",
      channel_id: "",
      billing_customer_name: shippingInfo?.name || "Customer",
      billing_last_name: shippingInfo?.name || "Customer",
      billing_address: shippingInfo?.address || "",
      billing_address_2: shippingInfo?.address2 || "",
      billing_city: shippingInfo?.city || "",
      billing_pincode: shippingInfo?.postalCode || "",
      billing_state: shippingInfo?.state || "MP",
      billing_country: shippingInfo?.country || "India",
      billing_email: shippingInfo?.email || "noemail@example.com",
      billing_phone: shippingInfo?.phoneNo || "0000000000",
      shipping_is_billing: true,
      order_items: orderItemsReq,
      payment_method: paymentInfo?.method === "COD" ? "COD" : "Prepaid",
      sub_total,
      length: 2.5,
      breadth: 17,
      height: 2.5,
      weight: 0.27
    }

    console.log("shipmentData", shipmentData)


    const shiprocketRes = await shiprocket.post('/v1/external/orders/create/adhoc', shipmentData);
    // const data = response.data;


    console.log("shiprocketRes", shiprocketRes)
    console.log("shiprocketRes.data", shiprocketRes.data)
    console.log("shiprocketRes.data.shipment_id", shiprocketRes.shipment_id.data.data)



    if (!shiprocketRes.data || !shiprocketRes.data.shipment_id) {
      return res.status(500).json({ success: false, message: "Shiprocket order creation failed." });
    }

    const sr = shiprocketRes?.data;

    console.log("itemsPrice", itemsPrice)

    // 7️⃣ Save Shiprocket response
    const savedShiprocketOrder = await ShiprocketOrder.create({
      orderId: sr?.order_id,
      shipmentId: sr?.shipment_id,
      awbCode: sr?.awb_code,
      courierName: sr?.courier_name,
      pickupInfo: {
        address: shipmentData?.billing_address,
        city: shipmentData?.billing_city,
        state: shipmentData?.billing_state,
        country: shipmentData?.billing_country,
        postalCode: shipmentData?.billing_pincode,
        phone: shipmentData?.billing_phone
      },
      paymentInfo: paymentInfo,
      manifestLink: sr?.manifest_link,
      labelPdfLink: sr?.label_url,
      invoicePdfLink: sr?.invoice_url,
      trackingStatus: sr?.status,
      itemsPrice: itemsPrice,
      order_id: order?._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // 8️⃣ Update order with tracking info
    order.trackingNumber = sr?.awb_code || "";
    await order.save();

    // 9️⃣ Respond success
    return res.status(200).json({
      success: true,
      message: "Order placed successfully.",
      order,
      shiprocketOrder: savedShiprocketOrder
    });

  } catch (error) {
    console.error("❌ Order creation error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: error?.response?.data?.message || error.message || "Internal server error"
    });
  }
};



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

    console.log("order", orders)

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
// exports.verifyPayment = async (req, res, next) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       orderData
//     } = req.body;

//     const isAuthentic = verifyPayment(
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature
//     );

//     if (!isAuthentic) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'Payment verification failed'
//       });
//     }

//     // Create order in database
//     const order = await Order.create({
//       ...orderData,
//       user: req.user._id,
//       razorpayOrderId: razorpay_order_id,
//       razorpayPaymentId: razorpay_payment_id,
//       razorpaySignature: razorpay_signature
//     });

//     // Clear cart after successful order
//     await Cart.findOneAndUpdate(
//       { user: req.user._id },
//       { $set: { items: [], totalItems: 0, totalPrice: 0 } }
//     );

//     res.status(200).json({
//       status: 'success',
//       message: 'Payment verified successfully',
//       order
//     });
//   } catch (error) {
//     next(error);
//   }
// };


exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    return res.status(200).json({ success: true, message: "Payment verified" });
  } else {
    return res.status(400).json({ success: false, message: "Invalid signature" });
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

exports.captureOrder = async (req, res) => {
  try {
    const { paymentid, amount } = req.body;

    let captureRes = await CapturePayment(paymentid, amount);
    console.log(captureRes)

    return res.json({ status: true, data: captureRes })


  } catch (error) {
    return res.json({ status: false, data: error })
  }
}