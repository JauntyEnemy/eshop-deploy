import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, AlertCircle, Users, Shield, Plus, Lock } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminCustomers = () => {
    // Tabs: 'customers' or 'staff'
    const [activeTab, setActiveTab] = useState('customers');

    // Customer Data
    const [orders, setOrders] = useState([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);

    // Staff Data
    const [staff, setStaff] = useState([]);
    const [loadingStaff, setLoadingStaff] = useState(false);
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [staffFormData, setStaffFormData] = useState({
        name: '',
        username: '',
        password: '',
        role: 2
    });

    // Common
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (activeTab === 'customers') fetchCustomers();
        else fetchStaff();
    }, [activeTab]);

    const fetchCustomers = async () => {
        setLoadingCustomers(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:8000/api/admin/orders', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setOrders(response.data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCustomers(false);
        }
    };

    const fetchStaff = async () => {
        setLoadingStaff(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get('http://localhost:8000/api/admin/staff', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setStaff(response.data.data || []);
            }
        } catch (err) {
            setError('Failed to load staff accounts');
            console.error(err);
        } finally {
            setLoadingStaff(false);
        }
    };

    const handleCreateStaff = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post('http://localhost:8000/api/admin/staff', {
                ...staffFormData,
                role: parseInt(staffFormData.role)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowStaffModal(false);
            setStaffFormData({ name: '', username: '', password: '', role: 2 });
            fetchStaff(); // Refresh list
            alert('Account created successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        }
    };

    // Extract unique customers from orders (Existing Logic)
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
                {/* Header & Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {activeTab === 'customers' ? 'Customers' : 'Staff Accounts'}
                        </h2>
                        <p className="text-gray-600">
                            {activeTab === 'customers' ? 'View store customers' : 'Manage admin and seller accounts'}
                        </p>
                    </div>
                    <div className="flex bg-gray-200 rounded-lg p-1 self-start md:self-auto">
                        <button
                            onClick={() => { setActiveTab('customers'); setSearchTerm(''); setError(''); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'customers' ? 'bg-white shadow text-primary-600' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Customers
                        </button>
                        <button
                            onClick={() => { setActiveTab('staff'); setSearchTerm(''); setError(''); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'staff' ? 'bg-white shadow text-primary-600' : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Staff Users
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {/* CUSTOMERS CONTENT */}
                {activeTab === 'customers' && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard label="Total Customers" value={customers.length} icon={Users} />
                            <StatCard label="Total Orders" value={orders.length} icon={Phone} />
                            <StatCard label="Total Revenue" value={`AED ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}`} icon={MapPin} />
                        </div>

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
                                                        {customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                                                        {customer.address}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="py-8 text-center text-gray-500">
                                                    {loadingCustomers ? 'Loading...' : (searchTerm ? 'No customers found' : 'No customers yet')}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* STAFF CONTENT */}
                {activeTab === 'staff' && (
                    <>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowStaffModal(true)}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Account
                            </button>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Name</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Username</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Role</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staff.length > 0 ? (
                                            staff.map(user => (
                                                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 font-medium text-gray-900">{user.name}</td>
                                                    <td className="py-3 px-4 text-gray-600">{user.username}</td>
                                                    <td className="py-3 px-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${user.role === 1 ? 'bg-purple-100 text-purple-700' :
                                                                user.role === 3 ? 'bg-indigo-100 text-indigo-700' :
                                                                    'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {{ 1: 'Admin', 2: 'Seller', 3: 'Driver' }[user.role] || 'Seller'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-500 text-sm">
                                                        {new Date(user.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center text-gray-500">
                                                    {loadingStaff ? 'Loading...' : 'No staff accounts found'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* CREATE STAFF MODAL */}
                {showStaffModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                            <h3 className="text-xl font-bold mb-4 text-gray-900">Create New Account</h3>
                            <form onSubmit={handleCreateStaff} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">Display Name</label>
                                    <input type="text" required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g. John Doe"
                                        value={staffFormData.name}
                                        onChange={e => setStaffFormData({ ...staffFormData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
                                    <input type="text" required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="e.g. seller1"
                                        value={staffFormData.username}
                                        onChange={e => setStaffFormData({ ...staffFormData, username: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                                    <input type="password" required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Min 6 characters"
                                        value={staffFormData.password}
                                        onChange={e => setStaffFormData({ ...staffFormData, password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                        value={staffFormData.role}
                                        onChange={e => setStaffFormData({ ...staffFormData, role: parseInt(e.target.value) })}
                                    >
                                        <option value={2}>Seller (Orders Only)</option>
                                        <option value={3}>Driver (Deliveries Only)</option>
                                        <option value={1}>Super Admin (Full Access)</option>
                                    </select>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setShowStaffModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="btn-primary">Create User</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminCustomers;
