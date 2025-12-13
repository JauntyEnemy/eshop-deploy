// require __DIR__ . '/vendor/autoload.php'; // Not needed if we just use PDO directly

// Database configuration
$config = require __DIR__ . '/backend/config/database.php';

try {
    $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Password is 'password123'
    $password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

    // Check if seller exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM admins WHERE username = 'seller'");
    $stmt->execute();

    if ($stmt->fetchColumn() > 0) {
        // Update existing seller
        $sql = "UPDATE admins SET role = 'seller', password = :password WHERE username = 'seller'";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':password' => $password]);
        echo "Updated existing 'seller' user with role 'seller'.\n";
    } else {
        // Create new seller
        $sql = "INSERT INTO admins (username, password, name, role) VALUES ('seller', :password, 'Seller Account', 'seller')";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':password' => $password]);
        echo "Created new user 'seller' with role 'seller'.\n";
    }

    echo "Login Credentials:\n";
    echo "Username: seller\n";
    echo "Password: password123\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
