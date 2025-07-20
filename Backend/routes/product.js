const express = require('express');
const router = express.Router();
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');

const {
  newProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAllProducts,
  approveProduct,
  getProductStats,
  getFeaturedProducts,
  getProductsByCategory,
  updateProductStatus,
  updateStockAndSoldCount
} = require('../controllers/productController');

// Public routes
router.get('/all', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getSingleProduct);
router.get('/:id/reviews', getProductReviews);

router.post('/new', validate('createProduct'), newProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/status', updateProductStatus);
router.post('/stock-sold', updateStockAndSoldCount);


router.post('/review', validate('createReview'), createProductReview);
router.delete('/reviews', deleteReview);


router.post('/admin/all', adminOnly, getAllProducts);
router.put('/admin/approve/:id', adminOnly, approveProduct);
router.get('/admin/stats', adminOnly, getProductStats);

module.exports = router; 