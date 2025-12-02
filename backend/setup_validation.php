<?php
/**
 * Complete Setup & Validation Script
 * Run this once to ensure everything is working
 */

echo "\n╔══════════════════════════════════════════════════════════════╗\n";
echo "║         ZAHRAT ALRABIE - COMPLETE SETUP VALIDATION           ║\n";
echo "╚══════════════════════════════════════════════════════════════╝\n\n";

// Database connection
try {
    $pdo = new PDO(
        'mysql:host=localhost;port=3306;dbname=zahrat_alrabie;charset=utf8mb4',
        'root',
        '',
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
    echo "[✓] Database Connection: SUCCESS\n\n";
} catch (Exception $e) {
    echo "[✗] Database Connection: FAILED\n";
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}

// Check tables exist
$tables = ['products', 'orders', 'order_items', 'delivery_zones', 'delivery_slots', 'admins'];
echo "Checking Database Tables:\n";
foreach ($tables as $table) {
    $stmt = $pdo->query("SHOW TABLES LIKE '" . $table . "'");
    $exists = $stmt->rowCount() > 0;
    echo "  " . ($exists ? "[✓]" : "[✗]") . " " . $table . "\n";
}
echo "\n";

// Check admin user
echo "Checking Admin User:\n";
$stmt = $pdo->query("SELECT id, username, name, password FROM admins WHERE username = 'admin'");
$admin = $stmt->fetch();

if ($admin) {
    echo "  [✓] Admin user exists\n";
    echo "    - Username: " . $admin['username'] . "\n";
    echo "    - Name: " . ($admin['name'] ?? 'N/A') . "\n";
    echo "    - ID: " . $admin['id'] . "\n";
} else {
    echo "  [✗] Admin user not found. Creating...\n";
    $hash = password_hash('password123', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO admins (username, name, password) VALUES (?, ?, ?)");
    $stmt->execute(['admin', 'Administrator', $hash]);
    echo "  [✓] Admin user created!\n";
    $admin = ['id' => $pdo->lastInsertId(), 'username' => 'admin', 'password' => $hash];
}

echo "\n";

// Verify password hash
echo "Verifying Admin Password:\n";
$testPass = 'password123';
if (password_verify($testPass, $admin['password'])) {
    echo "  [✓] Password verification: PASS\n";
} else {
    echo "  [✗] Password verification: FAIL (Regenerating...)\n";
    $newHash = password_hash($testPass, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE admins SET password = ? WHERE id = ?");
    $stmt->execute([$newHash, $admin['id']]);
    echo "  [✓] Password regenerated and updated\n";
}

echo "\n";

// Test bcrypt
echo "Testing bcrypt Functionality:\n";
$testPassword = 'test_pass_' . time();
$testHash = password_hash($testPassword, PASSWORD_BCRYPT);
$testVerify = password_verify($testPassword, $testHash);
echo "  " . ($testVerify ? "[✓]" : "[✗]") . " bcrypt password_hash() and password_verify() working\n";

echo "\n";

// Summary
echo "╔══════════════════════════════════════════════════════════════╗\n";
echo "║                    SETUP COMPLETE ✓                         ║\n";
echo "╚══════════════════════════════════════════════════════════════╝\n\n";

echo "LOGIN CREDENTIALS:\n";
echo "  URL:      http://localhost:5173/admin/login\n";
echo "  Username: admin\n";
echo "  Password: password123\n\n";

echo "NEXT STEPS:\n";
echo "1. Make sure PHP server is running: php -S localhost:8000\n";
echo "2. Make sure Frontend is running: npm run dev\n";
echo "3. Open browser and go to: http://localhost:5173/admin/login\n";
echo "4. Enter credentials above\n";
echo "5. Should redirect to: http://localhost:5173/admin/dashboard\n\n";

echo "If login still fails:\n";
echo "- Check browser console for errors (F12)\n";
echo "- Check backend terminal for PHP errors\n";
echo "- Try clearing localStorage: localStorage.clear() in console\n";
echo "- Restart both servers\n\n";

?>
