const Cart = require('../models/Cart');
const Product = require('../models/Product'); 

exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.body.userId }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalItems: 0,
        totalPrice: 0
      });
    }

    res.status(200).json({
      status: 'success',
      cart
    });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    if (product.status !== 'active') {
      return res.status(400).json({
        status: 'error',
        message: 'Product is not available for purchase'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient stock'
      });
    }

    let cart = await Cart.findOne({ user: req.body?.userId });

    if (!cart) {
      cart = await Cart.create({
        user: req.body?.userId,
        items: [],
        totalItems: 0,
        totalPrice: 0
      });
    }
 
    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity,
        price: product.price
      });
    }
    cart.calculateTotals();
    await cart.save();
    await cart.populate('items.product');
    res.status(200).json({
      status: 'success',
      message: 'Item added to cart successfully',
      cart
    });
  } catch (error) {
    next(error);
  }
};
 
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart'
      });
    }

    // Check stock availability
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient stock'
      });
    }

    item.quantity = quantity;
    cart.calculateTotals();
    await cart.save();

    await cart.populate('items.product');

    res.status(200).json({
      status: 'success',
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    cart.removeItem(productId);
    await cart.save();

    await cart.populate('items.product');

    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart successfully',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Clear cart => /api/cart/clear
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    cart.clearCart();
    await cart.save();

    res.status(200).json({
      status: 'success',
      message: 'Cart cleared successfully',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Apply coupon to cart => /api/cart/coupon
exports.applyCoupon = async (req, res, next) => {
  try {
    const { couponCode } = req.body;

    // Here you would validate the coupon code
    // For now, we'll use a simple example
    const validCoupons = {
      'SAVE10': 10,
      'SAVE20': 20,
      'SAVE30': 30
    };

    if (!validCoupons[couponCode]) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid coupon code'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    cart.couponApplied = {
      code: couponCode,
      discount: validCoupons[couponCode]
    };

    cart.calculateTotals();
    await cart.save();

    await cart.populate('items.product');

    res.status(200).json({
      status: 'success',
      message: 'Coupon applied successfully',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Remove coupon from cart => /api/cart/coupon/remove
exports.removeCoupon = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found'
      });
    }

    cart.couponApplied = {};
    cart.calculateTotals();
    await cart.save();

    await cart.populate('items.product');

    res.status(200).json({
      status: 'success',
      message: 'Coupon removed successfully',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// Get cart summary => /api/cart/summary
exports.getCartSummary = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      return res.status(200).json({
        status: 'success',
        summary: {
          totalItems: 0,
          subtotal: 0,
          discount: 0,
          total: 0
        }
      });
    }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const discount = cart.couponApplied.discount 
      ? (subtotal * cart.couponApplied.discount / 100) 
      : 0;

    const total = subtotal - discount;

    res.status(200).json({
      status: 'success',
      summary: {
        totalItems: cart.totalItems,
        subtotal,
        discount,
        total,
        couponApplied: cart.couponApplied.code || null
      }
    });
  } catch (error) {
    next(error);
  }
}; 