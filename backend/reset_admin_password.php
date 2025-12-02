<?php
/**
 * Reset Admin Password Script
 * Updates the admin password in the database with a fresh bcrypt hash
 */

// Create fresh password hash
$password = 'password123';
$hash = password_hash($password, PASSWORD_BCRYPT);

echo "===========================================\n";
echo "Admin Password Reset\n";
echo "===========================================\n\n";

echo "Plain Password: " . $password . "\n";
echo "New Hash: " . $hash . "\n\n";

echo "Update Database SQL:\n";
echo "UPDATE admins SET password = '" . $hash . "' WHERE username = 'admin';\n\n";

// Try to connect to database and update
try {
    $dsn = "mysql:host=localhost;port=3306;dbname=zahrat_alrabie;charset=utf8mb4";
    $pdo = new PDO($dsn, 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Check current admin
    echo "Current Admin in Database:\n";
    $stmt = $pdo->query("SELECT id, username, name FROM admins WHERE username = 'admin'");
    $admin = $stmt->fetch();
    
    if ($admin) {
        echo "✓ ID: " . $admin['id'] . "\n";
        echo "✓ Username: " . $admin['username'] . "\n";
        echo "✓ Name: " . ($admin['name'] ?? 'N/A') . "\n";
    } else {
        echo "✗ Admin not found!\n";
        die("\n");
    }

    // Update password
    echo "\nUpdating password...\n";
    $stmt = $pdo->prepare("UPDATE admins SET password = :password WHERE username = :username");
    $result = $stmt->execute([
        ':password' => $hash,
        ':username' => 'admin'
    ]);

    echo "✓ Password updated successfully!\n\n";

    // Verify the update
    echo "Verifying password...\n";
    $stmt = $pdo->prepare("SELECT password FROM admins WHERE username = :username");
    $stmt->execute([':username' => 'admin']);
    $admin = $stmt->fetch();

    if ($admin && password_verify($password, $admin['password'])) {
        echo "✓ Password verification PASSED!\n\n";
        echo "===========================================\n";
        echo "You can now login with:\n";
        echo "Username: admin\n";
        echo "Password: password123\n";
        echo "===========================================\n";
    } else {
        echo "✗ Password verification FAILED!\n";
    }

} catch (Exception $e) {
    echo "Database connection failed:\n";
    echo "Error: " . $e->getMessage() . "\n\n";
    echo "Manual SQL to execute:\n";
    echo "UPDATE admins SET password = '" . $hash . "' WHERE username = 'admin';\n";
}

?>
