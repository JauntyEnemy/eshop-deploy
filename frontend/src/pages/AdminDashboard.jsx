import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, ShoppingCart, Users, DollarSign, AlertCircle, BarChart3 } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    console.log('AdminDashboard component rendering. Stats:', stats, 'Loading:', loading, 'Error:', error);

    useEffect(() => {
        console.log('AdminDashboard useEffect running');
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            console.log('Token:', token ? 'Found' : 'NOT FOUND');
            
            const response = await axios.get('http://localhost:8000/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Dashboard Response:', response.data);
            
            if (response.data.success) {
                console.log('Stats data:', response.data.data);
                setStats(response.data.data);
            } else {
                console.log('Success flag is false');
                setError('API returned success=false');
            }
        } catch (err) {
            console.error('Dashboard API Error:', err);
            console.error('Error Response:', err.response?.data);
            setError('Failed to load dashboard stats: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, label, value, trend, color }) => (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trend && (
                    <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <TrendingUp className="w-4 h-4" />
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-gray-600 text-sm mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </AdminLayout>
        );
    }

    console.log('Rendering dashboard. Stats:', stats);

    if (!stats) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
                        <p className="text-gray-600">Welcome to your admin panel.</p>
                    </div>
                    
                    {error ? (
                        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    ) : (
                        <div className="flex gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-yellow-800">No data loaded. Please refresh the page.</p>
                        </div>
                    )}
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
                    <p className="text-gray-600">Welcome to your admin panel. Here's an overview of your store.</p>
                </div>

                {error && (
                    <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        icon={ShoppingCart}
                        label="Total Orders"
                        value={stats?.total_orders || 0}
                        color="bg-blue-500"
                    />
                    <StatCard
                        icon={AlertCircle}
                        label="Pending Orders"
                        value={stats?.pending_orders || 0}
                        color="bg-yellow-500"
                    />
                    <StatCard
                        icon={DollarSign}
                        label="Total Revenue"
                        value={`AED ${parseFloat(stats?.total_revenue || 0).toFixed(2)}`}
                        color="bg-green-500"
                    />
                    <StatCard
                        icon={Package}
                        label="Products"
                        value={stats?.total_products || 0}
                        color="bg-purple-500"
                    />
                    <StatCard
                        icon={Users}
                        label="Customers"
                        value={stats?.total_customers || 0}
                        color="bg-pink-500"
                    />
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Order ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Customer</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recent_orders?.length > 0 ? (
                                    stats.recent_orders.map((order) => (
                                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-medium text-primary-600">#{order.id}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900">{order.customer_name}</td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">AED {parseFloat(order.total).toFixed(2)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-gray-500">
                                            No recent orders
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow text-left">
                        <Package className="w-8 h-8 text-primary-600 mb-2" />
                        <h4 className="font-bold text-gray-900 mb-1">Add Product</h4>
                        <p className="text-sm text-gray-600">Create a new product</p>
                    </button>
                    <button className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow text-left">
                        <ShoppingCart className="w-8 h-8 text-primary-600 mb-2" />
                        <h4 className="font-bold text-gray-900 mb-1">Manage Orders</h4>
                        <p className="text-sm text-gray-600">Review and update orders</p>
                    </button>
                    <button className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow text-left">
                        <BarChart3 className="w-8 h-8 text-primary-600 mb-2" />
                        <h4 className="font-bold text-gray-900 mb-1">View Reports</h4>
                        <p className="text-sm text-gray-600">Sales and analytics</p>
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
