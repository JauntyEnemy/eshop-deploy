import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { orderService } from '../services/api';
import { Search, Package, CheckCircle, Truck, Clock, XCircle } from 'lucide-react';

const TrackOrder = () => {
    // ... (no change to hooks)
    const location = useLocation();
    const [trackingCode, setTrackingCode] = useState(location.state?.trackingCode || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (location.state?.trackingCode) {
            handleTrack(null, location.state.trackingCode);
        }
    }, [location.state?.trackingCode]);

    const handleTrack = async (e, code = null) => {
        if (e) e.preventDefault();

        const codeToUse = code || trackingCode;
        if (!codeToUse.trim()) return;

        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const response = await orderService.track(codeToUse);
            if (response.data.success) {
                setOrder(response.data.data);
            }
        } catch (err) {
            setError('Order not found. Please check your tracking code.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status) => {
        const steps = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
        return steps.indexOf(status);
    };

    const steps = [
        { label: 'Order Placed', icon: Clock },
        { label: 'Confirmed', icon: CheckCircle },
        { label: 'Preparing', icon: Package },
        { label: 'Out for Delivery', icon: Truck },
        { label: 'Delivered', icon: CheckCircle },
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
                <p className="text-gray-500">Enter your tracking code to see the current status of your delivery</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <form onSubmit={handleTrack} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={trackingCode}
                            onChange={(e) => setTrackingCode(e.target.value)}
                            placeholder="Enter Tracking Code (e.g., TRK-123456)"
                            className="input-field pl-10"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary min-w-[120px]"
                    >
                        {loading ? 'Tracking...' : 'Track'}
                    </button>
                </form>
                {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
            </div>

            {order && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                    <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Order #{order.id}</h2>
                            <p className="text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                            <p className="text-xl font-bold text-primary-600">${parseFloat(order.total).toFixed(2)}</p>
                        </div>
                    </div>

                    {order.status === 'cancelled' ? (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-8 mb-12 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <XCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-red-700 mb-2">Order Cancelled</h3>
                            <p className="text-zinc-600">This order has been cancelled.</p>
                        </div>
                    ) : (
                        <div className="relative mb-12">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0" />
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 z-0 transition-all duration-1000"
                                style={{ width: `${(getStatusStep(order.status) / (steps.length - 1)) * 100}%` }}
                            />

                            <div className="relative z-10 flex justify-between">
                                {steps.map((step, idx) => {
                                    const isCompleted = getStatusStep(order.status) >= idx;
                                    const isCurrent = getStatusStep(order.status) === idx;

                                    return (
                                        <div key={idx} className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${isCompleted
                                                ? 'bg-primary-500 border-primary-500 text-white'
                                                : 'bg-white border-gray-200 text-gray-300'
                                                }`}>
                                                <step.icon className="w-5 h-5" />
                                            </div>
                                            <span className={`mt-3 text-xs font-medium ${isCurrent ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                                                }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900">Order Items</h3>
                        {order.items && order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={item.image_url || 'https://via.placeholder.com/50'} alt={item.product_name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{item.product_name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-medium text-gray-900">${parseFloat(item.price).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackOrder;
