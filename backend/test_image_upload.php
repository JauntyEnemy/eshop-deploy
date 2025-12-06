<?php
/**
 * Test Image Upload Functionality
 */

// Create a test image
$testImagePath = __DIR__ . '/test_image.png';

// Create a simple 1x1 PNG (smallest valid PNG)
$png = base64_decode(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
);

file_put_contents($testImagePath, $png);

// Generate fresh token
require __DIR__ . '/vendor/autoload.php';
$settings = require __DIR__ . '/config/settings.php';
use App\Services\AuthService;
$authService = new AuthService($settings['settings']);
$token = $authService->generateToken(['admin_id' => 1, 'username' => 'admin']);

echo "Using token: " . substr($token, 0, 50) . "...\n\n";

$ch = curl_init('http://localhost:8000/api/admin/upload');

$cfile = curl_file_create($testImagePath, 'image/png', 'test_image.png');

curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, array('image' => $cfile));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

echo "HTTP Status Code: $http_code\n";
echo "Response: $response\n\n";

// Cleanup
curl_close($ch);
unlink($testImagePath);

echo "Test complete!\n";
?>
