<?php

return [
    'settings' => [
        'displayErrorDetails' => true, // Set to false in production
        'logErrors' => true,
        'logErrorDetails' => true,

        // App settings
        'app' => [
            'name' => 'Zahrat Alrabie E-commerce API',
            'version' => '1.0.0',
            'timezone' => 'Asia/Baghdad',
        ],

        // CORS settings
        'cors' => [
            'origin' => ['http://localhost:3000', 'http://localhost:5173'], // React dev servers
            'methods' => ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            'headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
            'credentials' => true,
        ],

        // JWT settings
        'jwt' => [
            'secret' => 'your-secret-key-change-this-in-production',
            'algorithm' => 'HS256',
            'expiration' => 86400, // 24 hours
        ],

        // SMS settings
        'sms' => [
            'provider' => 'twilio', // or your preferred SMS provider
            'api_key' => '',
            'api_secret' => '',
            'from_number' => '',
        ],
    ],
];
