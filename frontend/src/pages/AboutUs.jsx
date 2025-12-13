import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-primary-600 transition-colors">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">About Us</span>
                    </nav>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        About Zahrat Alrabie
                    </h1>
                    <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
                        Your trusted partner for fresh fruits and vegetables in Sharjah
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Our Story */}
                <div className="mb-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                                <p>
                                    Zahrat Alrabie Vegetables & Fruits Trading LLC is one of the leading suppliers
                                    of fresh fruits and vegetables in Sharjah, United Arab Emirates. We are committed
                                    to providing the highest quality produce to our valued customers.
                                </p>
                                <p>
                                    Located in the heart of Souq Al Jubail, Al Qasimiah, Sharjah, our store has
                                    become a trusted destination for families and businesses seeking fresh, quality
                                    produce at competitive prices.
                                </p>
                                <p>
                                    With our expansion into e-commerce, we now bring the same quality and freshness
                                    directly to your doorstep. Now the region's trusted supplier is delivering
                                    directly to your homes!
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 p-8 flex items-center justify-center">
                                <div className="text-center">
                                    <svg className="w-32 h-32 mx-auto text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <p className="text-2xl font-bold text-primary-900">Fresh Quality</p>
                                    <p className="text-primary-700">Delivered Daily</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Our Values */}
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                        Our Core Values
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Quality */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality First</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We source only the freshest fruits and vegetables, ensuring every product meets
                                our high standards of quality and freshness.
                            </p>
                        </div>

                        {/* Customer Service */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Focus</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Your satisfaction is our priority. We're dedicated to providing exceptional
                                service and building lasting relationships with our customers.
                            </p>
                        </div>

                        {/* Trust */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trust & Integrity</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We operate with transparency and honesty, building trust through consistent
                                quality and reliable service.
                            </p>
                        </div>
                    </div>
                </div>

                {/* What We Offer */}
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                        What We Offer
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center">
                            <div className="text-4xl mb-3">🍎</div>
                            <h3 className="font-bold text-gray-900 mb-2">Fresh Fruits</h3>
                            <p className="text-sm text-gray-600">Locally sourced and imported premium fruits</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                            <div className="text-4xl mb-3">🥬</div>
                            <h3 className="font-bold text-gray-900 mb-2">Vegetables</h3>
                            <p className="text-sm text-gray-600">Farm-fresh vegetables delivered daily</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 text-center">
                            <div className="text-4xl mb-3">🌿</div>
                            <h3 className="font-bold text-gray-900 mb-2">Organic Options</h3>
                            <p className="text-sm text-gray-600">Certified organic produce available</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center">
                            <div className="text-4xl mb-3">🚚</div>
                            <h3 className="font-bold text-gray-900 mb-2">Home Delivery</h3>
                            <p className="text-sm text-gray-600">Fast and reliable delivery service</p>
                        </div>
                    </div>
                </div>

                {/* Company Information */}
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                        Company Information
                    </h2>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
                            <h3 className="text-2xl font-bold text-white">ZAHRAT ALRABIE VEG. & FRUIT TR LLC SP.</h3>
                        </div>
                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">Store Location</h4>
                                            <p className="text-gray-600">
                                                Shop No-04, Souq Al Jubail<br />
                                                Al Qasimiah, Sharjah<br />
                                                United Arab Emirates
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                                            <a href="mailto:zahratvegfruits@gmail.com" className="text-primary-600 hover:text-primary-700">
                                                zahratvegfruits@gmail.com
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                                            <a href="tel:+971555000000" className="text-primary-600 hover:text-primary-700">
                                                +971 555 000 000
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">Business Hours</h4>
                                            <p className="text-gray-600">
                                                Saturday - Thursday: 7:00 AM - 10:00 PM<br />
                                                Friday: 8:00 AM - 11:00 PM
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
                        Why Choose Us?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">✓</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Fresh Daily Deliveries</h3>
                                <p className="text-gray-600">We receive fresh produce daily to ensure maximum freshness</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">✓</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Competitive Prices</h3>
                                <p className="text-gray-600">Best value for money without compromising on quality</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">✓</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Wide Selection</h3>
                                <p className="text-gray-600">Extensive variety of local and imported produce</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">✓</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-2">Convenient Shopping</h3>
                                <p className="text-gray-600">Shop online or visit our store - your choice!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-xl p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Experience Fresh Quality?
                    </h2>
                    <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                        Start shopping now and enjoy fresh fruits and vegetables delivered to your doorstep
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/products"
                            className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary-50 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            Shop Now
                        </Link>
                        <a
                            href="tel:+971555000000"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-colors backdrop-blur-sm border-2 border-white/30"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Contact Us
                        </a>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-12 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
