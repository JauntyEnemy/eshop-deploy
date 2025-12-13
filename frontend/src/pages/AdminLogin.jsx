import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/admin/login', formData);

            console.log('Login Response:', response.data);
            console.log('Response Success:', response.data.success);
            console.log('Response Data:', response.data.data);

            if (response.data.success && response.data.data && response.data.data.token) {
                // Save token to localStorage
                localStorage.setItem('adminToken', response.data.data.token);
                localStorage.setItem('admin', JSON.stringify(response.data.data.admin));

                console.log('Token saved to localStorage');
                console.log('adminToken:', localStorage.getItem('adminToken'));
                console.log('admin:', localStorage.getItem('admin'));

                // Use a small delay to ensure localStorage is written
                setTimeout(() => {
                    console.log('Redirecting...');
                    const role = response.data.data.admin.role;
                    if (role === 2 || role === 3) {
                        navigate('/admin/orders', { replace: true });
                    } else {
                        navigate('/admin/dashboard', { replace: true });
                    }
                }, 100);
            } else {
                console.log('Response data structure invalid:', response.data);
                setError(response.data.message || 'Login failed - Invalid response');
            }
        } catch (err) {
            console.error('Login Error:', err);
            console.error('Error Response:', err.response?.data);
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-lg mb-4">
                        <span className="font-bold text-2xl text-primary-600">Z</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Zahrat Alrabie</h1>
                    <p className="text-primary-100">Admin Panel</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</h2>

                    {error && (
                        <div className="mb-6 flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                disabled={loading}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                                autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                disabled={loading}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Hint */}
                        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                            <p className="font-medium text-blue-900 mb-1">Demo Credentials:</p>
                            <p>Username: <code className="bg-white px-2 py-1 rounded">admin</code></p>
                            <p>Password: <code className="bg-white px-2 py-1 rounded">password123</code></p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-2 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <LogIn className="w-4 h-4" />
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        © 2025 Zahrat Alrabie. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
