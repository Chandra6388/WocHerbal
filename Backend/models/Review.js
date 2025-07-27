const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxLength: [100, 'Review title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: true,
    maxLength: [500, 'Review comment cannot exceed 500 characters']
  },
  images: [{
    public_id: String,
    url: String
  }],
  helpful: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    helpful: {
      type: Boolean,
      default: true
    }
  }],
  status: {
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
  isVerifiedPurchase: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.post('save', async function() {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  
  if (product) {
    const reviews = await mongoose.model('Review').find({ 
      product: this.product, 
      status: 'approved' 
    });
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    await Product.findByIdAndUpdate(this.product, {
      ratings: avgRating,
      numOfReviews: reviews.length
    });
  }
});

// Update product rating when review is deleted
reviewSchema.post('remove', async function() {
  const Product = mongoose.model('Product');
  const product = await Product.findById(this.product);
  
  if (product) {
    const reviews = await mongoose.model('Review').find({ 
      product: this.product, 
      status: 'approved' 
    });
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    await Product.findByIdAndUpdate(this.product, {
      ratings: avgRating,
      numOfReviews: reviews.length
    });
  }
});

module.exports = mongoose.model('Review', reviewSchema); 