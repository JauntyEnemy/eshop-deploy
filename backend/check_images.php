<?php
require 'bootstrap/app.php';

$db = $app->getContainer()->get(PDO::class);
$result = $db->query('SELECT id, name, image_url FROM products ORDER BY id DESC LIMIT 5');
$rows = $result->fetchAll();

echo "=== Last 5 Products ===\n";
foreach($rows as $row) {
    echo sprintf("ID: %d | Name: %s | URL: %s\n", 
        $row['id'], 
        $row['name'], 
        $row['image_url']
    );
}
