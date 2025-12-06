import React from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card group"
        >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={
                        product.image_url
                            ? (/^https?:\/\//.test(product.image_url)
                                ? product.image_url
                                : 'http://localhost:8000' + product.image_url)
                            : 'https://via.placeholder.com/300'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 right-4 p-3 bg-white rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-500 hover:text-white text-primary-600"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4">
                <div className="text-xs text-primary-600 font-semibold mb-1 uppercase tracking-wider">
                    {product.category}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>

                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                        ${parseFloat(product.price).toFixed(2)}
                    </span>
                    <div className="text-xs text-gray-400">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
