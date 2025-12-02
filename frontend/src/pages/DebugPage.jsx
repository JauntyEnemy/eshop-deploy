import React from 'react';

const DebugPage = () => {
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('admin');

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', backgroundColor: '#f0f0f0', margin: '20px' }}>
            <h1>LocalStorage Debug</h1>
            <p><strong>adminToken:</strong> {token ? '✓ EXISTS' : '✗ MISSING'}</p>
            <p><strong>Token Value:</strong> {token || 'null'}</p>
            <hr />
            <p><strong>admin:</strong> {admin ? '✓ EXISTS' : '✗ MISSING'}</p>
            <p><strong>Admin Data:</strong> {admin || 'null'}</p>
            <hr />
            <p><button onClick={() => window.location.href = '/admin/login'}>Go to Login</button></p>
            <p><button onClick={() => window.location.href = '/admin/dashboard'}>Try Dashboard</button></p>
        </div>
    );
};

export default DebugPage;
