import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminCustomers = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:8000/api/admin/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setOrders(response.data.data || []);
            }
        } catch (err) {
            setError('Failed to load customers');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Extract unique customers from orders
    const customers = Array.from(
        new Map(orders.map(order => [
            order.customer_phone,
            {
                name: order.customer_name,
                phone: order.customer_phone,
                address: order.customer_address,
                totalOrders: orders.filter(o => o.customer_phone === order.customer_phone).length,
                totalSpent: orders
                    .filter(o => o.customer_phone === order.customer_phone)
                    .reduce((sum, o) => sum + parseFloat(o.total || 0), 0),
                lastOrder: orders
                    .filter(o => o.customer_phone === order.customer_phone)
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]?.created_at,
            }
        ])).values()
    );

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-500">Loading customers...</p>
                </div>
            </AdminLayout>
        );
    }

    const StatCard = ({ label, value, icon: Icon }) => (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-600 text-sm mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600" />
                </div>
            </div>
        </div>
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Customers</h2>
                    <p className="text-gray-600">Manage and view customer information</p>
                </div>

                {error && (
                    <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        label="Total Customers"
                        value={customers.length}
                        icon={Mail}
                    />
                    <StatCard
                        label="Total Orders"
                        value={orders.length}
                        icon={Phone}
                    />
                    <StatCard
                        label="Total Revenue"
                        value={`AED ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}`}
                        icon={MapPin}
                    />
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search customers by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>

                {/* Customers Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Phone</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total Orders</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total Spent</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Last Order</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map((customer, index) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{customer.name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{customer.phone}</td>
                                            <td className="py-3 px-4">
                                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                    {customer.totalOrders}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                AED {customer.totalSpent.toFixed(2)}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">
                                                {customer.lastOrder 
                                                    ? new Date(customer.lastOrder).toLocaleDateString()
                                                    : '-'
                                                }
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                                                {customer.address}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-gray-500">
                                            {searchTerm ? 'No customers found' : 'No customers yet'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Customer Segments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Customers */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Top Customers</h3>
                        <div className="space-y-3">
                            {customers
                                .sort((a, b) => b.totalSpent - a.totalSpent)
                                .slice(0, 5)
                                .map((customer, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{customer.name}</p>
                                            <p className="text-xs text-gray-600">{customer.totalOrders} orders</p>
                                        </div>
                                        <p className="font-bold text-primary-600">AED {customer.totalSpent.toFixed(2)}</p>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Recent Customers */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Customers</h3>
                        <div className="space-y-3">
                            {customers
                                .sort((a, b) => new Date(b.lastOrder) - new Date(a.lastOrder))
                                .slice(0, 5)
                                .map((customer, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">{customer.name}</p>
                                            <p className="text-xs text-gray-600">
                                                {customer.lastOrder 
                                                    ? new Date(customer.lastOrder).toLocaleDateString()
                                                    : 'No orders'
                                                }
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-600">{customer.phone}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCustomers;
