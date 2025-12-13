import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, BarChart3, Package, ShoppingCart, Users, Settings, Home } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/admin/login');
    };

    const menuItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
        { path: '/admin/inventory', label: 'Products & Inventory', icon: Package },
        { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { path: '/admin/customers', label: 'Customers', icon: Users },
        { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-lg">
                            Z
                        </div>
                        {sidebarOpen && <span className="font-bold text-xl">Zahrat</span>}
                    </div>
                </div>

                {/* Menu */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        // Handle both /admin/inventory and /admin/products for the unified page
                        const isActive = location.pathname === item.path ||
                            (item.path === '/admin/inventory' && location.pathname === '/admin/products');
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800'
                                    }`}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 space-y-2">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        {sidebarOpen ? (
                            <>
                                <X className="w-5 h-5" />
                                <span className="text-sm">Collapse</span>
                            </>
                        ) : (
                            <Menu className="w-5 h-5 mx-auto" />
                        )}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span className="text-sm">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                        <p className="text-sm text-gray-500">Welcome, {admin.name || 'Admin'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                            <p className="text-xs text-gray-500">@{admin.username}</p>
                        </div>
                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {admin.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
