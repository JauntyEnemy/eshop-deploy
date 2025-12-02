import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminInventory from './pages/AdminInventory';
import AdminOrders from './pages/AdminOrders';
import AdminCustomers from './pages/AdminCustomers';
import AdminReports from './pages/AdminReports';
import DebugPage from './pages/DebugPage';

function AppContent() {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith('/admin');

    console.log('App rendering. Path:', location.pathname, 'isAdminPage:', isAdminPage);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {!isAdminPage && <Navbar />}
            {!isAdminPage && <CartSidebar />}

            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/track" element={<TrackOrder />} />
                    <Route path="/debug" element={<DebugPage />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route 
                        path="/admin/dashboard" 
                        element={
                            <ProtectedAdminRoute>
                                <AdminDashboard />
                            </ProtectedAdminRoute>
                        } 
                    />
                    <Route 
                        path="/admin/products" 
                        element={
                            <ProtectedAdminRoute>
                                <AdminProducts />
                            </ProtectedAdminRoute>
                        } 
                    />
                    <Route 
                        path="/admin/inventory" 
                        element={
                            <ProtectedAdminRoute>
                                <AdminInventory />
                            </ProtectedAdminRoute>
                        } 
                    />
                    <Route 
                        path="/admin/orders" 
                        element={
                            <ProtectedAdminRoute>
                                <AdminOrders />
                            </ProtectedAdminRoute>
                        } 
                    />
                    <Route 
                        path="/admin/customers" 
                        element={
                            <ProtectedAdminRoute>
                                <AdminCustomers />
                            </ProtectedAdminRoute>
                        } 
                    />
                    <Route 
                        path="/admin/reports" 
                        element={
                            <ProtectedAdminRoute>
                                <AdminReports />
                            </ProtectedAdminRoute>
                        } 
                    />
                </Routes>
            </main>

            {!isAdminPage && (
                <footer className="bg-white border-t border-gray-100 py-12 mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                        Z
                                    </div>
                                    <span className="font-bold text-xl text-gray-900">Zahrat Alrabie</span>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    Premium quality fruits and vegetables delivered to your doorstep in Dubai.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 mb-4">Shop</h3>
                                <ul className="space-y-2 text-sm text-gray-500">
                                    <li><a href="#" className="hover:text-primary-600">All Products</a></li>
                                    <li><a href="#" className="hover:text-primary-600">Fruits</a></li>
                                    <li><a href="#" className="hover:text-primary-600">Vegetables</a></li>
                                    <li><a href="#" className="hover:text-primary-600">Organic</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 mb-4">Company</h3>
                                <ul className="space-y-2 text-sm text-gray-500">
                                    <li><a href="#" className="hover:text-primary-600">About Us</a></li>
                                    <li><a href="#" className="hover:text-primary-600">Contact</a></li>
                                    <li><a href="#" className="hover:text-primary-600">Terms & Conditions</a></li>
                                    <li><a href="#" className="hover:text-primary-600">Privacy Policy</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-gray-900 mb-4">Contact</h3>
                                <ul className="space-y-2 text-sm text-gray-500">
                                    <li>Dubai, UAE</li>
                                    <li>support@zahrat-alrabie.com</li>
                                    <li>+971 50 123 4567</li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 mt-12 pt-8 text-center text-sm text-gray-400">
                            © {new Date().getFullYear()} Zahrat Alrabie E-commerce. All rights reserved.
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}

function App() {
    return (
        <CartProvider>
            <Router>
                <AppContent />
            </Router>
        </CartProvider>
    );
}

export default App;
