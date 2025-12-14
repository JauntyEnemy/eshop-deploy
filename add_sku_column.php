<?php

$host = 'localhost';
$db = 'zahrat_alrabie';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Check if column exists
    $stmt = $pdo->prepare("SHOW COLUMNS FROM products LIKE 'sku'");
    $stmt->execute();
    $exists = $stmt->fetch();

    if (!$exists) {
        // Add column
        $pdo->exec("ALTER TABLE products ADD COLUMN sku VARCHAR(50) DEFAULT 'kg' AFTER price");
        echo "Successfully added 'sku' column to products table.\n";
    } else {
        echo "'sku' column already exists.\n";
    }

} catch (\PDOException $e) {
    echo "Database Error: " . $e->getMessage() . "\n";
    exit(1);
}
