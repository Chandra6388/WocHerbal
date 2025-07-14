<!-- WocHerbal E-commerce Website -->

# WocHerbal

![WocHerbal Banner](frontend1/public/lovable-uploads/4654272e-82ea-4eff-8386-6d9f4a2fcced.png)

## About

WocHerbal is a modern herbal products e-commerce website. It allows users to browse, search, and purchase herbal products, view blogs, track orders, and manage their profiles. The platform also includes an admin dashboard for product and order management.

## Features

- User authentication (login/register/forgot password)
- Product listing and detail pages
- Cart and checkout functionality
- Order tracking and success page
- Blog and testimonials section
- Contact and help support
- Admin dashboard for management
- Responsive and modern UI

## Code Structure

```
WocHerbal/
├── Backend/           # Node.js/Express API
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Express middlewares
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   ├── server.js      # Main server file
│   └── ...
├── frontend1/         # React + Vite frontend
│   ├── src/
│   │   ├── components/    # UI and layout components
│   │   ├── contexts/      # React context providers
│   │   ├── pages/         # Page components (Home, Products, Cart, etc.)
│   │   ├── routes/        # Route definitions
│   │   ├── services/      # API service functions
│   │   └── ...
│   ├── public/            # Static assets (images, favicon, etc.)
│   └── ...
└── Readme.md          # Project documentation
```

## Getting Started

### Backend

1. Go to the `Backend` folder:
   ```sh
   cd Backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Copy `env.example` to `.env` and update environment variables.
4. Start the server:
   ```sh
   npm start
   ```

### Frontend

1. Go to the `frontend1` folder:
   ```sh
   cd frontend1
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## How It Works

- Users can register, login, and browse products.
- Add products to cart and checkout securely.
- Track orders and view order history.
- Admins can manage products, orders, and users from the dashboard.

## Demo Image

![Demo](frontend1/public/lovable-uploads/4654272e-82ea-4eff-8386-6d9f4a2fcced.png)

## License

This project is for educational and demo purposes.
