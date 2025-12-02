<?php

$config = require __DIR__ . '/../config/database.php';
$db = $config['database'];

$dsn = "{$db['driver']}:host={$db['host']};port={$db['port']};dbname={$db['database']}";

try {
    $pdo = new PDO($dsn, $db['username'], $db['password'], $db['options']);
    echo "✓ Database connection successful!\n";
    
    $tables = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    echo "✓ Tables found: " . count($tables) . "\n";
    foreach ($tables as $table) {
        echo "  - $table\n";
    }
} catch (PDOException $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    exit(1);
}
