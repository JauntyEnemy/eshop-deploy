<?php
/**
 * Test updating a product via PUT request
 */

// Simulate a PUT request with JSON body
$ch = curl_init('http://localhost:8000/api/admin/products/1');

$token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJaYWhyYXQgQWxyYWJpZSIsImF1ZCI6IkFkbWluIiwiaWF0IjoxNzMzMTAyMzk5LCJleHAiOjE3MzMxODg3OTksImRhdGEiOnsiYWRtaW5faWQiOjEsInVzZXJuYW1lIjoiYWRtaW4ifX0.xr0DdmJWLqhNnC1YxXLT9R0V7iVtx0jE9tRZdQF_huk';

$payload = json_encode([
    'name' => 'Test Product Updated',
    'description' => 'Test Description',
    'price' => 99.99,
    'category' => 'fruits',
    'stock' => 50,
    'image_url' => 'https://example.com/image.jpg'
]);

echo "Payload: $payload\n\n";

curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json',
    'Content-Length: ' . strlen($payload)
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

echo "HTTP Status Code: $http_code\n";
echo "Response: $response\n";

curl_close($ch);
?>
