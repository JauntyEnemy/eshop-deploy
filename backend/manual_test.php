<?php
/**
 * Manual Test Script - Tests login without going through Slim
 * This helps isolate whether the issue is in Slim or in our code
 */

echo "\n╔════════════════════════════════════════════════════════════╗\n";
echo "║              ADMIN LOGIN MANUAL TEST SCRIPT                 ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n\n";

// ===== STEP 1: Database Connection =====
echo "STEP 1: Testing Database Connection\n";
echo "─────────────────────────────────────────────────────────────\n";

try {
    $pdo = new PDO(
        'mysql:host=localhost;port=3306;dbname=zahrat_alrabie;charset=utf8mb4',
        'root',
        '',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
    echo "[✓] Database connected successfully\n\n";
} catch (Exception $e) {
    echo "[✗] Database connection failed!\n";
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}

// ===== STEP 2: Check Admin User =====
echo "STEP 2: Checking Admin User\n";
echo "─────────────────────────────────────────────────────────────\n";

$stmt = $pdo->query("SELECT id, username, name, password FROM admins WHERE username = 'admin'");
$admin = $stmt->fetch();

if ($admin) {
    echo "[✓] Admin user exists\n";
    echo "    ID: {$admin['id']}\n";
    echo "    Username: {$admin['username']}\n";
    echo "    Name: {$admin['name']}\n";
    echo "    Password Hash: " . substr($admin['password'], 0, 30) . "...\n";
} else {
    echo "[✗] Admin user does NOT exist!\n";
    echo "[*] Creating admin user...\n";
    
    $password = 'password123';
    $hash = password_hash($password, PASSWORD_BCRYPT);
    
    $stmt = $pdo->prepare("INSERT INTO admins (username, name, password) VALUES (?, ?, ?)");
    $result = $stmt->execute(['admin', 'Administrator', $hash]);
    
    if ($result) {
        $newId = $pdo->lastInsertId();
        echo "[✓] Admin user created!\n";
        echo "    ID: $newId\n";
        echo "    Username: admin\n";
        echo "    Password: password123\n";
        
        $admin = [
            'id' => $newId,
            'username' => 'admin',
            'name' => 'Administrator',
            'password' => $hash
        ];
    } else {
        echo "[✗] Failed to create admin user!\n";
        exit(1);
    }
}
echo "\n";

// ===== STEP 3: Test Password Verification =====
echo "STEP 3: Testing Password Verification\n";
echo "─────────────────────────────────────────────────────────────\n";

$testPassword = 'password123';
echo "Test Password: $testPassword\n";
echo "Stored Hash: " . substr($admin['password'], 0, 30) . "...\n";

$verifyResult = password_verify($testPassword, $admin['password']);
echo "Verification: " . ($verifyResult ? "[✓] PASS" : "[✗] FAIL") . "\n\n";

if (!$verifyResult) {
    echo "⚠️  PASSWORD VERIFICATION FAILED!\n";
    echo "[*] Regenerating password hash...\n";
    
    $newHash = password_hash($testPassword, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("UPDATE admins SET password = ? WHERE id = ?");
    $stmt->execute([$newHash, $admin['id']]);
    
    echo "[✓] Password updated!\n";
    echo "[*] Verifying new hash...\n";
    
    $verifyResult = password_verify($testPassword, $newHash);
    echo "New Verification: " . ($verifyResult ? "[✓] PASS" : "[✗] FAIL") . "\n";
}
echo "\n";

// ===== STEP 4: Database Query Test =====
echo "STEP 4: Testing Direct Database Query (what API does)\n";
echo "─────────────────────────────────────────────────────────────\n";

$username = 'admin';
$password = 'password123';

echo "Query: SELECT * FROM admins WHERE username = '$username'\n";
$stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :username");
$stmt->execute([':username' => $username]);
$dbAdmin = $stmt->fetch();

if ($dbAdmin) {
    echo "[✓] Admin found by query\n";
    
    $passwordMatches = password_verify($password, $dbAdmin['password']);
    echo "Password Check: " . ($passwordMatches ? "[✓] PASS" : "[✗] FAIL") . "\n";
    
    if ($passwordMatches) {
        echo "[✓] LOGIN WOULD SUCCEED\n";
    } else {
        echo "[✗] LOGIN WOULD FAIL - Password doesn't match!\n";
    }
} else {
    echo "[✗] Admin NOT found by query!\n";
}
echo "\n";

// ===== STEP 5: Final Summary =====
echo "╔════════════════════════════════════════════════════════════╗\n";
echo "║                    TEST COMPLETE                           ║\n";
echo "╚════════════════════════════════════════════════════════════╝\n\n";

echo "LOGIN CREDENTIALS:\n";
echo "  Username: admin\n";
echo "  Password: password123\n\n";

echo "NEXT STEPS:\n";
echo "1. RESTART the PHP server (stop with Ctrl+C, then restart)\n";
echo "2. Try logging in at: http://localhost:5173/admin/login\n";
echo "3. Use the credentials above\n";
echo "4. If it still fails, check browser console for errors (F12)\n\n";

echo "If you see any [✗] marks above, there's an issue that needs fixing.\n";
echo "If all shows [✓], the issue is likely in how the API is called.\n\n";

?>
