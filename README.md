# Zahrat Alrabie E-commerce - Full Stack Application

A modern, mobile-first e-commerce platform for selling fresh fruits and vegetables in Dubai, built with React and PHP Slim Framework.

## 🏗️ Project Structure

```
E-Shop/
├── backend/                    # PHP Slim Backend
│   ├── bootstrap/
│   │   └── app.php            # Application bootstrap & DI container setup
│   ├── config/
│   │   ├── database.php       # Database configuration
│   │   └── settings.php       # App settings (CORS, JWT, SMS)
│   ├── database/
│   │   └── schema.sql         # MySQL database schema
│   ├── public/
│   │   ├── .htaccess          # URL rewriting rules
│   │   └── index.php          # Entry point
│   ├── src/
│   │   ├── Controllers/       # Request handlers
│   │   │   ├── AdminController.php
│   │   │   ├── DeliveryController.php
│   │   │   ├── OrderController.php
│   │   │   └── ProductController.php
│   │   ├── Helpers/
│   │   │   └── Validator.php  # Input validation
│   │   ├── Middleware/
│   │   │   ├── AuthMiddleware.php   # JWT authentication
│   │   │   └── CorsMiddleware.php   # CORS handling
│   │   ├── Models/            # Database models
│   │   │   ├── DeliveryZone.php
│   │   │   ├── Order.php
│   │   │   └── Product.php
│   │   ├── routes/
│   │   │   └── api.php        # API route definitions
│   │   └── Services/          # Business logic
│   │       ├── AuthService.php
│   │       ├── ResponseService.php
│   │       └── SMSService.php
│   ├── vendor/                # Composer dependencies
│   ├── composer.json
│   └── composer.lock
│
└── frontend/                   # React Frontend
    ├── public/
    ├── src/
    │   ├── assets/            # Images, fonts, etc.
    │   ├── components/        # Reusable UI components
    │   │   ├── CartSidebar.jsx
    │   │   ├── Navbar.jsx
    │   │   └── ProductCard.jsx
    │   ├── context/           # React Context for state
    │   │   └── CartContext.jsx
    │   ├── hooks/             # Custom React hooks
    │   ├── pages/             # Page components
    │   │   ├── Home.jsx
    │   │   ├── ProductList.jsx
    │   │   └── TrackOrder.jsx
    │   ├── services/          # API communication
    │   │   └── api.js
    │   ├── App.jsx            # Main app component
    │   ├── index.css          # Global styles
    │   └── main.jsx           # Entry point
    ├── .env                   # Environment variables
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

## 📚 How Each Folder Works

### Backend Structure

#### `/bootstrap/app.php`
- Sets up the Slim application
- Configures dependency injection container
- Registers services, models, controllers, and middleware
- Loads routes and returns the app instance

#### `/config/`
- **database.php**: PDO connection settings for MySQL
- **settings.php**: Application configuration (CORS origins, JWT secret, SMS provider)

#### `/src/Controllers/`
Controllers handle HTTP requests and return responses:
- **ProductController**: CRUD operations for products
- **OrderController**: Create orders, update status, track orders
- **DeliveryController**: Manage delivery zones and time slots
- **AdminController**: Authentication, dashboard statistics

#### `/src/Models/`
Models interact with the database using PDO:
- Handle CRUD operations
- Execute prepared statements
- Return data as arrays

#### `/src/Services/`
- **AuthService**: JWT token generation/verification, password hashing
- **ResponseService**: Standardized JSON responses
- **SMSService**: Send SMS notifications (order confirmation, delivery updates)

#### `/src/Middleware/`
- **CorsMiddleware**: Handles cross-origin requests from React
- **AuthMiddleware**: Validates JWT tokens for protected routes

#### `/src/routes/api.php`
Defines all API endpoints and maps them to controllers

### Frontend Structure

#### `/src/pages/`
Full-page components:
- **Home.jsx**: Landing page with hero, features, and featured products
- **ProductList.jsx**: Browse all products with search and filters
- **TrackOrder.jsx**: Track order status by tracking code

#### `/src/components/`
Reusable UI components:
- **Navbar.jsx**: Navigation bar with cart icon
- **ProductCard.jsx**: Product display card with add-to-cart
- **CartSidebar.jsx**: Sliding cart panel

#### `/src/context/CartContext.jsx`
Global state management for shopping cart:
- Add/remove items
- Update quantities
- Calculate totals
- Persist to localStorage

#### `/src/services/api.js`
Axios-based API client:
- Centralized API calls
- Request interceptors for auth tokens
- Organized by feature (products, orders, delivery)

## 🔌 API Endpoints

### Products
```
GET    /api/products           # Get all products
GET    /api/products/{id}      # Get single product
POST   /api/admin/products     # Create product (protected)
PUT    /api/admin/products/{id} # Update product (protected)
DELETE /api/admin/products/{id} # Delete product (protected)
```

### Orders
```
POST   /api/orders             # Create new order
GET    /api/orders/track/{code} # Track order by code
GET    /api/admin/orders       # Get all orders (protected)
GET    /api/admin/orders/{id}  # Get order details (protected)
PATCH  /api/admin/orders/{id}/status # Update status (protected)
```

### Delivery
```
GET    /api/delivery/zones     # Get delivery zones
GET    /api/delivery/slots     # Get delivery time slots
```

### Admin
```
POST   /api/admin/login        # Admin login
GET    /api/admin/me           # Get current admin (protected)
GET    /api/admin/dashboard    # Dashboard stats (protected)
```

## 🔄 How React ↔ Slim Works

### 1. CORS Configuration
**Backend** (`config/settings.php`):
```php
'cors' => [
    'origin' => ['http://localhost:3000', 'http://localhost:5173'],
    'methods' => ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    'headers' => ['Content-Type', 'Authorization'],
    'credentials' => true,
]
```

**Frontend** (`services/api.js`):
```javascript
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' }
});
```

### 2. Making API Calls
```javascript
// Example: Fetch products
const response = await productService.getAll();
if (response.data.success) {
  setProducts(response.data.data);
}
```

### 3. Error Handling
```javascript
try {
  const response = await orderService.create(orderData);
  // Handle success
} catch (error) {
  console.error('API Error:', error.response?.data?.message);
}
```

### 4. Authentication Flow
1. Admin logs in via `/api/admin/login`
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Axios interceptor adds token to all requests:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🗄️ Database Schema

See `backend/database/schema.sql` for the complete schema.

### Key Tables:
- **products**: Product catalog
- **orders**: Customer orders
- **order_items**: Order line items
- **delivery_zones**: Delivery areas and fees
- **delivery_slots**: Available delivery time windows
- **admins**: Admin users

## 🚀 Getting Started

### Backend Setup
```bash
cd backend

# Install dependencies
E:\xamp\php\php.exe composer.phar install

# Import database
mysql -u root -p < database/schema.sql

# Update config/database.php with your credentials

# Start PHP server
E:\xamp\php\php.exe -S localhost:8000 -t public
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🎨 Design Features

- **Mobile-first**: Responsive design optimized for mobile devices
- **Tailwind CSS**: Utility-first styling with custom theme
- **Framer Motion**: Smooth animations and transitions
- **Clean UI**: Modern, premium aesthetic with green/orange color scheme
- **Micro-interactions**: Hover effects, active states, loading states

## 📦 Deployment to Hostinger

### Backend
1. Upload `backend/` folder to public_html
2. Import `database/schema.sql` via phpMyAdmin
3. Update `config/database.php` with production credentials
4. Update `config/settings.php` CORS origins to production domain

### Frontend
1. Build: `npm run build`
2. Upload `dist/` contents to public_html
3. Update `.env` with production API URL
4. Configure `.htaccess` for SPA routing

## 🔐 Security Notes

- Change JWT secret in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement rate limiting
- Validate all user inputs
- Use prepared statements (already implemented)

## 📝 License

Proprietary - Zahrat Alrabie E-commerce
