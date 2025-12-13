import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
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
                        <span className="text-gray-900 font-medium">Terms & Conditions</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Terms & Conditions
                    </h1>
                    <p className="text-lg text-gray-600">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                {/* Introduction */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-lg p-8 mb-8 text-white">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-3">Please Read Carefully</h2>
                            <p className="text-primary-100 leading-relaxed">
                                Please read our terms and conditions carefully. It is imperative that you agree and comply
                                with all of the terms and conditions of our store. By registering and creating an account,
                                or by using or visiting our website, you accept and are bound to these terms.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Terms Sections */}
                <div className="space-y-8">
                    {/* Acceptance of Terms */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptance of Terms</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        The terms and conditions apply to Zahrat Alrabie with website zahrat-alrabie.ae
                                        and its associated applications on all available platforms including laptops,
                                        smartphones, tablets, and other portable devices.
                                    </p>
                                    <p>
                                        By using or visiting this website, you certify that the information provided by
                                        you is true, complete, accurate and current, including your contact and payment
                                        information. You must inform us immediately of any changes to the personal
                                        information you provided when registering by updating your profile on the site,
                                        or by contacting us.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* User Obligations */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Obligations</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        You may not use false, misleading, or fraudulent information in relation to your
                                        account. You agree not to impersonate any other person, body, or entity, and you
                                        agree not to use a false or unauthorized name, and/or the name or likeness of another.
                                    </p>
                                    <p>
                                        Zahrat Alrabie may change or remove any information that it considers inappropriate
                                        or unlawful, and you agree that we may take steps to verify the accuracy of the
                                        information provided to us by you.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Prohibited Conduct */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Prohibited Conduct</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        We strictly prohibit the use of the website and/or services, and you shall not
                                        use the website and/or services, for any of the following:
                                    </p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></span>
                                            <span>Engage in unlawful conduct that violates any government law or regulation and that would infringe upon established internet protocol.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></span>
                                            <span>Attempt to impersonate another person or customer or provide any fraudulent information.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></span>
                                            <span>The unauthorized use of another user's username, password, and account.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></span>
                                            <span>Use the website, products, and/or services in any way to compete with Zahrat Alrabie and the website, products and/or services we provide.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></span>
                                            <span>Attempt to circumvent or interfere with the website's measures and operations in an attempt to gain unauthorized access or prevent/restrict access to any portion of the website.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></span>
                                            <span>Transmitting or posting any information or engaging in any activity that threatens Zahrat Alrabie and its employees or agents through any means of communication.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></span>
                                            <span>Use the website in a manner that goes against any and all applicable laws and regulations.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-red-600 rounded-full mt-2"></span>
                                            <span>Engage in harassment, intimidation, or malicious activity that is considered threatening, defamatory, or otherwise offensive on the website and its associated networks and applications.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Account Suspension */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Suspension & Liability</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        Zahrat Alrabie reserves the right to suspend or cancel your registration and any
                                        accepted order placed by you should you breach any of the terms listed in our
                                        terms and conditions.
                                    </p>
                                    <p>
                                        The prohibited acts listed on this document are non-restrictive. Should you breach
                                        any of the listed restrictions, you will be financially responsible for all the
                                        costs and damages incurred as a result.
                                    </p>
                                    <p>
                                        Zahrat Alrabie agrees to fully cooperate with any law enforcement authorities
                                        should they request or direct us to disclose all information we have available
                                        on any person or body in breach of statutory duty.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Force Majeure */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Force Majeure</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        Neither party shall be liable for failure or delay in the execution of respective
                                        obligations listed under the terms and conditions, to the extent that such failure
                                        or delay is caused by a Force Majeure event.
                                    </p>
                                    <p>
                                        A Force Majeure event includes any unexpected, unforeseen, or unavoidable event
                                        beyond any party's reasonable control. Force Majeure events include but are not
                                        limited to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Industrial disputes</li>
                                        <li>Failure of energy sources or transport networks</li>
                                        <li>Fires and natural disasters</li>
                                        <li>Epidemics and pandemics</li>
                                        <li>Extreme adverse weather conditions</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Service Availability */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Availability</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        Zahrat Alrabie may need to temporarily interrupt or completely cease the website
                                        functions and system operations at any given time. Zahrat Alrabie shall not be
                                        liable to any members or any third parties due to the temporary suspension or
                                        complete cessation of system operations.
                                    </p>
                                    <p>
                                        The website may from time to time become unavailable to allow for repairs,
                                        maintenance, site upgrades and/or introduction of new products or services. We
                                        will do our best to notify customers in advance of any service unavailability,
                                        however we cannot guarantee advance notification.
                                    </p>
                                    <p>
                                        We reserve the right to alter, suspend, and withdraw the website and our services
                                        at any time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Intellectual Property */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        All content on this website, including but not limited to text, graphics, logos,
                                        button icons, images, audio clips, digital downloads, data compilations, and
                                        software, are the sole and exclusive property of Zahrat Alrabie.
                                    </p>
                                    <p>
                                        All such contents and materials are protected by domestic and international
                                        copyright and trademark laws. You hereby agree not to modify, copy, reproduce,
                                        republish, upload, post, transmit, or distribute any portion of the website or
                                        any contents contained on the website without our prior expressed written consent.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Governing Law */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        We operate under the governance of, and in accordance with, the United Arab
                                        Emirates law. Disputes arising in relation with this website and associated
                                        applications shall be subject to the exclusive jurisdiction of the Sharjah courts.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Disclaimer */}
                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
                                <div className="space-y-4 text-gray-700 leading-relaxed">
                                    <p>
                                        Your use of the Service is at your sole risk. The Service is provided on an "AS IS"
                                        and "AS AVAILABLE" basis. The Service is provided without warranties of any kind,
                                        whether express or implied, including, but not limited to, implied warranties of
                                        merchantability, fitness for a particular purpose, non-infringement or course of
                                        performance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Contact Section */}
                <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-lg p-8 text-white">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Questions About Our Terms?</h2>
                        <p className="mb-6 text-primary-100">
                            If you have any questions about these Terms and Conditions, please feel free to contact us.
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

export default TermsAndConditions;
