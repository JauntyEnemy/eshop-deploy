import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, AlertCircle } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const DEFAULT_BRANDS = [
    'UAE', 'USA', 'India', 'Pakistan', 'Egypt',
    'Lebanon', 'Jordan', 'Oman', 'Saudi Arabia',
    'South Africa', 'Kenya', 'Philippines', 'Thailand'
];

const AdminInventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'low-stock', 'out-of-stock'
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        brand: '',
        stock: '',
        image_url: '',
    });
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [isCustomBrand, setIsCustomBrand] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products');
            if (response.data.success) {
                setProducts(response.data.data || []);
            }
        } catch (err) {
            setError('Failed to load products');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBrandChange = (e) => {
        const value = e.target.value;
        if (value === 'custom_new') {
            setIsCustomBrand(true);
            setFormData(prev => ({ ...prev, brand: '' }));
        } else {
            setIsCustomBrand(false);
            setFormData(prev => ({ ...prev, brand: value }));
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload to backend
        try {
            setUploading(true);
            setError('');
            const token = localStorage.getItem('adminToken');
            const formDataToSend = new FormData();
            formDataToSend.append('image', file);

            const response = await axios.post(
                'http://localhost:8000/api/admin/upload',
                formDataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                const imageUrl = response.data.data.url;
                setFormData(prev => ({
                    ...prev,
                    image_url: imageUrl
                }));
                setError('');
            } else {
                setError('Upload failed: ' + (response.data.message || 'Unknown error'));
                setImagePreview(null);
            }
        } catch (err) {
            setError('Failed to upload image: ' + (err.response?.data?.message || err.message));
            setImagePreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || formData.price === '' || formData.stock === '') {
            setError('Name, Price, and Stock are required');
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
            };

            if (editingProduct) {
                // Update product
                const response = await axios.put(
                    `http://localhost:8000/api/admin/products/${editingProduct.id}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    setProducts(products.map(p => p.id === editingProduct.id ? response.data.data : p));
                    setEditingProduct(null);
                    setShowForm(false);
                    resetForm();
                }
            } else {
                // Create product
                const response = await axios.post(
                    'http://localhost:8000/api/admin/products',
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.data.success) {
                    setProducts([...products, response.data.data]);
                    setShowForm(false);
                    resetForm();
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            brand: DEFAULT_BRANDS[0],
            stock: '',
            image_url: '',
        });
        setIsCustomBrand(false);
        setImagePreview(null);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);

        // If brand exists and is not in defaults, it's custom.
        const isCustom = product.brand && !DEFAULT_BRANDS.includes(product.brand);
        setIsCustomBrand(!!isCustom);

        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            category: product.category || '',
            brand: product.brand || DEFAULT_BRANDS[0],
            stock: product.stock,
            image_url: product.image_url || '',
        });
        setImagePreview(product.image_url || null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(
                `http://localhost:8000/api/admin/products/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            setError('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockProducts = filteredProducts.filter(p => p.stock > 0 && p.stock <= 10);
    const outOfStockProducts = filteredProducts.filter(p => p.stock === 0);

    const getDisplayProducts = () => {
        switch (activeTab) {
            case 'low-stock':
                return lowStockProducts;
            case 'out-of-stock':
                return outOfStockProducts;
            default:
                return filteredProducts;
        }
    };

    const displayProducts = getDisplayProducts();

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-500">Loading products...</p>
                </div>
            </AdminLayout>
        );
    }

    const StatCard = ({ label, value, color }) => (
        <div className={`${color} rounded-xl p-6 text-white`}>
            <p className="text-sm opacity-90 mb-1">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Products & Inventory</h2>
                        <p className="text-gray-600">Manage your product catalog and stock levels</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            resetForm();
                            setShowForm(true);
                        }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </button>
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
                        label="Total Products"
                        value={products.length}
                        color="bg-blue-500"
                    />
                    <StatCard
                        label="Low Stock"
                        value={lowStockProducts.length}
                        color="bg-yellow-500"
                    />
                    <StatCard
                        label="Out of Stock"
                        value={outOfStockProducts.length}
                        color="bg-red-500"
                    />
                </div>

                {/* Add/Edit Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingProduct(null);
                                        setImagePreview(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        placeholder="Fruits, Vegetables, etc."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand / Origin</label>
                                    {!isCustomBrand ? (
                                        <select
                                            name="brand"
                                            value={formData.brand}
                                            onChange={handleBrandChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                        >
                                            {DEFAULT_BRANDS.map(brand => (
                                                <option key={brand} value={brand}>{brand}</option>
                                            ))}
                                            <option value="custom_new">+ Create New Brand</option>
                                        </select>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleInputChange}
                                                placeholder="Enter brand name"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCustomBrand(false);
                                                    setFormData(prev => ({ ...prev, brand: DEFAULT_BRANDS[0] }));
                                                }}
                                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
                                                title="Back to list"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                                    <div className="space-y-3">
                                        {(imagePreview || formData.image_url) && (
                                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-primary-200">
                                                <img
                                                    src={
                                                        imagePreview
                                                            ? imagePreview.startsWith('data:')
                                                                ? imagePreview
                                                                : 'http://localhost:8000' + imagePreview
                                                            : formData.image_url
                                                                ? (formData.image_url.startsWith('http')
                                                                    ? formData.image_url
                                                                    : 'http://localhost:8000' + formData.image_url)
                                                                : ''
                                                    }
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2">
                                            <label className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    disabled={uploading}
                                                    className="hidden"
                                                />
                                                <span className="text-sm text-gray-600">
                                                    {uploading ? '⏳ Uploading...' : '📁 Click to upload image'}
                                                </span>
                                            </label>
                                        </div>

                                        {!formData.image_url && (
                                            <div>
                                                <p className="text-xs text-gray-500 mb-2">Or paste image URL:</p>
                                                <input
                                                    type="text"
                                                    name="image_url"
                                                    value={formData.image_url}
                                                    onChange={handleInputChange}
                                                    placeholder="https://..."
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                />
                                            </div>
                                        )}

                                        {formData.image_url && (
                                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                                <p className="text-xs text-green-600 font-medium mb-1">✓ Image uploaded:</p>
                                                <p className="text-xs text-gray-600 break-all font-mono">{formData.image_url}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="md:col-span-2 flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn-primary flex-1"
                                    >
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'all'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        All Products ({filteredProducts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('low-stock')}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'low-stock'
                            ? 'text-yellow-600 border-b-2 border-yellow-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Low Stock ({lowStockProducts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('out-of-stock')}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === 'out-of-stock'
                            ? 'text-red-600 border-b-2 border-red-600'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Out of Stock ({outOfStockProducts.length})
                    </button>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Product</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Brand</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Stock</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayProducts.length > 0 ? (
                                    displayProducts.map((product) => (
                                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    {product.image_url ? (
                                                        <div className="relative">
                                                            <img
                                                                src={product.image_url.startsWith('http') ? product.image_url : 'http://localhost:8000' + product.image_url}
                                                                alt={product.name}
                                                                className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextElementSibling && (e.target.nextElementSibling.style.display = 'flex');
                                                                }}
                                                            />
                                                            <div style={{ display: 'none' }} className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                                                                No image
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                                                            No image
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900">{product.name}</p>
                                                        <p className="text-xs text-gray-500">ID: {product.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{product.brand || '-'}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{product.category || '-'}</td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                AED {parseFloat(product.price).toFixed(2)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${product.stock > 20 ? 'bg-green-100 text-green-800' :
                                                    product.stock > 5 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {product.stock} left
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-gray-500">
                                            {searchTerm ? 'No products found' : 'No products yet. Create one to get started!'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout >
    );
};

export default AdminInventory;
