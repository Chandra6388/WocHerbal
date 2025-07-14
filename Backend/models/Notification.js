const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    default: null
  },
  type: {
    type: String,
    required: true,
    enum: ['order_status', 'product_approved', 'product_rejected', 'review_approved', 'review_rejected', 'help_response', 'broadcast', 'payment_success', 'payment_failed', 'stock_alert', 'price_drop']
  },
  title: {
    type: String,
    required: true,
    maxLength: [100, 'Notification title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: true,
    maxLength: [500, 'Notification message cannot exceed 500 characters']
  },
  data: {
    orderId: mongoose.Schema.ObjectId,
    productId: mongoose.Schema.ObjectId,
    reviewId: mongoose.Schema.ObjectId,
    helpRequestId: mongoose.Schema.ObjectId,
    amount: Number,
    status: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isBroadcast: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    default: 'normal',
    enum: ['low', 'normal', 'high', 'urgent']
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ isBroadcast: 1, createdAt: -1 });

// Mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
};

// Check if notification is expired
notificationSchema.methods.isExpired = function() {
  if (this.expiresAt) {
    return new Date() > this.expiresAt;
  }
  return false;
};

// Create notification helper
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  return notification;
};

// Create broadcast notification
notificationSchema.statics.createBroadcast = async function(data) {
  const User = mongoose.model('User');
  const users = await User.find({ status: 'active' });
  
  const notifications = users.map(user => ({
    ...data,
    recipient: user._id,
    isBroadcast: true
  }));
  
  return await this.insertMany(notifications);
};

module.exports = mongoose.model('Notification', notificationSchema); 