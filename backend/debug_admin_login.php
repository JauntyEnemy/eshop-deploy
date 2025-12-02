<?php
/**
 * Complete Admin Login Debug & Fix Script
 */

echo "\n";
echo "╔════════════════════════════════════════════════════════════╗\n";
echo "║        ADMIN LOGIN DEBUGGING & FIXING SCRIPT               ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n\n";

// Step 1: Test PHP environment
echo "STEP 1: Checking PHP Environment\n";
echo "───────────────────────────────────────────────────────────\n";
echo "PHP Version: " . phpversion() . "\n";
echo "bcrypt support: " . (function_exists('password_hash') ? 'YES ✓' : 'NO ✗') . "\n";
echo "PDO MySQL: " . (extension_loaded('pdo_mysql') ? 'YES ✓' : 'NO ✗') . "\n\n";

// Step 2: Test database connection
echo "STEP 2: Testing Database Connection\n";
echo "───────────────────────────────────────────────────────────\n";

try {
    $dsn = "mysql:host=localhost;port=3306;dbname=zahrat_alrabie;charset=utf8mb4";
    $pdo = new PDO($dsn, 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    
    echo "✓ Database connection successful!\n";
    echo "Database: zahrat_alrabie\n";
    echo "Host: localhost\n";
    echo "Port: 3306\n\n";
    
} catch (Exception $e) {
    echo "✗ Database connection failed!\n";
    echo "Error: " . $e->getMessage() . "\n\n";
    die("Cannot continue without database connection.\n");
}

// Step 3: Check admin exists
echo "STEP 3: Checking Admin User in Database\n";
echo "───────────────────────────────────────────────────────────\n";

$stmt = $pdo->query("SELECT id, username, name, password FROM admins WHERE username = 'admin'");
$admin = $stmt->fetch();

if (!$admin) {
    echo "✗ Admin user not found! Creating admin...\n";
    
    $password = 'password123';
    $hash = password_hash($password, PASSWORD_BCRYPT);
    
    $stmt = $pdo->prepare("INSERT INTO admins (username, name, password) VALUES (?, ?, ?)");
    $stmt->execute(['admin', 'Super Admin', $hash]);
    
    echo "✓ Admin user created!\n";
    $admin = ['id' => $pdo->lastInsertId(), 'username' => 'admin', 'name' => 'Super Admin', 'password' => $hash];
} else {
    echo "✓ Admin user found!\n";
}

echo "  ID: " . $admin['id'] . "\n";
echo "  Username: " . $admin['username'] . "\n";
echo "  Name: " . ($admin['name'] ?? 'N/A') . "\n";
echo "  Password Hash: " . substr($admin['password'], 0, 20) . "...\n\n";

// Step 4: Test password hash
echo "STEP 4: Testing Password Hash\n";
echo "───────────────────────────────────────────────────────────\n";

$testPassword = 'password123';
$hashVerifies = password_verify($testPassword, $admin['password']);

echo "Test Password: " . $testPassword . "\n";
echo "Hash Verification: " . ($hashVerifies ? 'PASS ✓' : 'FAIL ✗') . "\n";

if (!$hashVerifies) {
    echo "\n⚠ Password hash mismatch! Regenerating hash...\n";
    $newHash = password_hash($testPassword, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE admins SET password = ? WHERE id = ?");
    $stmt->execute([$newHash, $admin['id']]);
    echo "✓ Password hash updated!\n";
}
echo "\n";

// Step 5: Simulate login request
echo "STEP 5: Simulating Login Request\n";
echo "───────────────────────────────────────────────────────────\n";

// Simulate what the login controller does
$loginData = [
    'username' => 'admin',
    'password' => 'password123'
];

echo "Login Credentials:\n";
echo "  Username: " . $loginData['username'] . "\n";
echo "  Password: " . $loginData['password'] . "\n\n";

// Query admin
$stmt = $pdo->prepare("SELECT id, username, password FROM admins WHERE username = ?");
$stmt->execute([$loginData['username']]);
$dbAdmin = $stmt->fetch();

if (!$dbAdmin) {
    echo "✗ Admin not found in database!\n";
} else {
    echo "✓ Admin found in database\n";
    
    // Verify password
    if (password_verify($loginData['password'], $dbAdmin['password'])) {
        echo "✓ Password verification PASSED!\n";
        echo "✓ Login would be SUCCESSFUL!\n";
    } else {
        echo "✗ Password verification FAILED!\n";
        echo "✗ Login would FAIL!\n";
    }
}

echo "\n";

// Step 6: Summary & Credentials
echo "STEP 6: Summary & Test Credentials\n";
echo "───────────────────────────────────────────────────────────\n";
echo "✓ All checks completed!\n\n";
echo "Use these credentials to login:\n";
echo "  Username: admin\n";
echo "  Password: password123\n";
echo "  URL: http://localhost:5173/admin/login\n";
echo "\n";
echo "If login still fails:\n";
echo "1. Restart the PHP server (Ctrl+C, then 'php -S localhost:8000')\n";
echo "2. Clear browser cache (Ctrl+Shift+Delete)\n";
echo "3. Try again\n\n";

?>
