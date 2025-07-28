const mongoose = require('mongoose');

const shiprocketOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  shipmentId: { type: String },
  awbCode: { type: String },
  courierName: { type: String },
  pickupInfo: {
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    phone: String
  },
  paymentInfo: {
    id: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    method: {
      type: String,
      required: true
    }
  },
  itemsPrice: { type: String, default: null },
  order_id: { type: String, default: null },
  manifestLink: { type: String },
  labelPdfLink: { type: String },
  invoicePdfLink: { type: String },
  trackingStatus: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShiprocketOrder', shiprocketOrderSchema, 'shiprocket_orders'); 