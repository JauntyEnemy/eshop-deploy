import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { cartCount, setIsCartOpen } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <span className="font-bold text-xl text-gray-900">Zahrat Alrabie</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                            Home
                        </Link>
                        <Link to="/products" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                            Shop
                        </Link>
                        <Link to="/track" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                            Track Order
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-500 hover:text-primary-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-500 hover:text-primary-600 transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-2">
                    <div className="flex flex-col space-y-1 px-4 pb-4">
                        <Link
                            to="/"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                            Home
                        </Link>
                        <Link
                            to="/products"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                            Shop
                        </Link>
                        <Link
                            to="/track"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                            Track Order
                        </Link>
                        <Link
                            to="/admin/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                        >
                            Admin Access
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
