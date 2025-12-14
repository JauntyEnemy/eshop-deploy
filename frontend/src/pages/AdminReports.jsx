import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, Download } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminReports = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            setError('Failed to load reports');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    // Orders by status
    const ordersByStatus = {
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        out_for_delivery: orders.filter(o => o.status === 'out_for_delivery').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    // Revenue by date (last 7 days)
    const getLast7DaysRevenue = () => {
        const days = {};
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            days[dateStr] = 0;
        }

        orders.forEach(order => {
            // Safely parse date and get YYYY-MM-DD part
            try {
                const dateObj = new Date(order.created_at);
                const date = dateObj.toISOString().split('T')[0];

                if (days.hasOwnProperty(date)) {
                    days[date] += parseFloat(order.total || 0);
                }
            } catch (e) {
                console.warn('Invalid date for order:', order.id, order.created_at);
            }
        });

        return days;
    };

    const last7DaysRevenue = getLast7DaysRevenue();
    const maxRevenue = Math.max(...Object.values(last7DaysRevenue), 1);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-500">Loading reports...</p>
                </div>
            </AdminLayout>
        );
    }

    const StatCard = ({ label, value, trend, icon: Icon }) => (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-2">
                <p className="text-gray-600 text-sm">{label}</p>
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-600" />
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            {trend && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {trend}
                </p>
            )}
        </div>
    );

    const handleExport = () => {
        if (!orders.length) {
            alert('No data to export');
            return;
        }

        // Define CSV headers
        const headers = ['Order ID', 'Date', 'Customer Name', 'Status', 'Total (AED)'];

        // Convert orders to CSV rows
        const csvRows = [
            headers.join(','),
            ...orders.map(order => [
                order.id,
                new Date(order.created_at).toLocaleDateString(),
                `"${order.customer_name}"`, // Quote to handle commas in names
                order.status,
                parseFloat(order.total).toFixed(2)
            ].join(','))
        ];

        // Combine into single string
        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);

        // Trigger download
        link.click();

        // Cleanup
        document.body.removeChild(link);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Sales Reports</h2>
                        <p className="text-gray-600">Analyze your store performance</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="btn-primary flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>

                {error && (
                    <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        label="Total Revenue"
                        value={`AED ${totalRevenue.toFixed(2)}`}
                        icon={BarChart3}
                    />
                    <StatCard
                        label="Total Orders"
                        value={totalOrders}
                        trend={`${((deliveredOrders / totalOrders) * 100).toFixed(0)}% delivered`}
                        icon={BarChart3}
                    />
                    <StatCard
                        label="Average Order Value"
                        value={`AED ${averageOrderValue.toFixed(2)}`}
                        icon={TrendingUp}
                    />
                    <StatCard
                        label="Completion Rate"
                        value={`${totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : 0}%`}
                        trend={`${deliveredOrders} completed`}
                        icon={BarChart3}
                    />
                </div>

                {/* Revenue Chart - Last 7 Days */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Last 7 Days</h3>

                    <div className="space-y-3">
                        {Object.entries(last7DaysRevenue).map(([date, revenue]) => {
                            const percentage = (revenue / maxRevenue) * 100;
                            return (
                                <div key={date} className="flex items-center gap-4">
                                    <div className="w-24 text-sm font-medium text-gray-600">
                                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="flex-1">
                                        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                                            <div
                                                className="bg-primary-600 h-full flex items-center justify-end pr-2 transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            >
                                                {revenue > 0 && (
                                                    <span className="text-xs font-bold text-white">
                                                        AED {revenue.toFixed(0)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-24 text-right text-sm font-medium text-gray-900">
                                        AED {revenue.toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Order Status Distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Orders by Status</h3>

                        <div className="space-y-3">
                            {Object.entries(ordersByStatus).map(([status, count]) => {
                                const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                                const colors = {
                                    pending: 'bg-yellow-500',
                                    confirmed: 'bg-blue-500',
                                    preparing: 'bg-purple-500',
                                    out_for_delivery: 'bg-indigo-500',
                                    delivered: 'bg-green-500',
                                    cancelled: 'bg-red-500',
                                };

                                return (
                                    <div key={status}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-900 capitalize">
                                                {status.replace('_', ' ')}
                                            </span>
                                            <span className="text-sm font-bold text-gray-900">{count} ({percentage.toFixed(1)}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${colors[status]}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Category Performance */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Delivered Orders</p>
                                    <p className="text-2xl font-bold text-green-600">{deliveredOrders}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Success Rate</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : 0}%
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Cancelled Orders</p>
                                    <p className="text-2xl font-bold text-red-600">{cancelledOrders}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Cancellation Rate</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : 0}%
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                                    <p className="text-2xl font-bold text-blue-600">{ordersByStatus.pending}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Avg Order Value</p>
                                    <p className="text-lg font-bold text-blue-600">AED {averageOrderValue.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminReports;
