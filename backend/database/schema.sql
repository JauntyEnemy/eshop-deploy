-- Create Database
CREATE DATABASE IF NOT EXISTS zahrat_alrabie CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zahrat_alrabie;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    brand VARCHAR(100),
    stock INT DEFAULT 0,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Delivery Zones Table
CREATE TABLE IF NOT EXISTS delivery_zones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    fee DECIMAL(10, 2) NOT NULL,
    estimated_time VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Delivery Slots Table (New)
CREATE TABLE IF NOT EXISTS delivery_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    label VARCHAR(50) NOT NULL, -- e.g., "Morning (9AM - 12PM)"
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    delivery_zone_id INT,
    delivery_slot_id INT,
    tracking_code VARCHAR(50) UNIQUE,
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_zone_id) REFERENCES delivery_zones(id) ON DELETE SET NULL,
    FOREIGN KEY (delivery_slot_id) REFERENCES delivery_slots(id) ON DELETE SET NULL
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL, -- Price at time of purchase
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data: Products
INSERT INTO products (name, description, price, category, stock, image_url) VALUES 
('Red Apple', 'Fresh red apples from the farm', 5.00, 'Fruits', 100, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500'),
('Banana', 'Sweet organic bananas', 3.50, 'Fruits', 150, 'https://images.unsplash.com/photo-1571771896612-e63411190f75?w=500'),
('Orange', 'Juicy oranges rich in Vitamin C', 4.00, 'Fruits', 120, 'https://images.unsplash.com/photo-1547514701-42782101795e?w=500'),
('Strawberry', 'Fresh strawberries pack', 15.00, 'Berries', 50, 'https://images.unsplash.com/photo-1464965911861-746a04b4b0a6?w=500'),
('Mango', 'Premium sweet mangoes', 8.00, 'Fruits', 80, 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500');

-- Sample Data: Delivery Zones
INSERT INTO delivery_zones (name, fee, estimated_time) VALUES 
('Downtown Dubai', 10.00, '30-45 mins'),
('Dubai Marina', 15.00, '45-60 mins'),
('Jumeirah', 12.00, '40-50 mins'),
('Deira', 20.00, '60-90 mins');

-- Sample Data: Delivery Slots
INSERT INTO delivery_slots (start_time, end_time, label) VALUES 
('09:00:00', '12:00:00', 'Morning (9 AM - 12 PM)'),
('12:00:00', '15:00:00', 'Afternoon (12 PM - 3 PM)'),
('15:00:00', '18:00:00', 'Late Afternoon (3 PM - 6 PM)'),
('18:00:00', '21:00:00', 'Evening (6 PM - 9 PM)');

-- Sample Data: Admin (password: password123)
INSERT INTO admins (username, password, name) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super Admin');
