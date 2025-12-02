<?php

use Slim\Factory\AppFactory;
use DI\Container;

require __DIR__ . '/../vendor/autoload.php';

// Load configuration
$settings = require __DIR__ . '/../config/settings.php';
$dbConfig = require __DIR__ . '/../config/database.php';

// Create container
$container = new Container();
AppFactory::setContainer($container);

// Add settings to container
$container->set('settings', $settings['settings']);

// Database connection
$container->set(PDO::class, function () use ($dbConfig) {
    $config = $dbConfig['database'];
    $dsn = "{$config['driver']}:host={$config['host']};port={$config['port']};dbname={$config['database']};charset={$config['charset']}";

    return new PDO($dsn, $config['username'], $config['password'], $config['options']);
});

// Services
$container->set(App\Services\AuthService::class, function ($c) {
    return new App\Services\AuthService($c->get('settings'));
});

$container->set(App\Services\SMSService::class, function ($c) {
    return new App\Services\SMSService($c->get('settings'));
});

// Models
$container->set(App\Models\Product::class, function ($c) {
    return new App\Models\Product($c->get(PDO::class));
});

$container->set(App\Models\Order::class, function ($c) {
    return new App\Models\Order($c->get(PDO::class));
});

$container->set(App\Models\DeliveryZone::class, function ($c) {
    return new App\Models\DeliveryZone($c->get(PDO::class));
});

// Controllers
$container->set(App\Controllers\ProductController::class, function ($c) {
    return new App\Controllers\ProductController($c->get(App\Models\Product::class));
});

$container->set(App\Controllers\OrderController::class, function ($c) {
    return new App\Controllers\OrderController(
        $c->get(App\Models\Order::class),
        $c->get(App\Services\SMSService::class)
    );
});

$container->set(App\Controllers\DeliveryController::class, function ($c) {
    return new App\Controllers\DeliveryController($c->get(App\Models\DeliveryZone::class));
});

$container->set(App\Controllers\AdminController::class, function ($c) {
    return new App\Controllers\AdminController(
        $c->get(App\Services\AuthService::class),
        $c->get(PDO::class)
    );
});

// Middleware
$container->set(App\Middleware\AuthMiddleware::class, function ($c) {
    return new App\Middleware\AuthMiddleware($c->get(App\Services\AuthService::class));
});

$container->set(App\Middleware\CorsMiddleware::class, function ($c) {
    return new App\Middleware\CorsMiddleware($c->get('settings'));
});

// Create app
$app = AppFactory::create();

// Add error middleware FIRST
$errorMiddleware = $app->addErrorMiddleware(
    $settings['settings']['displayErrorDetails'],
    $settings['settings']['logErrors'],
    $settings['settings']['logErrorDetails']
);

// Add routing middleware
$app->addRoutingMiddleware();

// Add JSON body parsing middleware
$app->addBodyParsingMiddleware();

// Add CORS middleware LAST
$app->add(App\Middleware\CorsMiddleware::class);

// Load routes
require __DIR__ . '/../src/routes/api.php';

return $app;
