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
  updateStockAndSoldCount,
  getAllProductIdAndName
} = require('../controllers/productController');


// Public routes
router.get('/all', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id/reviews', getProductReviews);
router.post('/new', validate('createProduct'), newProduct);

router.put('/:id/status', updateProductStatus);
router.post('/stock-sold', updateStockAndSoldCount);
router.get('/all-id-name', getAllProductIdAndName);



router.post('/review', createProductReview);
router.delete('/reviews', deleteReview);


router.post('/admin/all', adminOnly, getAllProducts);
router.put('/admin/approve/:id', adminOnly, approveProduct);
router.get('/admin/stats', adminOnly, getProductStats);

router.get('/:id', getSingleProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router; 