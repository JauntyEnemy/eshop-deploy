<?php
require __DIR__ . '/vendor/autoload.php';

// Load config
$settings = require __DIR__ . '/config/settings.php';

use App\Services\AuthService;

$authService = new AuthService($settings['settings']);

// Create a fresh token
$token = $authService->generateToken([
    'admin_id' => 1,
    'username' => 'admin'
]);

echo "Fresh Token:\n";
echo $token . "\n";
?>
