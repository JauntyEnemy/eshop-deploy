import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronLeft, Clock, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import DeliveryMap from '../components/DeliveryMap';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useCart();

    const [loading, setLoading] = useState(false);
    const [deliveryZones, setDeliveryZones] = useState([]);
    const [deliverySlots, setDeliverySlots] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        delivery_zone_id: '',
        delivery_slot_id: '',
        notes: '',
    });

    const [addressState, setAddressState] = useState({
        emirate: '',
        region: '',
        street: ''
    });

    const EMIRATES = ['Ajman', 'Sharjah', 'Dubai'];
    const REGIONS = {
        'Ajman': ['Al Nuaimia', 'Al Rawda', 'City Center', 'Al Jurf', 'Corniche', 'Al Rashidiya'],
        'Sharjah': ['Al Nahda', 'Al Taawun', 'Al Majaz', 'Muweilah', 'University City', 'Al Qasimia'],
        'Dubai': ['Deira', 'Bur Dubai', 'Business Bay', 'Downtown', 'Marina', 'JLT', 'Palm Jumeirah', 'Al Barsha']
    };

    const [selectedZone, setSelectedZone] = useState(null);
    const [distance, setDistance] = useState(0);

    // Fetch delivery zones and slots on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [zonesRes, slotsRes] = await Promise.all([
                    axios.get('http://localhost:8000/api/delivery/zones'),
                    axios.get('http://localhost:8000/api/delivery/slots'),
                ]);

                const zones = zonesRes.data.data || [];
                setDeliveryZones(zones);
                setDeliverySlots(slotsRes.data.data || []);

                // Auto-select first zone for backend compatibility
                if (zones.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        delivery_zone_id: zones[0].id
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch delivery data:', err);
                setError('Failed to load delivery options. Please refresh the page.');
            }
        };

        fetchData();
    }, []);

    // Redirect if cart is empty
    if (cartItems.length === 0 && !success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="btn-primary"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleZoneChange = (zoneId) => {
        const zone = deliveryZones.find(z => z.id === parseInt(zoneId));
        setSelectedZone(zone);
        setFormData(prev => ({
            ...prev,
            delivery_zone_id: zoneId
        }));
    };

    const calculateDeliveryFee = () => {
        if (distance > 0) {
            // Dynamic Fee: Base 10 AED + 2 AED per km
            return 10 + (distance * 2);
        }
        return 0;
    };

    const deliveryFee = calculateDeliveryFee();
    const total = cartTotal + deliveryFee;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.customer_name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!formData.customer_phone.trim()) {
            setError('Please enter your phone number');
            return;
        }

        // Basic phone validation
        if (!/^[0-9+\-\s()]{7,}$/.test(formData.customer_phone)) {
            setError('Please enter a valid phone number');
            return;
        }

        if (!addressState.emirate) {
            setError('Please select an Emirate');
            return;
        }
        if (!addressState.region) {
            setError('Please select a Region');
            return;
        }
        if (!addressState.street.trim()) {
            setError('Please enter your street address');
            return;
        }

        if (distance === 0) {
            setError('Please pin your location on the map');
            return;
        }

        if (!formData.delivery_slot_id) {
            setError('Please select a delivery time slot');
            return;
        }

        setLoading(true);

        try {
            // Prepare order data
            const orderData = {
                customer_name: formData.customer_name,
                customer_phone: formData.customer_phone,
                customer_address: `${addressState.street}, ${addressState.region}, ${addressState.emirate}`,
                delivery_zone_id: parseInt(formData.delivery_zone_id),
                delivery_slot_id: parseInt(formData.delivery_slot_id),
                subtotal: cartTotal,
                delivery_fee: deliveryFee,
                total: total,
                notes: formData.notes,
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            // Submit order
            const response = await axios.post('http://localhost:8000/api/orders', orderData);

            if (response.data.success) {
                setSuccess('Order placed successfully!');
                clearCart();

                // Redirect to order confirmation
                setTimeout(() => {
                    navigate('/track', {
                        state: {
                            trackingCode: response.data.data.tracking_code,
                            orderNumber: response.data.data.id
                        }
                    });
                }, 1500);
            }
        } catch (err) {
            console.error('Order submission error:', err);
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/products')}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Alerts */}
                            {error && (
                                <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-800">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                    <p className="text-sm text-green-800">{success}</p>
                                </div>
                            )}

                            {/* Customer Information */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Information</h2>

                                <div className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="customer_name"
                                            value={formData.customer_name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            disabled={loading}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="customer_phone"
                                            value={formData.customer_phone}
                                            onChange={handleInputChange}
                                            placeholder="+971 50 123 4567"
                                            disabled={loading}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                                        />
                                    </div>

                                    {/* Address */}
                                    {/* Address Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Emirates *
                                            </label>
                                            <select
                                                value={addressState.emirate}
                                                onChange={(e) => setAddressState(prev => ({ ...prev, emirate: e.target.value, region: '' }))}
                                                disabled={loading}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 bg-white"
                                            >
                                                <option value="">Select Emirate</option>
                                                {EMIRATES.map(em => (
                                                    <option key={em} value={em}>{em}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Region *
                                            </label>
                                            <select
                                                value={addressState.region}
                                                onChange={(e) => setAddressState(prev => ({ ...prev, region: e.target.value }))}
                                                disabled={loading || !addressState.emirate}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 bg-white"
                                            >
                                                <option value="">Select Region</option>
                                                {addressState.emirate && REGIONS[addressState.emirate]?.map(reg => (
                                                    <option key={reg} value={reg}>{reg}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Street Address *
                                            </label>
                                            <input
                                                type="text"
                                                value={addressState.street}
                                                onChange={(e) => setAddressState(prev => ({ ...prev, street: e.target.value }))}
                                                placeholder="Building name, apartment no, street no..."
                                                disabled={loading}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Additional Notes (Optional)
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            placeholder="Special instructions for delivery (e.g., gate code, building access)"
                                            rows="2"
                                            disabled={loading}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Location Map */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary-600" />
                                    Delivery Location & Distance
                                </h2>
                                <DeliveryMap
                                    onDistanceChange={setDistance}
                                    addressQuery={addressState.region && addressState.emirate ? `${addressState.region}, ${addressState.emirate}` : ''}
                                />
                            </div>

                            {/* Delivery Slot */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary-600" />
                                    Select Delivery Time *
                                </h2>

                                <div className="grid grid-cols-2 gap-2">
                                    {deliverySlots.length === 0 ? (
                                        <p className="text-gray-500 text-sm col-span-2">Loading delivery slots...</p>
                                    ) : (
                                        deliverySlots.map(slot => (
                                            <label
                                                key={slot.id}
                                                className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                            >
                                                <input
                                                    type="radio"
                                                    name="delivery_slot_id"
                                                    value={slot.id}
                                                    checked={formData.delivery_slot_id === String(slot.id)}
                                                    onChange={handleInputChange}
                                                    disabled={loading}
                                                    className="w-4 h-4 text-primary-600"
                                                />
                                                <div className="ml-3">
                                                    <p className="font-medium text-gray-900 text-sm">{slot.label}</p>
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Processing Order...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 sticky top-24 space-y-4">
                            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm text-gray-600">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span className="font-medium">AED {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>AED {cartTotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>{deliveryFee > 0 ? `AED ${deliveryFee.toFixed(2)}` : 'TBD'}</span>
                                </div>

                                <div className="border-t border-gray-100 pt-2 flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span className="text-primary-600">AED {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/products')}
                                className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Add More Items
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
