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

    // Check if columns exist
    $columns = ['size', 'unit_of_measurement'];

    foreach ($columns as $col) {
        // Use sanitized string directly since it's a controlled array loop
        $stmt = $pdo->query("SHOW COLUMNS FROM products LIKE '$col'");
        $exists = $stmt->fetch();

        if (!$exists) {
            $type = ($col === 'size') ? "DECIMAL(10,2) DEFAULT NULL" : "VARCHAR(50) DEFAULT NULL";
            $pdo->exec("ALTER TABLE products ADD COLUMN $col $type AFTER price");
            echo "Successfully added '$col' column.\n";
        } else {
            echo "'$col' column already exists.\n";
        }
    }

} catch (\PDOException $e) {
    echo "Database Error: " . $e->getMessage() . "\n";
    exit(1);
}
