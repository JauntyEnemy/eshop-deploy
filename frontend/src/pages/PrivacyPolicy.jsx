import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-500">
                        <Link to="/" className="hover:text-primary-600 transition-colors">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Privacy Policy</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-gray-600">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Introduction */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                    <p className="text-gray-700 leading-relaxed">
                        Zahrat Alrabie is committed to providing a quality service to you and holds your privacy
                        and personal data in high esteem. Your privacy is vital to us. We highly value your trust
                        and confidence in us and we want to assure you that all your personal information is kept
                        completely confidential.
                    </p>
                </div>

                {/* Policy Sections */}
                <div className="space-y-8">
                    {/* Accounts */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Accounts</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        When you create an account with us, you must provide us information that is accurate,
                                        complete, and current at all times. Failure to do so constitutes a breach of the Terms,
                                        which may result in immediate termination of your account on our Service.
                                    </p>
                                    <p>
                                        You are responsible for safeguarding the password that you use to access the Service
                                        and for any activities or actions under your password, whether your password is with
                                        our Service or a third-party service.
                                    </p>
                                    <p>
                                        You agree not to disclose your password to any third party. You must notify us
                                        immediately upon becoming aware of any breach of security or unauthorized use of
                                        your account.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Information Collection */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>We collect information that you provide directly to us, including:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Name, email address, and contact information</li>
                                        <li>Delivery address and billing information</li>
                                        <li>Payment information (processed securely through our payment providers)</li>
                                        <li>Order history and preferences</li>
                                        <li>Communications with our customer service team</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How We Use Information */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>We use the information we collect to:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Process and fulfill your orders</li>
                                        <li>Communicate with you about your orders and deliveries</li>
                                        <li>Provide customer support and respond to your inquiries</li>
                                        <li>Send you promotional offers and updates (with your consent)</li>
                                        <li>Improve our products, services, and website experience</li>
                                        <li>Detect and prevent fraud or unauthorized activities</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Data Security */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        We implement appropriate technical and organizational security measures to protect
                                        your personal information against unauthorized access, alteration, disclosure, or
                                        destruction. However, please note that no method of transmission over the Internet
                                        or electronic storage is 100% secure.
                                    </p>
                                    <p>
                                        We use industry-standard encryption for sensitive data and regularly review our
                                        security practices to ensure your information remains protected.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Cookies */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        We use cookies and similar tracking technologies to enhance your browsing experience,
                                        analyze site traffic, and understand where our visitors are coming from. You can
                                        control cookies through your browser settings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Third-Party Services */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        We may employ third-party companies and individuals to facilitate our Service,
                                        provide the Service on our behalf, perform Service-related services, or assist
                                        us in analyzing how our Service is used.
                                    </p>
                                    <p>
                                        These third parties have access to your personal information only to perform
                                        these tasks on our behalf and are obligated not to disclose or use it for any
                                        other purpose.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Your Rights */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>You have the right to:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Access the personal information we hold about you</li>
                                        <li>Request correction of inaccurate or incomplete information</li>
                                        <li>Request deletion of your personal information</li>
                                        <li>Object to or restrict processing of your information</li>
                                        <li>Withdraw consent for marketing communications at any time</li>
                                        <li>Request a copy of your data in a portable format</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Governing Law */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        This Privacy Policy shall be governed and construed in accordance with the laws
                                        of the United Arab Emirates, without regard to its conflict of law provisions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Changes to Policy */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        We reserve the right to modify this Privacy Policy at any time. We will notify
                                        you of any changes by posting the new Privacy Policy on this page and updating
                                        the "Last updated" date.
                                    </p>
                                    <p>
                                        By continuing to access or use our Service after those revisions become effective,
                                        you agree to be bound by the revised policy. If you do not agree to the new terms,
                                        please stop using the Service.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Contact Section */}
                <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-lg p-8 text-white">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Questions About Our Privacy Policy?</h2>
                        <p className="mb-6 text-primary-100">
                            If you have any questions about this Privacy Policy or our data practices,
                            please don't hesitate to contact us.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a
                                href="mailto:zahratvegfruits@gmail.com"
                                className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email Us
                            </a>
                            <a
                                href="tel:+971555000000"
                                className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Call Us
                            </a>
                        </div>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-8 text-center">
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

export default PrivacyPolicy;
