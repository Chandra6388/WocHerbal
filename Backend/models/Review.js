const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: null,
  },
  images: [{
    type: String,
    default: null
  }],
  likes:{
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected']
  },
 
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema); 