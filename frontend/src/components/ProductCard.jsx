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
                    className="absolute bottom-3 right-3 md:bottom-4 md:right-4 p-2 md:p-3 bg-white rounded-full shadow-lg opacity-100 translate-y-0 md:translate-y-12 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-primary-500 hover:text-white text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 z-10"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="p-3 md:p-4">
                <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                {product.brand && (
                    <div className="mb-2">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600 border border-blue-100">
                            {product.brand}
                        </span>
                    </div>
                )}
                <p className="text-xs md:text-sm text-gray-500 line-clamp-2 mb-2 md:mb-3 hidden sm:block">{product.description}</p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <span className="text-sm md:text-xl font-bold text-gray-900">
                        AED {parseFloat(product.price).toFixed(2)}<span className="text-xs md:text-sm font-bold text-gray-500">/{product.size ? `${parseFloat(product.size)} ${product.unit_of_measurement}` : (product.sku || 'kg')}</span>
                    </span>
                    <div className="text-[10px] md:text-xs text-gray-400">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
