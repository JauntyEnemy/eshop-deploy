<?php

use App\Controllers\ProductController;
use App\Controllers\OrderController;
use App\Controllers\DeliveryController;
use App\Controllers\AdminController;
use App\Controllers\UploadController;
use App\Controllers\CategoryController;
use App\Middleware\AuthMiddleware;
use Slim\Routing\RouteCollectorProxy;

// Public routes
$app->get('/', function ($request, $response) {
    $response->getBody()->write(json_encode([
        "success" => true,
        "message" => "Zahrat Alrabie E-commerce API",
        "version" => "1.0.0"
    ]));
    return $response->withHeader('Content-Type', 'application/json');
});

// Admin authentication routes
$app->post('/api/admin/login', [AdminController::class, 'login']);

// Upload route (protected)
$app->post('/api/admin/upload', [UploadController::class, 'uploadImage'])
    ->add(AuthMiddleware::class);

// Product routes (public)
$app->group('/api/products', function (RouteCollectorProxy $group) {
    $group->get('', [ProductController::class, 'index']);
    $group->get('/{id}', [ProductController::class, 'show']);
});

// Category routes (public)
$app->get('/api/categories', [CategoryController::class, 'index']);

// Delivery routes (public)
$app->group('/api/delivery', function (RouteCollectorProxy $group) {
    $group->get('/zones', [DeliveryController::class, 'index']);
    $group->get('/zones/{id}', [DeliveryController::class, 'show']);
    $group->get('/slots', [DeliveryController::class, 'getSlots']);
});

// Order routes (public for creating and tracking)
$app->group('/api/orders', function (RouteCollectorProxy $group) {
    $group->post('', [OrderController::class, 'store']);
    $group->get('/track/{trackingCode}', [OrderController::class, 'trackOrder']);
});

// Protected admin routes
$app->group('/api/admin', function (RouteCollectorProxy $group) {
    // Admin info
    $group->get('/me', [AdminController::class, 'me']);
    $group->get('/dashboard', [AdminController::class, 'dashboard']);

    // Product management
    $group->post('/products', [ProductController::class, 'store']);
    $group->put('/products/{id}', [ProductController::class, 'update']);
    $group->delete('/products/{id}', [ProductController::class, 'delete']);

    // Category management
    $group->post('/categories', [CategoryController::class, 'store']);

    // Order management
    $group->get('/orders', [OrderController::class, 'index']);
    $group->get('/orders/{id}', [OrderController::class, 'show']);
    $group->patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    $group->delete('/orders/{id}', [OrderController::class, 'delete']);

    // Delivery zone management
    $group->post('/delivery-zones', [DeliveryController::class, 'store']);
    $group->put('/delivery-zones/{id}', [DeliveryController::class, 'update']);
    $group->delete('/delivery-zones/{id}', [DeliveryController::class, 'delete']);

})->add(AuthMiddleware::class);

// Handle OPTIONS requests for CORS
$app->options('/{routes:.+}', function ($request, $response) {
    return $response;
});
