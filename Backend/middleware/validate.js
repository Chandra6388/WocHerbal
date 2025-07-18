const Joi = require('joi');

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().max(15).optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      zipCode: Joi.string().optional()
    }).optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().max(15).optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      zipCode: Joi.string().optional()
    }).optional()
  }),

  // Product validation
  createProduct: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).required(),
    benefits: Joi.string().min(10).required(),
    price: Joi.number().positive().required(),
    soldCount: Joi.number().min(0).optional(),
    weight: Joi.string().optional(),
    category: Joi.string().valid('men','women','hairgrowth',).required(),

    stock: Joi.number().integer().min(0).required(),
    tags: Joi.array().items(Joi.string()).optional(),
    specifications: Joi.object().optional(),
    status: Joi.string().valid('active', 'inactive', 'out_of_stock').optional(),
    discount: Joi.number().min(0).max(100).optional(),
    originalPrice: Joi.number().positive().optional(),
    images: Joi.string().optional(),
    rating: Joi.number().min(0).max(5).optional(),
    reviews: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),       // should be a valid ObjectId format if needed
        name: Joi.string().required(),
        rating: Joi.number().min(0).max(5).required(),
        comment: Joi.string().required()
      })
    ).optional()
  }),

  updateProduct: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    description: Joi.string().min(10).optional(),
    benefits: Joi.string().min(10).optional(),
    price: Joi.number().positive().optional(),
    soldCount: Joi.number().min(0).optional(),
    weight: Joi.string().optional(),
    images: Joi.string().optional(),
    category: Joi.string().valid('men','women','hairgrowth').optional(),
    stock: Joi.number().integer().min(0).optional(),
    status: Joi.string().valid('active', 'inactive', 'out_of_stock').optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    specifications: Joi.object().optional(),
    discount: Joi.number().min(0).max(100).optional(),
    originalPrice: Joi.number().positive().optional(),
    featured: Joi.boolean().optional(),
    rating: Joi.number().min(0).max(5).optional(),
    reviews: Joi.array().items(
      Joi.object({
        user: Joi.string().required(),       // should be a valid ObjectId format if needed
        name: Joi.string().required(),
        rating: Joi.number().min(0).max(5).required(),
        comment: Joi.string().required()
      })
    ).optional()
  }),

  // Review validation
  createReview: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    title: Joi.string().min(2).max(100).required(),
    comment: Joi.string().min(10).max(500).required()
  }),

  updateReview: Joi.object({
    rating: Joi.number().min(1).max(5).optional(),
    title: Joi.string().min(2).max(100).optional(),
    comment: Joi.string().min(10).max(500).optional()
  }),

 

createOrder: Joi.object({
  shippingInfo: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    phoneNo: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),

  orderItems: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),         // Product ID
      name: Joi.string().optional(),            // Optional - will be added server-side
      price: Joi.number().min(0).optional(),    // Optional - will be added server-side
      quantity: Joi.number().integer().min(1).required(),
      image: Joi.string().optional(),           // Optional - will be added server-side
    })
  ).min(1).required(),

  paymentInfo: Joi.object({
    id: Joi.string().required(),
    status: Joi.string().valid('Paid', 'Pending').required(),
    method: Joi.string().valid('Razorpay', 'Cash on Delivery').required(),
  }).required(),

  itemsPrice: Joi.number().min(0).optional(),
  taxPrice: Joi.number().min(0).optional(),
  shippingPrice: Joi.number().min(0).optional(),
  totalPrice: Joi.number().min(0).optional(),
  user: Joi.string().optional()
}),


  // Help request validation
  createHelpRequest: Joi.object({
    subject: Joi.string().min(5).max(100).required(),
    message: Joi.string().min(10).max(1000).required(),
    category: Joi.string().valid(
      'order_issue', 'payment_problem', 'product_question', 'technical_support',
      'refund_request', 'general_inquiry', 'complaint', 'suggestion'
    ).required(),
    order: Joi.string().optional(),
    product: Joi.string().optional()
  }),

  // Notification validation
  createNotification: Joi.object({
    recipient: Joi.string().required(),
    type: Joi.string().valid(
      'order_status', 'product_approved', 'product_rejected', 'review_approved',
      'review_rejected', 'help_response', 'broadcast', 'payment_success',
      'payment_failed', 'stock_alert', 'price_drop'
    ).required(),
    title: Joi.string().min(2).max(100).required(),
    message: Joi.string().min(2).max(500).required(),
    priority: Joi.string().valid('low', 'normal', 'high', 'urgent').optional()
  })
};

// Validation middleware
const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid validation schema'
      });
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }

    next();
  };
};

module.exports = validate; 