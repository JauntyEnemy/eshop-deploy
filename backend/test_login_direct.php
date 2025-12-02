<?php
/**
 * Direct Login Test - Simulates what the API does
 */

require __DIR__ . '/../vendor/autoload.php';

// Load config
$settings = require __DIR__ . '/../config/settings.php';
$dbConfig = require __DIR__ . '/../config/database.php';

// Create PDO connection
$config = $dbConfig['database'];
$dsn = "{$config['driver']}:host={$config['host']};port={$config['port']};dbname={$config['database']};charset={$config['charset']}";

try {
    $pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);
    echo "✓ Database connected\n\n";
} catch (Exception $e) {
    echo "✗ Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Simulate login request
echo "===========================================\n";
echo "SIMULATING ADMIN LOGIN REQUEST\n";
echo "===========================================\n\n";

$loginData = [
    'username' => 'admin',
    'password' => 'password123'
];

echo "Credentials:\n";
echo "  Username: " . $loginData['username'] . "\n";
echo "  Password: " . $loginData['password'] . "\n\n";

// Step 1: Check if admin exists
echo "Step 1: Checking if admin exists...\n";
$stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :username");
$stmt->execute([':username' => $loginData['username']]);
$admin = $stmt->fetch();

if (!$admin) {
    echo "✗ Admin not found!\n";
    echo "\nCreating admin user...\n";
    $hash = password_hash('password123', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO admins (username, name, password) VALUES (?, ?, ?)");
    $stmt->execute(['admin', 'Administrator', $hash]);
    echo "✓ Admin created!\n\n";
    
    // Fetch again
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :username");
    $stmt->execute([':username' => $loginData['username']]);
    $admin = $stmt->fetch();
}

echo "✓ Admin found!\n";
echo "  ID: " . $admin['id'] . "\n";
echo "  Username: " . $admin['username'] . "\n";
echo "  Password Hash Length: " . strlen($admin['password']) . "\n\n";

// Step 2: Verify password
echo "Step 2: Verifying password...\n";
echo "  Plain password: " . $loginData['password'] . "\n";
echo "  Stored hash: " . substr($admin['password'], 0, 30) . "...\n";

$passwordVerifies = password_verify($loginData['password'], $admin['password']);
echo "  Verification result: " . ($passwordVerifies ? "PASS ✓" : "FAIL ✗") . "\n\n";

if ($passwordVerifies) {
    echo "===========================================\n";
    echo "LOGIN WOULD SUCCEED ✓\n";
    echo "===========================================\n\n";
    
    // Step 3: Generate token
    echo "Step 3: Generating JWT Token...\n";
    
    // Load auth service
    $authService = new \App\Services\AuthService($settings['settings']);
    
    $payload = [
        'id' => $admin['id'],
        'username' => $admin['username'],
        'role' => 'admin',
    ];
    
    $token = $authService->generateToken($payload);
    echo "✓ Token generated!\n";
    echo "  Token (first 50 chars): " . substr($token, 0, 50) . "...\n\n";
    
    echo "Response that would be sent:\n";
    $response = [
        'success' => true,
        'message' => 'Login successful',
        'data' => [
            'token' => $token,
            'admin' => [
                'id' => $admin['id'],
                'username' => $admin['username'],
                'name' => $admin['name'],
            ],
        ],
    ];
    echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n\n";
    
} else {
    echo "===========================================\n";
    echo "LOGIN WOULD FAIL ✗\n";
    echo "===========================================\n\n";
    
    echo "FIXING PASSWORD...\n";
    $newHash = password_hash('password123', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE admins SET password = ? WHERE id = ?");
    $stmt->execute([$newHash, $admin['id']]);
    echo "✓ Password updated!\n\n";
    
    // Verify the fix
    $stmt = $pdo->prepare("SELECT password FROM admins WHERE id = ?");
    $stmt->execute([$admin['id']]);
    $updated = $stmt->fetch();
    
    if (password_verify('password123', $updated['password'])) {
        echo "✓ New password verification: PASS\n";
        echo "Try logging in again now!\n";
    } else {
        echo "✗ Password still not working. There may be a deeper issue.\n";
    }
}

?>
