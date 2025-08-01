const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxLength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  benefits: {
    type: String,
    required: [true, 'Please enter product benefits']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    maxLength: [5, 'Price cannot exceed 5 characters']
  },
  ratings: {
    type: Number,
    default: 0
  },
  images: {
    type: String,
    required: [true, 'Please enter product images']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'category',
    required: true
  },
  weight: {
    type: String,
    required: [true, 'Please enter product weight'],
    maxLength: [5, 'Weight cannot exceed 5 characters'],
    default: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    maxLength: [5, 'Stock cannot exceed 5 characters'],
    default: 0
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
      },
      rating: {
        type: Number,
        required: true
      },
      comment: {
        type: String,
        required: true
      }
    }
  ],
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'out_of_stock']
  },
  approvalStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected']
  },
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectionReason: String,
  tags: [String],
  specifications: {
    type: Map,
    of: String
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  originalPrice: {
    type: Number
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate discounted price
productSchema.methods.getDiscountedPrice = function () {
  if (this.discount > 0) {
    return this.price - (this.price * this.discount / 100);
  }
  return this.price;
};

// Update product status based on stock
productSchema.methods.updateStatus = function () {
  if (this.stock <= 0) {
    this.status = 'out_of_stock';
  } else if (this.status === 'out_of_stock' && this.stock > 0) {
    this.status = 'active';
  }
};

module.exports = mongoose.model('Product', productSchema); 