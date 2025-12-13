<?php
// migrate_roles.php

$fullConfig = require __DIR__ . '/backend/config/database.php';
$config = $fullConfig['database'];

try {
    $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}";
    $pdo = new PDO($dsn, $config['username'], $config['password']);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "Starting role migration...\n";

    // 1. Update values to integers (stored as strings temporarily)
    echo "Updating 'admin' roles to '1'...\n";
    $pdo->query("UPDATE admins SET role = '1' WHERE role = 'admin' OR role = 'super_admin'");

    echo "Updating 'seller' roles to '2'...\n";
    $pdo->query("UPDATE admins SET role = '2' WHERE role = 'seller'");

    // 2. Modify partition column type to INT
    echo "DTO column type to INT...\n";
    // Check if column is already INT to avoid error or data loss if re-run??
    // We assume it's VARCHAR(20) currently.
    $pdo->query("ALTER TABLE admins MODIFY COLUMN role INT NOT NULL DEFAULT 1");

    echo "Migration completed successfully.\n";
    echo "Role 1: Admin\nRole 2: Seller\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
