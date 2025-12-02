import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    
    console.log('ProtectedAdminRoute: Checking token...');
    console.log('Token exists:', !!token);

    if (!token) {
        console.log('No token found, redirecting to login');
        return <Navigate to="/admin/login" replace />;
    }

    console.log('Token found, rendering children');
    return children;
};

export default ProtectedAdminRoute;
