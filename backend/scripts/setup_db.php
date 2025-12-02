<?php

// Simple database setup/import script for local development.
// Usage (Windows cmd):
//   php scripts\setup_db.php

$config = require __DIR__ . '/../config/database.php';
$db = $config['database'];

$dsn = "{$db['driver']}:host={$db['host']};port={$db['port']};charset={$db['charset']}";

try {
    // Connect without specifying a database so we can create it if missing
    $pdo = new PDO($dsn, $db['username'], $db['password'], $db['options']);

    // Read schema.sql
    $schemaFile = __DIR__ . '/../database/schema.sql';
    if (!file_exists($schemaFile)) {
        echo "schema.sql not found at: $schemaFile\n";
        exit(1);
    }

    $sql = file_get_contents($schemaFile);
    if ($sql === false) {
        echo "Failed to read schema.sql\n";
        exit(1);
    }

    // Execute multi-statement SQL. PDO::exec can run multiple statements on MySQL.
    $pdo->exec($sql);

    echo "Database and tables created/imported successfully.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}

