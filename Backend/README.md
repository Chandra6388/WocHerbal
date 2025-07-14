# E-commerce Product Management System Backend

A comprehensive RESTful API backend for an E-commerce Product Management System built with Node.js, Express.js, and MongoDB. This system supports both Admin and User roles with full CRUD operations, payment integration, and advanced analytics.

## 🚀 Features

### Admin Functionalities
- **Authentication**: JWT + Cookie-based authentication
- **Product Management**: Full CRUD operations with approval system
- **Review & Rating Management**: Approve/reject reviews with filtering
- **Order Management**: View all orders with status tracking
- **Analytics Dashboard**: Sales reports, user statistics, revenue tracking
- **User Management**: View users, manage status, view history
- **Notifications**: Send broadcast and individual notifications
- **Help Support**: View and respond to help requests

### User Functionalities
- **Authentication**: Sign up, login with JWT + cookies
- **Profile Management**: View/edit personal profile
- **Product Browsing**: Search, filter, pagination
- **Cart & Wishlist**: Add/remove items, favorites
- **Order & Payment**: Place orders with Razorpay integration
- **Review & Rating**: Rate products after purchase
- **Help/Support**: Submit help requests
- **Notifications**: Receive and manage notifications

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + Cookie-based auth
- **Payment Gateway**: Razorpay
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer (for future image uploads)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment variables
   cp env.example .env
   ```

4. **Configure Environment Variables**
   ```bash
   # Edit .env file with your configurations
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ecommerce_db
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret_key
   COOKIE_EXPIRE=7
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### User Registration
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  }
}
```

#### User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Admin Login
```http
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Product Endpoints

#### Get All Products
```http
GET /products?page=1&limit=10&keyword=phone&category=Electronics&price[gte]=100&price[lte]=1000
```

#### Get Single Product
```http
GET /products/:id
```

#### Create Product (Protected)
```http
POST /products/new
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 13",
  "description": "Latest iPhone model",
  "price": 999,
  "category": "Electronics",
  "seller": "Apple Store",
  "stock": 50,
  "tags": ["smartphone", "apple"],
  "specifications": {
    "color": "Black",
    "storage": "128GB"
  }
}
```

### Order Endpoints

#### Create Order
```http
POST /orders/new
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderItems": [
    {
      "product": "product_id",
      "quantity": 2
    }
  ],
  "shippingInfo": {
    "address": "123 Main St",
    "city": "New York",
    "phoneNo": "+1234567890",
    "postalCode": "10001",
    "country": "USA"
  },
  "itemsPrice": 1998,
  "taxPrice": 200,
  "shippingPrice": 50,
  "totalPrice": 2248,
  "paymentInfo": {
    "id": "razorpay_payment_id",
    "status": "succeeded",
    "method": "card"
  }
}
```

#### Get User Orders
```http
GET /orders/me?page=1&limit=10&status=Delivered
Authorization: Bearer <token>
```

### Cart Endpoints

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "quantity": 1
}
```

### Review Endpoints

#### Create Review
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id",
  "orderId": "order_id",
  "rating": 5,
  "title": "Great Product!",
  "comment": "Excellent quality and fast delivery."
}
```

### Admin Endpoints

#### Dashboard Statistics
```http
GET /admin/dashboard
Authorization: Bearer <admin_token>
```

#### Get All Users
```http
GET /admin/users?page=1&limit=10&status=active&search=john
Authorization: Bearer <admin_token>
```

#### Approve Product
```http
PUT /admin/products/approve/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "approvalStatus": "approved"
}
```

### Help Request Endpoints

#### Create Help Request
```http
POST /help
Authorization: Bearer <token>
Content-Type: application/json

{
  "subject": "Order Issue",
  "message": "My order hasn't arrived yet",
  "category": "order_issue",
  "order": "order_id"
}
```

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

For cookie-based authentication, the token is automatically sent with requests.

## 📊 Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  status: String (active/blocked),
  avatar: Object,
  address: Object,
  wishlist: [Product],
  favorites: [Product]
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  stock: Number,
  status: String (active/inactive/out_of_stock),
  approvalStatus: String (pending/approved/rejected),
  ratings: Number,
  reviews: [Review],
  images: [Object]
}
```

### Order Schema
```javascript
{
  user: ObjectId,
  orderItems: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  shippingInfo: Object,
  paymentInfo: Object,
  orderStatus: String,
  totalPrice: Number
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Express rate limiter
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **Role-based Access**: Admin and user role management

## 📈 Payment Integration

The system integrates with Razorpay for payment processing:

1. **Create Payment Order**
   ```http
   POST /orders/create-payment
   ```

2. **Verify Payment**
   ```http
   POST /orders/verify-payment
   ```

## 🧪 Testing

### Using Postman

1. Import the provided Postman collection
2. Set up environment variables
3. Test all endpoints with proper authentication

### Manual Testing

```bash
# Test health check
curl http://localhost:5000/api/health

# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 📁 Project Structure

```
Backend/
├── controllers/          # Route controllers
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── userController.js
│   ├── adminController.js
│   ├── cartController.js
│   ├── reviewController.js
│   ├── notificationController.js
│   └── helpController.js
├── models/              # Database models
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Review.js
│   ├── Cart.js
│   ├── Notification.js
│   └── HelpRequest.js
├── routes/              # API routes
│   ├── auth.js
│   ├── user.js
│   ├── product.js
│   ├── order.js
│   ├── cart.js
│   ├── review.js
│   ├── admin.js
│   ├── notification.js
│   └── help.js
├── middleware/          # Custom middleware
│   ├── auth.js
│   ├── errorHandler.js
│   └── validate.js
├── utils/              # Utility functions
│   ├── errorHandler.js
│   ├── sendToken.js
│   ├── apiFeatures.js
│   └── razorpay.js
├── server.js           # Main server file
├── package.json
├── env.example
└── README.md
```

## 🚀 Deployment

### Environment Variables for Production

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Start the application
pm2 start server.js --name "ecommerce-api"

# Monitor the application
pm2 monit

# View logs
pm2 logs ecommerce-api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0**: Initial release with full CRUD operations
- **v1.1.0**: Added payment integration
- **v1.2.0**: Added admin dashboard and analytics
- **v1.3.0**: Added notification system and help requests

---

**Note**: This is a comprehensive backend system. Make sure to properly configure your environment variables and database before running the application. 