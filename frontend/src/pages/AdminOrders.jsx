import React, { useState, useEffect } from 'react';
import { Filter, Download, AlertCircle, Eye, Truck, Printer } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import OrderInvoice from '../components/OrderInvoice';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        preparing: 'bg-purple-100 text-purple-800',
        out_for_delivery: 'bg-indigo-100 text-indigo-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:8000/api/admin/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setOrders(response.data.data || []);
            }
        } catch (err) {
            setError('Failed to load orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.patch(
                `http://localhost:8000/api/admin/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setOrders(orders.map(o => o.id === orderId ? response.data.data : o));
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(response.data.data);
                }
            }
        } catch (err) {
            setError('Failed to update order status');
        }
    };

    const filteredOrders = statusFilter
        ? orders.filter(o => o.status === statusFilter)
        : orders;

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-500">Loading orders...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <>
            <AdminLayout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Orders</h2>
                            <p className="text-gray-600">Manage customer orders</p>
                        </div>
                        <button className="btn-primary flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>

                    {error && (
                        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Status Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => setStatusFilter('')}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${statusFilter === ''
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            All ({orders.length})
                        </button>
                        {statuses.map(status => {
                            const count = orders.filter(o => o.status === status).length;
                            return (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${statusFilter === status
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {status.replace('_', ' ')} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Order ID</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Customer</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Phone</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <p className="font-medium text-primary-600">#{order.id}</p>
                                                    <p className="text-xs text-gray-500">{order.tracking_code}</p>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-900">{order.customer_name}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{order.customer_phone}</td>
                                                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                    AED {parseFloat(order.total).toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer border-0 ${statusColors[order.status]}`}
                                                    >
                                                        {(JSON.parse(localStorage.getItem('admin') || '{}').role === 3
                                                            ? statuses.filter(s => ['out_for_delivery', 'delivered', 'cancelled'].includes(s))
                                                            : statuses
                                                        ).map(status => (
                                                            <option key={status} value={status}>
                                                                {status.replace('_', ' ').toUpperCase()}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowDetails(true);
                                                        }}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="py-8 text-center text-gray-500">
                                                No orders found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Details Modal */}
                    {showDetails && selectedOrder && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900">Order #{selectedOrder.id}</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => window.print()}
                                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            <Printer className="w-4 h-4" />
                                            Print Invoice
                                        </button>
                                        <button
                                            onClick={() => setShowDetails(false)}
                                            className="text-gray-500 hover:text-gray-700 p-1"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Customer Info */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                                        <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.customer_name}</p>
                                        <p className="text-sm"><span className="font-medium">Phone:</span> {selectedOrder.customer_phone}</p>
                                        <p className="text-sm"><span className="font-medium">Address:</span> {selectedOrder.customer_address}</p>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                                        <div className="space-y-2">
                                            {selectedOrder.items?.map((item) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span>{item.product_name} x {item.quantity}</span>
                                                    <span className="font-medium">AED {parseFloat(item.price).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Totals */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Subtotal</span>
                                            <span>AED {parseFloat(selectedOrder.subtotal).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span>Delivery Fee</span>
                                            <span>AED {parseFloat(selectedOrder.delivery_fee).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold">
                                            <span>Total</span>
                                            <span className="text-primary-600">AED {parseFloat(selectedOrder.total).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </AdminLayout>
            {/* Hidden Print Invoice */}
            <OrderInvoice order={selectedOrder} />
        </>
    );
};

export default AdminOrders;
