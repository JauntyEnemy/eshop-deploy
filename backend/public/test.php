<?php
/**
 * Simple API Test Endpoint
 * Test this to see if the backend is responding at all
 */

echo json_encode([
    'success' => true,
    'message' => 'API is responding!',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
]);

?>
