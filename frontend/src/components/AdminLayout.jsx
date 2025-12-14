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
        { path: '/admin/dashboard', label: 'Dashboard', icon: Home, roles: [1] },
        { path: '/admin/inventory', label: 'Products & Inventory', icon: Package, roles: [1] },
        { path: '/admin/orders', label: 'Orders', icon: ShoppingCart, roles: [1, 2, 3] },
        { path: '/admin/customers', label: 'Customers', icon: Users, roles: [1] },
        { path: '/admin/reports', label: 'Reports', icon: BarChart3, roles: [1] },
    ];

    let role = admin.role;
    // Normalize role for legacy sessions
    if (role === 'admin') role = 1;
    if (role === 'seller') role = 2;
    role = role || 1;
    const filteredMenuItems = menuItems.filter(item => item.roles.includes(role));


    return (
        <div className="flex h-screen bg-gray-100 print:hidden relative">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'
                    } fixed md:static inset-y-0 left-0 z-50 bg-gray-900 text-white transition-all duration-300 flex flex-col h-full`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <div className={`flex items-center gap-3 ${!sidebarOpen && 'md:justify-center w-full'}`}>
                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-lg shrink-0">
                            Z
                        </div>
                        {sidebarOpen && <span className="font-bold text-xl">Zahrat</span>}
                    </div>
                    {/* Cloud Close Button (Mobile Only) */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden text-gray-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path ||
                            (item.path === '/admin/inventory' && location.pathname === '/admin/products');
                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    if (window.innerWidth < 768) setSidebarOpen(false);
                                }}
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
                        className="hidden md:flex w-full items-center gap-3 px-4 py-2 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-gray-800 transition-colors"
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
                        <LogOut className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span className="text-sm">Logout</span>}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-lg md:text-2xl font-bold text-gray-900">Admin Panel</h1>
                            <p className="text-xs md:text-sm text-gray-500 hidden sm:block">Welcome, {admin.name || 'Admin'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                            <p className="text-xs text-gray-500">@{admin.username}</p>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
                            {admin.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-4 md:p-6 pb-20 md:pb-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
