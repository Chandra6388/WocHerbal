const Product = require('../models/Product');
const ErrorHandler = require('../utils/errorHandler');
const APIFeatures = require('../utils/apiFeatures');

exports.newProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      status: 'success',
      product
    });
  } catch (error) {
    next(error);
  }
};

// Get all products => /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const resPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(), req.query)
      .search()
      .filter();

    let products = await apiFeatures.query;

    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage);

    products = await apiFeatures.query.clone();

    res.status(200).json({
      status: 'success',
      productsCount,
      resPerPage,
      filteredProductsCount,
      products
    });
  } catch (error) {
    next(error);
  }
};

// Get single product details => /api/products/:id
exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('user', 'name email')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      });

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.status(200).json({
      status: 'success',
      product
    });
  } catch (error) {
    next(error);
  }
};

// Update Product => /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    console.log("req.params.id", req.params.id)
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Check if user is admin or product owner
    if (req.user.role !== 'admin' && product.user.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this product'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });


    res.status(200).json({
      status: 'success',
      product
    });
  } catch (error) {
    next(error);
  }
};

// Delete Product => /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    // Authorization check
    if (req.user.role !== 'admin' && product.user?.toString() !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this product'
      });
    }

    // Delete the product
    await product.deleteOne(); // modern method in Mongoose 7+

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};


// Create/Update product review => /api/products/review
exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, title, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      title,
      comment
    };

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    const isReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach(review => {
        if (review.user.toString() === req.user._id.toString()) {
          review.rating = Number(rating);
          review.title = title;
          review.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success'
    });
  } catch (error) {
    next(error);
  }
};

// Get Product Reviews => /api/products/reviews
exports.getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json({
      status: 'success',
      reviews: product.reviews
    });
  } catch (error) {
    next(error);
  }
};

// Delete Product Review => /api/products/reviews
exports.deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    const reviews = product.reviews.filter(
      review => review._id.toString() !== req.query.id.toString()
    );

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, {
      reviews,
      ratings,
      numOfReviews
    }, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    });

    res.status(200).json({
      status: 'success'
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all products for approval => /api/products/admin/all
exports.getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, user } = req.body;

    console.log("req", req)
    return 

    const query = {};
    if (status) query.status = status;
    if (approvalStatus) query.approvalStatus = approvalStatus;

    const products = await Product.find(query)
      .populate('category', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(query);

    res.status(200).json({
      status: 'success',
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Approve/Reject product => /api/products/admin/approve/:id
exports.approveProduct = async (req, res, next) => {
  try {
    const { approvalStatus, rejectionReason } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    product.approvalStatus = approvalStatus;
    product.approvedBy = req.user.id;
    product.approvedAt = Date.now();

    if (approvalStatus === 'rejected') {
      product.rejectionReason = rejectionReason;
    }

    await product.save();

    res.status(200).json({
      status: 'success',
      message: `Product ${approvalStatus} successfully`,
      product
    });
  } catch (error) {
    next(error);
  }
};
 
exports.getProductStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const approvalStats = await Product.aggregate([
      {
        $group: {
          _id: '$approvalStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRating: { $avg: '$ratings' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      stats: {
        statusStats: stats,
        approvalStats,
        categoryStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get featured products => /api/products/featured
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      featured: true,
      status: 'active',
      approvalStatus: 'approved'
    }).limit(8);

    res.status(200).json({
      status: 'success',
      products
    });
  } catch (error) {
    next(error);
  }
};

// Get products by category => /api/products/category/:category
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12, sort = 'createdAt' } = req.query;

    const products = await Product.find({
      category,
      status: 'active',
      approvalStatus: 'approved'
    })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments({
      category,
      status: 'active',
      approvalStatus: 'approved'
    });

    res.status(200).json({
      status: 'success',
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts: count
    });
  } catch (error) {
    next(error);
  }
};


exports.updateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }


    product.status = status;
    await product.save();

    res.status(200).json({
      status: 'success',
      message: `Product status updated to ${status}`,
      product
    });
  } catch (error) {
    next(error);
  }
};




exports.updateStockAndSoldCount = async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No product ids provided' });
    }


    const products = await Product.find({ _id: { $in: ids } });
    if (!products.length) {
      return res.status(404).json({ status: 'error', message: 'No products found for provided ids' });
    }


    const updatePromises = products.map(async (product) => {

      if (product.stock > 0) {
        product.stock -= 1;
        product.soldCount = (product.soldCount || 0) + 1;
        await product.save();
      }
      return product;
    });
    const updatedProducts = await Promise.all(updatePromises);

    res.status(200).json({
      status: 'success',
      message: 'Stock and soldCount updated for products',
      products: updatedProducts
    });
  } catch (error) {
    next(error);
  }
};