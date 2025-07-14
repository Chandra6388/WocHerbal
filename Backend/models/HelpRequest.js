const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    maxLength: [100, 'Subject cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: true,
    maxLength: [1000, 'Message cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: true,
    enum: ['order_issue', 'payment_problem', 'product_question', 'technical_support', 'refund_request', 'general_inquiry', 'complaint', 'suggestion']
  },
  priority: {
    type: String,
    default: 'medium',
    enum: ['low', 'medium', 'high', 'urgent']
  },
  status: {
    type: String,
    default: 'open',
    enum: ['open', 'in_progress', 'resolved', 'closed']
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  responses: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      message: {
        type: String,
        required: true,
        maxLength: [1000, 'Response message cannot exceed 1000 characters']
      },
      isInternal: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order'
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number
  }],
  tags: [String],
  resolvedAt: Date,
  closedAt: Date,
  satisfactionRating: {
    type: Number,
    min: 1,
    max: 5
  },
  satisfactionComment: String
}, {
  timestamps: true
});

// Index for efficient queries
helpRequestSchema.index({ user: 1, status: 1, createdAt: -1 });
helpRequestSchema.index({ status: 1, priority: 1, createdAt: -1 });
helpRequestSchema.index({ assignedTo: 1, status: 1 });

// Add response
helpRequestSchema.methods.addResponse = function(userId, message, isInternal = false) {
  this.responses.push({
    user: userId,
    message: message,
    isInternal: isInternal
  });
};

// Update status
helpRequestSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'resolved') {
    this.resolvedAt = Date.now();
  } else if (newStatus === 'closed') {
    this.closedAt = Date.now();
  }
};

// Calculate priority based on category and user
helpRequestSchema.methods.calculatePriority = function() {
  if (this.category === 'payment_problem' || this.category === 'refund_request') {
    this.priority = 'high';
  } else if (this.category === 'complaint') {
    this.priority = 'urgent';
  } else {
    this.priority = 'medium';
  }
};

module.exports = mongoose.model('HelpRequest', helpRequestSchema); 