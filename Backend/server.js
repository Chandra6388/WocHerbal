const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const reviewRoutes = require('./routes/review');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notification');
const helpRoutes = require('./routes/help');
const category = require('./routes/category');
const shipmentRoutes = require('./routes/Shipment');
const blogsRoutes = require('./routes/blogs');



// Middleware
app.use(helmet());

// ✅ Allow multiple origins in development
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000', 'http://localhost:8080'];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//   })
// );


app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all origins (even undefined ones like Postman)
      callback(null, origin || '*');
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/category', category);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shipment', shipmentRoutes);
app.use('/api/blogs', blogsRoutes);


// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'E-commerce API is running',
    timestamp: new Date().toISOString(),
  });
});

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

// 404
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
