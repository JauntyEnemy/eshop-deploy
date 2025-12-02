<?php
/**
 * Test Dashboard API with Token
 */

echo "Testing Dashboard API Endpoint\n";
echo "════════════════════════════════════════════════\n\n";

// Step 1: Login to get token
echo "Step 1: Getting admin token...\n";
$ch = curl_init('http://localhost:8000/api/admin/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'username' => 'admin',
    'password' => 'password123'
]));

$loginResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo "✗ Login failed with status code: $httpCode\n";
    exit(1);
}

$loginData = json_decode($loginResponse, true);
if (!isset($loginData['data']['token'])) {
    echo "✗ No token in response!\n";
    print_r($loginData);
    exit(1);
}

$token = $loginData['data']['token'];
echo "✓ Token received: " . substr($token, 0, 30) . "...\n\n";

// Step 2: Call dashboard API with token
echo "Step 2: Calling dashboard API with Bearer token...\n";
$ch = curl_init('http://localhost:8000/api/admin/dashboard');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $token
]);

$dashboardResponse = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Status Code: $httpCode\n\n";

echo "Response:\n";
echo $dashboardResponse . "\n\n";

if ($dashboardResponse) {
    $data = json_decode($dashboardResponse, true);
    echo "Parsed Response:\n";
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
}

?>
