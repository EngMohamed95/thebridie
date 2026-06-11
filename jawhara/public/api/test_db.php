<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/db.php';

echo "Connected successfully to DB!\n";

try {
    $stmt = $pdo->query("SELECT COUNT(*) FROM products");
    echo "Products count: " . $stmt->fetchColumn() . "\n";
} catch (Exception $e) {
    echo "Error querying products: " . $e->getMessage() . "\n";
}
