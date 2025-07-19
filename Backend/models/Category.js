const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive']
  },
}, {
  timestamps: true
});


module.exports = mongoose.model('category', categorySchema); 