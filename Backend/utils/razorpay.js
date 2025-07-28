const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



// Create order
const createOrder = async (amount, currency = 'INR', receipt) => {
  try {

    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: receipt,
      payment_capture: 1
    };
    
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error(`Error creating Razorpay order: ${error.message}`);
  }
};



// Verify payment signature
const verifyPayment = (razorpay_order_id, razorpay_payment_id, razorpay_signature) => {
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  return isAuthentic;
};



// Get payment details
const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    throw new Error(`Error fetching payment details: ${error.message}`);
  }
};

// Refund payment
const refundPayment = async (paymentId, amount, reason = 'Customer request') => {
  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Convert to paise
      speed: 'normal',
      notes: {
        reason: reason
      }
    });
    return refund;
  } catch (error) {
    throw new Error(`Error processing refund: ${error.message}`);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment
}; 