<?php

require __DIR__ . '/../vendor/autoload.php';

// Load config
$dbConfig = require __DIR__ . '/../config/database.php';

// Connect to database
$config = $dbConfig['database'];
$dsn = "{$config['driver']}:host={$config['host']};port={$config['port']};dbname={$config['database']};charset={$config['charset']}";
$pdo = new PDO($dsn, $config['username'], $config['password'], $config['options']);

// Check current admins
echo "=== Current Admins in Database ===\n\n";
$stmt = $pdo->query("SELECT id, username, password FROM admins");
$admins = $stmt->fetchAll();

if (empty($admins)) {
    echo "No admins found!\n\n";
} else {
    foreach ($admins as $admin) {
        echo "ID: {$admin['id']}\n";
        echo "Username: {$admin['username']}\n";
        echo "Password Hash: {$admin['password']}\n";
        echo "---\n";
    }
}

// Hash password for testing
$testPassword = 'password123';
$hashedPassword = password_hash($testPassword, PASSWORD_BCRYPT);

echo "\n=== Test Password Hash ===\n";
echo "Plain Password: {$testPassword}\n";
echo "Hashed: {$hashedPassword}\n";
echo "Verify Result: " . (password_verify($testPassword, $hashedPassword) ? 'PASS' : 'FAIL') . "\n\n";

// Update admin with correct password
echo "=== Updating Admin Password ===\n";
$stmt = $pdo->prepare("UPDATE admins SET password = :password WHERE username = :username");
$result = $stmt->execute([
    ':username' => 'admin',
    ':password' => $hashedPassword
]);

if ($result) {
    echo "✓ Admin password updated successfully!\n";
    echo "Username: admin\n";
    echo "Password: password123\n";
} else {
    echo "✗ Failed to update password\n";
}

echo "\n=== Verify Updated Password ===\n";
$stmt = $pdo->prepare("SELECT id, username, password FROM admins WHERE username = :username");
$stmt->execute([':username' => 'admin']);
$admin = $stmt->fetch();

if ($admin) {
    echo "Username: {$admin['username']}\n";
    echo "Verify Password: " . (password_verify('password123', $admin['password']) ? 'PASS ✓' : 'FAIL ✗') . "\n";
} else {
    echo "Admin not found!\n";
}

?>
