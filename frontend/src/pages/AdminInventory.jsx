import React, { useState, useEffect } from 'react';
import { AlertCircle, Edit, Search, Trash2, X, Check } from 'lucide-react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminInventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [newStock, setNewStock] = useState('');
    const [editFormData, setEditFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: '',
        description: ''
    });
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [editingProductForImage, setEditingProductForImage] = useState(null);

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
            setError('Failed to load inventory');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStock = async (productId, quantity) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.put(
                `http://localhost:8000/api/admin/products/${productId}`,
                {
                    stock: parseInt(quantity),
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setProducts(products.map(p => p.id === productId ? response.data.data : p));
                setEditingId(null);
                setNewStock('');
            }
        } catch (err) {
            setError('Failed to update stock');
            console.error(err);
        }
    };

    const handleEditProduct = (product) => {
        setEditingId(product.id);
        setEditingProductForImage(product.id);
        setEditFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            category: product.category || '',
            description: product.description || ''
        });
        setImagePreview(product.image_url || null);
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
            const token = localStorage.getItem('adminToken');
            const formDataToSend = new FormData();
            formDataToSend.append('image', file);

            console.log('Uploading image:', file.name, 'Size:', file.size, 'Type:', file.type);
            console.log('Token:', token ? 'Present' : 'Missing');
            console.log('Editing product ID:', editingProductForImage);

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

            console.log('Upload response:', response.data);

            if (response.data.success) {
                const imageUrl = response.data.data.url;
                console.log('Image URL received:', imageUrl);
                
                // Update the products list with new image URL
                setProducts(products.map(p => 
                    p.id === editingProductForImage 
                        ? { ...p, image_url: imageUrl }
                        : p
                ));
                console.log('Image uploaded successfully:', imageUrl);
                setError('');
            } else {
                console.error('Upload failed:', response.data);
                setError('Upload failed: ' + (response.data.message || 'Unknown error'));
                setImagePreview(null);
            }
        } catch (err) {
            console.error('Upload error:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);
            setError('Failed to upload image: ' + (err.response?.data?.message || err.message));
            setImagePreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProduct = async (productId) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.put(
                `http://localhost:8000/api/admin/products/${productId}`,
                {
                    name: editFormData.name,
                    price: parseFloat(editFormData.price),
                    stock: parseInt(editFormData.stock),
                    category: editFormData.category,
                    description: editFormData.description
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setProducts(products.map(p => p.id === productId ? response.data.data : p));
                setEditingId(null);
                setError('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update product');
            console.error(err);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(
                `http://localhost:8000/api/admin/products/${productId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setProducts(products.filter(p => p.id !== productId));
            setError('');
        } catch (err) {
            setError('Failed to delete product');
            console.error(err);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockProducts = filteredProducts.filter(p => p.stock <= 10);
    const outOfStock = filteredProducts.filter(p => p.stock === 0);
    const adequateStock = filteredProducts.filter(p => p.stock > 10);

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-500">Loading inventory...</p>
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
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Inventory Management</h2>
                    <p className="text-gray-600">Monitor and update product stock levels</p>
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
                        value={outOfStock.length}
                        color="bg-red-500"
                    />
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

                {/* Out of Stock Products */}
                {outOfStock.length > 0 && (
                    <div className="bg-white rounded-xl border border-red-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            Out of Stock Products ({outOfStock.length})
                        </h3>

                        <div className="space-y-2">
                            {outOfStock.map(product => (
                                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-xs text-gray-600">Category: {product.category || '-'}</p>
                                    </div>
                                    <button
                                        onClick={() => setEditingId(product.id)}
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Low Stock Products */}
                {lowStockProducts.length > 0 && (
                    <div className="bg-white rounded-xl border border-yellow-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-500" />
                            Low Stock Products ({lowStockProducts.length})
                        </h3>

                        <div className="space-y-2">
                            {lowStockProducts.map(product => (
                                <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-yellow-500 h-2 rounded-full"
                                                style={{ width: `${(product.stock / 20) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1">{product.stock} units left</p>
                                    </div>
                                    <button
                                        onClick={() => setEditingId(product.id)}
                                        className="ml-4 p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Products Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Product</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Current Stock</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{product.name}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{product.category || '-'}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900">
                                                AED {parseFloat(product.price).toFixed(2)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm font-medium">{product.stock} units</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                                    product.stock === 0 ? 'bg-red-100 text-red-800' :
                                                    product.stock <= 10 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {product.stock === 0 ? 'Out of Stock' :
                                                     product.stock <= 10 ? 'Low Stock' :
                                                     'In Stock'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditProduct(product)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                        title="Edit product"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        title="Delete product"
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
                                            No products found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Modal */}
                {editingId && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Edit Product</h3>
                                <button
                                    onClick={() => {
                                        setEditingId(null);
                                        setImagePreview(null);
                                        setEditingProductForImage(null);
                                    }}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                {/* Price & Stock */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editFormData.price}
                                            onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                        <input
                                            type="number"
                                            value={editFormData.stock}
                                            onChange={(e) => setEditFormData({...editFormData, stock: e.target.value})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>

                                {/* Category & Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <input
                                        type="text"
                                        value={editFormData.category}
                                        onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={editFormData.description}
                                        onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                                        rows="2"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                                    <div className="space-y-2">
                                        {imagePreview && (
                                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-primary-200">
                                                <img
                                                    src={imagePreview.startsWith('http') ? imagePreview : 'http://localhost:8000' + imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        console.error('Image preview failed to load:', e.target.src);
                                                        e.target.style.display = 'none';
                                                    }}
                                                    onLoad={() => {
                                                        console.log('Image preview loaded successfully');
                                                    }}
                                                />
                                            </div>
                                        )}
                                        <label className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                                className="hidden"
                                            />
                                            <span className="text-sm text-gray-600">
                                                {uploading ? '⏳ Uploading...' : '📁 Click to upload new image'}
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 justify-end pt-4">
                                    <button
                                        onClick={() => {
                                            setEditingId(null);
                                            setImagePreview(null);
                                            setEditingProductForImage(null);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleSaveProduct(editingId)}
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminInventory;
