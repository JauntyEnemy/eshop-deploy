<?php

// Test the bcrypt hash
$hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
$password = 'password123';

echo "Testing bcrypt password verification:\n";
echo "Hash: " . $hash . "\n";
echo "Password: " . $password . "\n";
echo "Result: " . (password_verify($password, $hash) ? 'PASS ✓' : 'FAIL ✗') . "\n";

// Also create a fresh hash for reference
$freshHash = password_hash('password123', PASSWORD_BCRYPT);
echo "\nFresh hash for reference: " . $freshHash . "\n";
echo "Verify fresh hash: " . (password_verify('password123', $freshHash) ? 'PASS ✓' : 'FAIL ✗') . "\n";

?>
