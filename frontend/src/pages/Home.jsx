import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import { productService, categoryService } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const fetchInitialData = async () => {
        try {
            const catRes = await categoryService.getAll();
            if (catRes.data.success) {
                setCategories(catRes.data.data);
            }
        } catch (error) {
            console.error('Failed to load categories', error);
        }
    };

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const params = selectedCategory ? { category: selectedCategory } : {};
            const response = await productService.getAll(params);
            if (response.data.success) {
                setProducts(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    return (
        <div className="space-y-12 pb-16">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=2070&auto=format&fit=crop"
                        alt="Fresh Fruits"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </div>

                <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
                        Freshness Delivered
                    </h1>
                    <p className="text-lg text-gray-200 mb-6 animate-slide-up">
                        Premium quality fruits and vegetables sourced directly from the best farms.
                    </p>
                </div>
            </section>

            {/* Categories Navigation */}
            <section className="sticky top-[64px] z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${!selectedCategory
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            All Products
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${selectedCategory === cat.name
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {selectedCategory ? `${selectedCategory}` : 'All Products'}
                    </h2>
                    <span className="text-gray-500 text-sm">
                        {products.length} Items Found
                    </span>
                </div>

                {loadingProducts ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                        <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                        <p className="text-gray-500">Try selecting a different category</p>
                    </div>
                )}
            </section>

            {/* Features (Moved to bottom) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Leaf, title: '100% Organic', desc: 'Sourced from certified organic farms' },
                        { icon: Truck, title: 'Fast Delivery', desc: 'Same day delivery for orders before 2 PM' },
                        { icon: ShieldCheck, title: 'Quality Guarantee', desc: 'If you are not satisfied, we refund you' },
                    ].map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center p-6">
                            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mb-4 text-primary-600">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{feature.title}</h3>
                            <p className="text-sm text-gray-500">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
